import sql from '../../lib/db';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';
import { insertNewRacer } from '../../lib/users/addNewRacer';


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
            const racers = await sql`
                SELECT
                    racer_id,
                    user_id,
                    email,
                    r.first_name as "first_name",
                    r.last_name as "last_name",
                    dob,
                    gender_id,
                    concession,
                    club_id,
                    club_expiry,
                    user_text,
                    r.admin_text as "admin_text"
                FROM users_racers ur
                LEFT JOIN racers r
                ON ur.racer_id = r.id
                LEFT JOIN users u
                ON ur.user_id = u.id
            `;

            const userEmails = await sql`SELECT id as "user_id", email FROM users`;

            const clubs = await sql`SELECT id, name FROM clubs`;

            // return
            res.status(200).json({
                racers: racers,
                user_emails: userEmails,
                clubs: clubs
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

            if (updateKeys.length === 0) {
                // the only change is the user_id
                const _ = await sql`
                    UPDATE users_racers
                    SET user_id = ${user_id}
                    WHERE racer_id = ${racer_id}
                `;
                res.status(200).json({message: 'Racer user-account updated'});
                return;
            }

            const _ = await sql.begin(async sql => {
                
                const tryUpdateUser = await sql`
                    UPDATE racers
                    SET ${
                        sql(updates, updateKeys)
                    }
                    WHERE id=${racer_id}
                    RETURNING *
                `;

                let tryUpdateUserRacer = {};

                if (user_id) {
                    tryUpdateUserRacer = await sql`
                        UPDATE users_racers
                        SET user_id = ${user_id}
                        WHERE racer_id = ${racer_id}
                        RETURNING *
                    `;
                }

                return [
                    tryUpdateUser[0],
                    tryUpdateUserRacer[0]
                ]

            });

            res.status(200).json({ message: "Successfully updated user" });
            return;
            

        } else if (req.method === 'DELETE') {
            // delete a racer as admin

            const { id } = req.body;

            // check if there's any booking sessions for that racer
            const bookings = await sql`SELECT racer_id FROM bookings WHERE racer_id = ${id}`;
            if (bookings.length > 0) {
                res.status(400).json({message: 'Racer has bookings, unable to delete'});
            }

            // good to go
            const _ = await sql.begin(async sql => {
                
                const tryDeleteUserRacer = await sql`DELETE FROM users_racers WHERE racer_id = ${id}`;
                const tryDeleteRacer = await sql`DELETE FROM racers WHERE id = ${id}`;

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