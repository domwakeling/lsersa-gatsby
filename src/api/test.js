import { fetch } from 'undici';
import { connect } from '@planetscale/database';
// import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    try {
        // check user has admin rights
        // const token = req.cookies.lsersaUserToken;
        // const hasAdmin = await verifyUserHasAdminRole(token);
        // if (!hasAdmin) {
        //     res.status(401).json({ message: 'ERROR: You do not have admin access' });
        //     return;
        // }

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
                FROM users u
                INNER JOIN users_racers ur
                ON u.id = ur.user_id
                WHERE verified = 1
                GROUP BY ur.user_id`
            );

            // return
            res.status(200).json(users.rows);
            return;

            // } else if (req.method === 'POST') {

            //     const { type } = req.body;

            //     // ** TODO: check what date is doing here

            //     if (type === 'user') {
            //         const { id, email, admin_text } = req.body;
            //         const results = await verifyUser(id, email, admin_text);

            //         // trigger an email to the new user
            //         const _ = await emailNewAccountTokenToUser(results.newToken, email);

            //         // done
            //         res.status(200).json({ message: "Successfully updated user" });
            //         return;

            //     } else {
            //         // type will be racer ...
            //         const { id, club_expiry, club_id, concession, admin_text } = req.body;
            //         const _ = await verifyRacer(id, club_expiry, club_id, concession, admin_text);

            //         res.status(200).json({ message: "Successfully updated racer" });
            //         return;
            //     }

            // } else if (req.method === 'DELETE') {

            //     const { type } = req.body;

            //     if (type === 'user') {
            //         const { id } = req.body;
            //         const conn = await connect(config);
            //         const _ = await conn.execute(`DELETE FROM users WHERE id = ${id}`);

            //         res.status(200).json({ message: "Successfully deleted user" });
            //         return;

            //     } else {
            //         // type is going to be racer
            //         const { id } = req.body;
            //         const conn = await connect(config);
            //         const _ = await conn.execute(`DELETE FROM racers WHERE id = ${id}`);

            //         res.status(200).json({ message: "Successfully deleted user" });
            //         return;
            //     }

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