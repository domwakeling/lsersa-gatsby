import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { verifyIdMatchesToken } from '../../lib/users/verify_user_id';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    try {
        // ensure that the user is changing their own users
        const token = req.cookies.lsersaUserToken;
        const { user_id } = req.body;
        const validToken = verifyIdMatchesToken(user_id, token);
        if (!validToken) {
            res.status(401).json({ message: 'ERROR: You do not have access' });
            return;
        }

        if (req.method === 'POST') {
            // get details and build dates
            const { racer_id, date } = req.body;
            const session_date = date.split("T")[0];
            const expiryDate = new Date(session_date);
            expiryDate.setDate(expiryDate.getDate() + 30); // keep bookings for 30 days after session

            // insert
            const conn = await connect(config);
            const _ = await conn.execute(
                'INSERT INTO bookings (session_date, racer_id, paid, expiresAt) VALUES (?,?,?,?)',
                [session_date, racer_id, false, expiryDate]
            );

            // return
            res.status(200).json({ message: 'Added new club' });
            return;

        } else {
            // method is not acceptable, fail gracefully
            res.status(405).json({ message: "ERROR: method not allowed" });
            return;
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
        return;
    }
}