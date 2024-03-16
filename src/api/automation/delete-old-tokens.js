import sql from '../../lib/db';
import { safeDateConversion } from '../../lib/date-handler';


export default async function handler(req, res) {

    try {

        if (req.method === 'POST') {

            const todayString = safeDateConversion(new Date());
            
            const checks = await sql`
                DELETE FROM tokens WHERE expires_at < ${todayString} RETURNING *
            `;
            
            res.status(200).json(checks);
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