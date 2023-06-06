import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { roles } from '../../lib/db_refs';
import insertUser from '../../lib/users/insertNewUser';
import { adminEmailNewAccountTokenToUser } from '../../lib/mail/admin_send_signup_token';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    if (req.method == 'POST') {

        // check that we were passed a valid email address and if not fail gracefully
        const validEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        if (!req.body || !req.body.email || !validEmail(req.body.email)) {
            res.status(400).json({ message: "ERROR: Email not provided or not valid" });
            return;
        }

        try {
            // check that the user sending the request is an admin
            const userJWT = req.cookies.lsersaUserToken;
            const hasAdmin = await verifyUserHasAdminRole(userJWT);
            if (!hasAdmin) {
                res.status(401).json({ message: 'ERROR: User does not have admin access' });
                return;
            }
            
            // insert the user
            const conn = await connect(config);
            const { email } = req.body;
            let results = await insertUser(conn, email, roles.USER, true);

            // trigger an email to the user
            let _ = await adminEmailNewAccountTokenToUser(
                results.newToken,
                email
            );

            // all well
            res.status(200).json({ message: "success" });
            return;

        } catch (error) {
            // special case - failed due to duplicate error message
            const m = error.message;
            if (/Duplicate entry/.test(m)) {
                res.status(409).json({ message: "Account already exists for that email address" });
                return;
            };
            // otherwise generic error message
            res.status(500).json({ message: "SERVER ERROR: bad request" });
            return;
        }
        

    } else {
        // method is not POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}