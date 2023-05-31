import { fetch } from 'undici';
import { connect } from '@planetscale/database';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}


export default async function handler(req, res) {

    if (req.method == 'GET') {

        try {

            // check there's a token stored - if not, not valid; not going to worry about validating
            const token = req.cookies.lsersaUserToken;
            if (!token || token === undefined || token === null) {
                // error, most likely didn't find a cookie
                res.status(204).json({ message: "Cookie not found" });
                return;
            }

            // get information
            const { date } = req.params;
            const conn = await connect(config);
            const session = await conn.execute(`SELECT * FROM sessions WHERE date = '${date}'`);

            // if no session, exit
            if (session.rows.length === 0) {
                res.status(204).json({message: 'Session not found'});
                return;
            }

            // get bookings
            const bookings = await conn.execute(`SELECT * FROM bookings WHERE session_date = '${date}'`)
            const data = {
                session: session.rows[0],
                bookings: bookings.rows
            }
            
            // return data
            res.status(200).json(data);
            return;

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
            return;
        }

    } else {
        // method is not GET, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}