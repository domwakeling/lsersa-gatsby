import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { verifyUserHasAdminRole } from '../../../lib/admin/verify_admin';
import { verifyIdMatchesToken } from '../../../lib/users/verify_user_id';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    if (req.method == 'GET') {

        try {

            // get the id
            const user_id = req.params.user_id;

            // get token (prevents random requests)
            const token = req.cookies.lsersaUserToken;
            if (!token || token === undefined || token === null) {
                // error, most likely didn't find a cookie
                res.status(204).json({ message: "Cookie not found" });
                return;    
            }

            // get admin status from token
            const hasAdmin = await verifyUserHasAdminRole(token);

            // check if the user matches the JWT-stored identifier
            const isUser = await verifyIdMatchesToken(user_id, token);

            if (!isUser && !hasAdmin) {
                // not self and not an admin
                res.status(401).json({ message: 'ERROR: You do not have access' });
                return;
            }

            // get the racers for the user
            const conn = connect(config);
            const racers = await conn.execute(`
                SELECT *
                FROM users_racers ur
                INNER JOIN racers ra
                ON ur.racer_id = ra.id
                WHERE ur.user_id = ${user_id}
            `);

            res.status(200).json({racers: racers.rows});
            return;

        } catch (error) {
            console.log(error.message);
            res.status(500).json({message: error.message});
            return;
        }

    } else {
        // method is not GET, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}