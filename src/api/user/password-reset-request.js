import sql from '../../lib/db';
import { tokenGenerator} from '../../lib/token';
import { tokenTypes } from '../../lib/db_refs';
import { emailResetPasswordTokenToUser } from '../../lib/mail/send_reset_token';
import addDays from 'date-fns/addDays';
import { safeDateConversion } from '../../lib/date-handler';

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {
            const { email } = req.body;
            const cleanEmail = email.toLowerCase();

            // look for a stored hash
            const users = await sql`SELECT * FROM users WHERE email = ${cleanEmail}`;

            if (users.length == 0) {
                res.status(404).json({ message: 'Email not found.' });
                return;
            }
            
            const user = users[0];

            if (!user.verified) {
                res.status(404).json({ message: 'User account awaiting verification.' });
                return;
            }

            // insert a token
            const newToken = tokenGenerator(12);
            let newDate = new Date();
            // add 7 days 
            newDate = safeDateConversion(addDays(newDate, 7));
            const _ = await sql`
                INSERT INTO tokens (
                    user_id,
                    token,
                    expires_at,
                    type_id
                )
                VALUES (
                    ${user.id},
                    ${newToken},
                    ${newDate},
                    ${tokenTypes.PASSWORD_RESET}
                )
            `;

            // send an email
            const info = await emailResetPasswordTokenToUser(newToken, email);

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
