import sql from '../../lib/db';
import { roles } from '../../lib/db_refs';
import { emailNewAccountTokenToUser } from '../../lib/mail/send_signup_token';
import { sendShortEmail } from '../../lib/mail/send_short_email';
import insertUser from '../../lib/users/insertNewUser';

export default async function handler(req, res) {

    if (req.method == 'POST') {

        // check that we were passed a valid email address and if not fail gracefully
        const validEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        if (!req.body || !req.body.email || !validEmail(req.body.email)) {
            res.status(400).json({ message: "ERROR: email not provided or not valid" });
            return;
        }

        const email = req.body.email;
        const cleanEmail = email.toLowerCase();

        const admin = await sql`SELECT email FROM users WHERE role_id = ${roles.ADMIN}`;

        if (admin.length == 0) {
            // there are no admin users, so we need to set admin rights on this user and immediately validate
            try {
                const results = await insertUser(sql, cleanEmail, roles.ADMIN, true);
                
                // trigger an email to the new admin
                const _ = await emailNewAccountTokenToUser(results.newToken, email);

                // all well
                res.status(200).json({ message: "success" });
                return;
                
            } catch (error) {
                // special case - failed due to duplicate error message
                const m = error.message;
                if (/Duplicate entry/.test(m)) {
                    res.status(500).json({ message: "Account already exists for that email address" });
                    return;
                };
                // otherwise generic error message
                console.log(error);
                res.status(500).json({ message: "Server error: bad request" });
                return;
            }
        
        } else {
            // we have one or more admin users, so progress as usual
            try {
                let _ = await insertUser(sql, cleanEmail, roles.USER);

                // trigger an email to the admins
                _ = await sendShortEmail(
                    admin.map(item => item.email),
                    "New User Request",
                    "New User Request",
                    `A user has requested a new account be created, please log in to the admin
                        dashboard to review`
                );
                
                // trigger an email to the user
                _ = await sendShortEmail(
                    [email],
                    "New User Request",
                    "New User Request",
                    `Your request has been sent to the coaching team for review.`
                );

                // all well
                res.status(200).json({ message: "success" });
                return;

            } catch (error) {
                // special case - failed due to duplicate error message
                const m = error.message;
                if (/Duplicate entry/.test(m)) {
                    res.status(500).json({ message: "Account already exists for that email address" });
                    return;
                };
                // otherwise generic error message
                res.status(500).json({ message: "Server error: bad request" });
                return;
            }
        }

    } else {
        // method is not POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}