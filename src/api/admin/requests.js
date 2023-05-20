import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { emailNewAccountTokenToUser } from '../../lib/mail/send_signup_token';
import { token } from '../../lib/token.';
import { tokenTypes } from '../../lib/db_refs';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const verifyUser = async (id, email, freetext) => {
    const conn = await connect(config);
    
    const params = [
        freetext,
        true
    ];
    const results = await conn.transaction(async (tx) => {
        // update the user
        const tryUpdateUser = await tx.execute(`
                    UPDATE users
                    SET
                        freetext = ?,
                        verified = ?
                    WHERE email="${email}"`,
            params
        );

        // create a new token and insert it
        const newToken = token(12);
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 7); // 7 days to use token
        const tryNewToken = await tx.execute(
            'INSERT INTO tokens (user_id, token, expiresAt, type_id) VALUES (?,?,?,?)',
            [id, newToken, newDate, tokenTypes.ACCOUNT_REQUEST]
        )

        return {
            tryUpdateUser,
            tryNewToken,
            newToken
        }
    });

    return results;
}

export default async function handler(req, res) {

    if (req.method == 'GET') {
        const conn = await connect(config);

        try {
            const users = await conn.execute(`
                SELECT id, email, freetext
                FROM users
                WHERE verified = FALSE`
            );
            const racers = await conn.execute('SELECT id FROM racers WHERE verified = FALSE');
            
            res.status(200).json({
                users: users.rows,
                racers: racers.rows
            });
            return;

        } catch (error) {
            console.log(error.message);
            // generic error message
            res.status(500).json({ message: "Server error: bad request" });
            return;
        }
    
    } else if (req.method === 'POST') {

        try {
            const { type } = req.body;

            if (type === 'user') {
                const { id, email, freetext } = req.body;
                const results = await verifyUser(id, email, freetext);
                
                // trigger an email to the new user
                const _ = await emailNewAccountTokenToUser(results.newToken, email);

                // done
                res.status(200).json({ message: "Successfully updated user"});
                return;

            } else {
                // type will be racer ...

                // ** TODO **
            }

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message});
            return;
        }
    
    } else if (req.method === 'DELETE') {

        try {
            const { type } = req.body;

            if (type === 'user') {
                const { id } = req.body;
                const conn = await connect(config);
                const _ = await conn.execute(`DELETE FROM users WHERE id = ${id}`);

                res.status(200).json({message: "Successfully deleted user"});
                return;

            } else {
                // type is going to be racer

                // ** TODO **
            }

        } catch (error) {
            console.log(error.message);
            res.status(500).json({message: error.message});
            return;
        }

    } else {
        // method is not GET, POST or DELETE, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}