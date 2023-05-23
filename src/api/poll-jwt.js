import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { getIdFromToken } from '../lib/jwt-methods';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    if (req.method === 'GET') {

        try {
            const token = req.cookies.lsersaUserToken;
            const identifier = getIdFromToken(token);

            if (identifier) {
                // check that the identifier returns a valid user
                const conn = await connect(config);
                const results = await conn.execute(`SELECT * FROM users WHERE identifier = '${identifier}'`);

                if (results.rows.length > 0) {
                    // identifier has returned a valid user, all good
                    res.status(200).json(results.rows[0]);
                    return;
                } else {
                    // there is no valid user ...
                    res.status(204).json({ message: "No valid id found" });
                    return;    
                }

            } else {// there was no identifier so token invalid
                res.status(204).json({ message: "No id found" });
                return;    
            }

        } catch (error) {
            // error, most likely didn't find a cookie
            res.status(204).json({ message: "Cookie not found" });
            return;    
        }

    } else {
        // method was not GET, gracefully fail
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}