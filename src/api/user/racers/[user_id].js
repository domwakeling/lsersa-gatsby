import sql from '../../../lib/db';
import { verifyUserHasAdminRole } from '../../../lib/admin/verify_admin';
import { veryIdMatchesJWT } from '../../../lib/users/verify_user_id';

export default async function handler(req, res) {

    if (req.method == 'GET') {

        try {

            // get the id
            const user_id = req.params.user_id;

            // get JWT (prevents random requests)
            const userJWT = req.cookies.lsersaUserToken;
            if (!userJWT || userJWT === undefined || userJWT === null) {
                // error, most likely didn't find a cookie
                res.status(204).json({ message: "Cookie not found" });
                return;    
            }

            // get admin status from JWT
            const hasAdmin = await verifyUserHasAdminRole(userJWT);

            // check if the user matches the JWT-stored identifier
            const isUser = await veryIdMatchesJWT(user_id, userJWT);

            if (!isUser && !hasAdmin) {
                // not self and not an admin
                res.status(401).json({ message: 'ERROR: You do not have access' });
                return;
            }

            // get the racers for the user
            const racers = await sql`
                SELECT *
                FROM users_racers ur
                INNER JOIN racers ra
                ON ur.racer_id = ra.id
                WHERE ur.user_id = ${user_id}
            `;

            res.status(200).json({racers: racers});
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