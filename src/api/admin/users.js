import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';
import { roles } from '../../lib/db_refs';

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
            const users = await conn.execute(`
                SELECT
                    u.id,
                    email,
                    role_id,
                    first_name,
                    last_name,
                    address_1,
                    address_2,
                    city,
                    postcode,
                    mobile,
                    emergency_name,
                    emergency_email,
                    emergency_mobile,
                    secondary_name,
                    secondary_email,
                    secondary_mobile,
                    admin_text,
                    COUNT(racer_id) as racer_count
                FROM users_racers ur
                RIGHT JOIN users u
                ON u.id = ur.user_id
                WHERE verified = 1
                GROUP BY u.id`
            );

            // return
            res.status(200).json(users.rows);
            return;

        } else if (req.method === 'PUT') {

            const { id, updates } = req.body;

            const updateKeys = Object.keys(updates);
            const updateValues = updateKeys.map(key => updates[key]);
            const queryString = updateKeys.map(key => `${key} = ?`).join(",");

            const conn = await connect(config);

            // check that we're not removing the last admin user ...
            if (updateKeys.indexOf('role_id') >= 0 && updates['role_id'] !== roles.ADMIN) {
                // we're changing role FROM admin
                const adminUsers = await conn.execute(`SELECT * FROM users WHERE role_id = ${roles.ADMIN}`);
                if (adminUsers.rows.length === 1 && adminUsers.rows[0].id === id) {
                    // we're trying to remove the only admin user
                    res.status(400).json({ message: `You cannot remove admin status from the only
                        admin user; please give admin rights to another user and try again` });
                    return;
                }
            }

            const _ = await conn.execute(`
                    UPDATE users
                    SET ${queryString}
                    WHERE id=${id}
                `,
                updateValues
            );

            res.status(200).json({ message: "Successfully updated user" });
            return;

        } else if (req.method === 'DELETE') {

            const { id } = req.body;
            const conn = await connect(config);

            // check we're not trying to delete a user that has racers
            const users = await conn.execute(`
                SELECT
                    u.id,
                    role_id,
                    COUNT(racer_id) as racer_count
                FROM users u
                INNER JOIN users_racers ur
                ON u.id = ur.user_id
                WHERE u.id = ${id}
                GROUP BY ur.user_id
            `)

            if (users.rows.length === 0) {
                res.status(400).json({message: 'User not recognised'});
                return;
            }

            if (users.rows[0].racer_count > 0) {
                res.status(400).json({ message: `There are racers linked to that user; allocate them
                    to a different user and try again` });
                return;
            }

            // check that we're not trying to delete the only remaining admin

            if (users.rows[0].role_id === roles.ADMIN) {
                // the user has admin
                const adminUsers = await conn.execute(`SELECT * FROM users WHERE role_id = ${roles.ADMIN}`);
                if (adminUsers.rows.length === 1 && adminUsers.rows[0].id === id) {
                    // we're trying to remove the only admin user
                    res.status(400).json({
                        message: `You cannot delete the only admin user; please give admin rights to
                            another user and try again` });
                    return;
                }
            }

            res.status(200).json({ message: "Successfully deleted user" });
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