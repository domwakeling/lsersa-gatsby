import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { safeDateConversion } from '../../lib/date-handler';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    try {

        if (req.method === 'POST') {

            const conn = connect(config);
            
            const todayString = safeDateConversion(new Date());
            
            const checks = await conn.execute(
                'DELETE FROM tokens WHERE expiresAt < ?',
                [todayString]
            );
            
            res.status(200).json(checks.rows);
            return;
        } else {
            // method not accepted
            res.status(405).json({ message: "ERROR: method not allowed" });
            return;
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }

}