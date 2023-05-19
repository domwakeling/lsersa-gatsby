import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { roles, tokenTypes } from '../../lib/db_refs';
import { token } from '../../lib/token.';
import { emailNewAccountTokenToUser } from '../../lib/mail/send_signup_token';
import { sendShortEmail } from '../../lib/mail/send_short_email';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const insertUser = async (conn, email, role_id) => {
    const results = await conn.transaction(async (tx) => {
        // insert a new user into users table
        const newIdentifier = token(20);
        const tryNewUser = await tx.execute(
            'INSERT INTO users (email, role_id, verified, identifier) VALUES (?,?,?,?)',
            [email, role_id, false, newIdentifier]
        );
        // insert a new ACCOUNT_REQUEST token for that user in the tokens table
        const newUserId = tryNewUser.insertId;
        const newToken = token(12);
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 7); // 7 days to use token
        const tryNewToken = await tx.execute(
            'INSERT INTO tokens (user_id, token, expiresAt, type_id) VALUES (?,?,?,?)',
            [newUserId, newToken, newDate, tokenTypes.ACCOUNT_REQUEST]
        )
        // return the info
        return {
            tryNewUser,
            tryNewToken,
            newToken
        }
    });

    return results;
}

export default async function handler(req, res) {

    if (req.method == 'POST') {

        // check that we were passed a valid email address and if not fail gracefully
        const validEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        if (!req.body || !req.body.email || !validEmail(req.body.email)) {
            res.status(400).json({ message: "ERROR: email not provided or not valid" });
            return;
        }

        const email = req.body.email;
        const conn = await connect(config);
        const admin = await conn.execute(`SELECT email FROM users WHERE role_id = ${roles.ADMIN}`);

        if (admin.rows.length == 0) {
            // there are no admin users, so we need to set admin rights on this user
            try {
                const results = await insertUser(conn, email, roles.ADMIN);
                
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
                res.status(500).json({ message: "Server error: bad request" });
                return;
            }
        
        } else {
            // we have one or more admin users, so progress as usual
            try {
                let _ = await insertUser(conn, email, roles.USER);

                // trigger an email to the admins
                _ = await sendShortEmail(
                    admin.rows.map(item => item.email),
                    "[TEST, IGNORE] New User Request",
                    "New User Request",
                    `A user has requested a new account be created, please log in to the admin
                        dashboard to review`
                );
                
                // trigger an email to the user
                _ = await sendShortEmail(
                    [email],
                    "[TEST, IGNORE] New User Request",
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