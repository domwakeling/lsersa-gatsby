import sql from '../../../lib/db';

export default async function handler(req, res) {

    if (req.method == 'GET') {

        try {

            // check there's a JWT stored - if not, not valid; not going to worry about validating
            const userJWT = req.cookies.lsersaUserToken;
            if (!userJWT || userJWT === undefined || userJWT === null) {
                // error, most likely didn't find a cookie
                res.status(204).json({ message: "Cookie not found" });
                return;
            }

            // get information
            const { date } = req.params;
            
            const session = await sql`SELECT * FROM sessions WHERE date = ${date}`;

            // if no session, exit
            if (session.length === 0) {
                res.status(204).json({message: 'Session not found'});
                return;
            }

            // get bookings
            const bookings = await sql`SELECT * FROM bookings WHERE session_date = ${date}`;
            const data = {
                session: session[0],
                bookings: bookings
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