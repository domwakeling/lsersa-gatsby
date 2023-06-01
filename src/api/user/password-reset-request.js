import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { token } from '../../lib/token';
import { tokenTypes } from '../../lib/db_refs';
import { emailResetPasswordTokenToUser } from '../../lib/mail/send_reset_token';
import addDays from 'date-fns/addDays';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {
            const { email } = req.body;
            const cleanEmail = email.toLowerCase();

            // look for a stored hash
            const conn = await connect(config);
            const users = await conn.execute(`SELECT * FROM users WHERE email = '${cleanEmail}'`);

            const user = users.rows[0];

            if (!user == undefined) {
                res.status(404).json({ message: 'Email not found.' });
                return;
            }

            // insert a token
            const newToken = token(12);
            let newDate = new Date();
            // add 7 days, get the ISOString and remove time (this ensures it's UTC)
            newDate = addDays(newDate, 7).toISOString().split("T")[0];
            const _ = await conn.execute(
                'INSERT INTO tokens (user_id, token, expiresAt, type_id) VALUES (?,?,?,?)',
                [user.id, newToken, newDate, tokenTypes.PASSWORD_RESET]
            )

            // send an email
            emailResetPasswordTokenToUser(newToken, email)

            //
            res.status(200).json({ message: 'Success' });
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
