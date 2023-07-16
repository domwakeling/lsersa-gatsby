import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { verifyUserHasAdminRole } from "../../lib/admin/verify_admin";

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    if (req.method === 'GET') {

        try {
            // ensure user has admin rights
            const userJWT = req.cookies.lsersaUserToken;
            const hasAdmin = await verifyUserHasAdminRole(userJWT);
            if (!hasAdmin) {
                // without admin use we can only GET info ...
                console.log("Trying an operation without admin status")
                res.status(401).json({ message: 'ERROR: You do not have admin access' });
                return;
            }
            
            // need to get all main and secondary emails, and ensure no duplicates ...
            const conn = await connect(config);

            const users = await conn.execute('SELECT email, secondary_email FROM users');

            const userEmails = users.rows.map(user => user.email);
            const secondEmails = users.rows
                .filter(user => (user.secondary_email && user.secondary_email !== ''))
                .map(user => user.secondary_email);

            const emails = Array.from(new Set([...userEmails, ...secondEmails])).sort();
            const emailCount = emails.length;

            res.status(200).json({ emailCount: emailCount });
            return;


        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
            return;
        }


    } else {
        // method is not acceptable, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}