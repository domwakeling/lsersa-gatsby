import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { getIdFromToken } from '../../../lib/jwt-methods';
import { verifyUserHasAdminRole } from '../../../lib/admin/verify_admin';

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

            // get identifier from token; get user from db; check they align OR user has admin
            const identifier = getIdFromToken(token);
            const conn = await connect(config);
            const users = await conn.execute(`SELECT * FROM users where id = '${user_id}'`);
            
            const user = users.rows[0];
            if (!user) {
                res.status(400).json({message: 'ERROR: No such user'});
                return;
            }

            if (user.identifier !== identifier && !hasAdmin) {
                // not self and not an admin
                res.status(401).json({ message: 'ERROR: You do not have access' });
                return;
            }

            // get the racers for the user
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