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
        const conn = await connect(config);
        
        try {
            const users = await conn.execute('SELECT id FROM users WHERE verified = FALSE');
            const racers = await conn.execute('SELECT id FROM racers WHERE verified = FALSE');

            res.status(200).json({
                users: users.rows.length,
                racers: racers.rows.length
            });
            return;

        } catch (error) {
            console.log(error.message);
            // generic error message
            res.status(500).json({ message: "Server error: bad request" });
            return;
        }

    } else {
        // method is not POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}