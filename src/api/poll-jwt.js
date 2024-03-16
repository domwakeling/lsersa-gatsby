import sql from '../lib/db.js';
import { getIdentifierFromJWT } from '../lib/jwt-methods';

export default async function handler(req, res) {

    if (req.method === 'GET') {

        try {
            const userJWT = req.cookies.lsersaUserToken;
            if (!userJWT) {
                console.log("No cookie found");
                res.status(204).json({ message: "Cookie not found" });
                return;       
            }

            const identifier = getIdentifierFromJWT(userJWT);

            if (identifier) {
                // check that the identifier returns a valid user
                const results = await sql`
                    SELECT * FROM users WHERE identifier = ${identifier};
                `;

                if (results.length > 0) {
                    // identifier has returned a valid user, all good
                    res.status(200).json(results[0]);
                    return;
                } else {
                    // set max-age = 0 to effectively delete the cookie
                    res.setHeader("Set-Cookie", `lsersaUserToken=null; Max-Age=0; Path=/`);
                    res.status(204).json({ message: "No valid identifier found" });
                    return;    
                }

            } else {
                // there was no identifier so JWT invalid ... clear the cookie to be sure
                // set max-age = 0 to effectively delete the cookie
                res.setHeader("Set-Cookie", `lsersaUserToken=null; Max-Age=0; Path=/`);
                res.status(204).json({ message: "No identifier found" });
                return;    
            }

        } catch (error) {
            // error, generic
            res.status(500).json({ message: error.message });
            return;    
        }

    } else {
        // method was not GET, gracefully fail
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}
