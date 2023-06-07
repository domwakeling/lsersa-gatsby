import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';
import { insertNewRacer } from '../../lib/users/addNewRacer';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    try {
        // check user has admin rights
        const userJWT = req.cookies.lsersaUserToken;
        const hasAdmin = await verifyUserHasAdminRole(userJWT);
        if (!hasAdmin) {
            res.status(401).json({ message: 'ERROR: You do not have admin access' });
            return;
        }

        if (req.method == 'GET') {
            // get info
            const conn = await connect(config);
            const racers = await conn.execute(`
                SELECT
                    racer_id,
                    user_id,
                    email,
                    r.first_name as first_name,
                    r.last_name as last_name,
                    dob,
                    gender_id,
                    concession,
                    club_id,
                    club_expiry,
                    user_text,
                    r.admin_text as admin_text
                FROM users_racers ur
                LEFT JOIN racers r
                ON ur.racer_id = r.id
                LEFT JOIN users u
                ON ur.user_id = u.id`
            );

            const userEmails = await conn.execute ('SELECT id as user_id, email FROM users');

            const clubs = await conn.execute('SELECT id, name FROM clubs');

            // return
            res.status(200).json({
                racers: racers.rows,
                user_emails: userEmails.rows,
                clubs: clubs.rows
            });
            return;

        } else if (req.method === 'POST') {
            // insert a new user by admin

            const { user_id, updates: new_racer } = req.body;

            let result = await insertNewRacer(user_id, new_racer, true);

            res.status(200).json({ message: "Successfully updated user", racer_id: parseInt(result[2]) });
            return;

        } else if (req.method === 'PUT') {
            // update a user from admin

            const { racer_id, user_id, updates } = req.body;

            const updateKeys = Object.keys(updates);

            // check that there are updates in the body
            if (updateKeys.length === 0 && !user_id) {
                res.status(400).json({message: "No updates sent"});
                return;
            }

            const conn = await connect(config);

            if (updateKeys.length === 0) {
                // the only change is the user_id
                const _ = await conn.execute(`
                            UPDATE users_racers
                            SET user_id = ?
                            WHERE racer_id = ?
                        `,
                    [user_id, racer_id]
                )
                res.status(200).json({message: 'Racer user-account updated'});
                return;
            }

            // create the params for upload and the query string for SET
            const updateValues = updateKeys.map(key => updates[key]);
            const queryString = updateKeys.map(key => `${key} = ?`).join(",");

            const _ = await conn.transaction(async (tx) => {
                const tryUpdateUser = await tx.execute(`
                        UPDATE racers
                        SET ${queryString}
                        WHERE id=${racer_id}
                    `,
                    updateValues
                );

                let tryUpdateUserRacer = {};

                if (user_id) {
                    tryUpdateUserRacer = await tx.execute(`
                            UPDATE users_racers
                            SET user_id = ?
                            WHERE racer_id = ?
                        `,
                        [user_id, racer_id]
                    )
                }

                return [
                    tryUpdateUser,
                    tryUpdateUserRacer
                ]
            })

            res.status(200).json({ message: "Successfully updated user" });
            return;

        } else if (req.method === 'DELETE') {
            // delete a racer as admin

            const { id } = req.body;

            const conn = await connect(config);

            // check if there's any booking sessions for that racer
            const bookings = await conn.execute(`SELECT racer_id FROM bookings WHERE racer_id = ${id}`);
            if (bookings.rows.length > 0) {
                res.status(400).json({message: 'Racer has bookings, unable to delete'});
            }

            // good to go
            const result = await conn.transaction(async (tx) => {
                const tryDeleteRacer = await tx.execute(`DELETE FROM racers WHERE id =${id}`);
                const tryDeleteUserRacer = await tx.execute(`DELETE FROM users_racers WHERE racer_id = ${id}`)
                return [
                    tryDeleteRacer,
                    tryDeleteUserRacer
                ]
            });

            res.status(200).json({ message: "Successfully deleted racer" });
            return;
            

        } else {
            // method is not accepted, fail gracefully
            res.status(405).json({ message: "ERROR: method not allowed" });
            return;
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
        return;
    }
}