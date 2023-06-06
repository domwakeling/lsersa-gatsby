import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import brcypt from 'bcryptjs';
import { getUserFromToken } from '../../lib/users/get_user_from_token';
import { tokenTypes } from '../../lib/db_refs';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const verifyNewUserAccount = async (token, id, password) => {
    // re-check that the token is valid and relates to this user
    const checkUser = await getUserFromToken(token, tokenTypes.PASSWORD_RESET);

    // if it's null or an empty array, something was wrong with the token
    if (checkUser == null || checkUser == []) {
        return null;
    }

    // if there isn't a returned id, or it doesn't match the userData, return false
    if (!checkUser || !checkUser.id || (checkUser.id !== id)) {
        return false;
    }

    // user matches so prepare to update; last element of params is the verified status
    const hashedPassword = brcypt.hashSync(password, 10);
    const params = [hashedPassword];

    const conn = await connect(config);
    const results = await conn.transaction(async (tx) => {
        // update the record

        const tryNewUser = await tx.execute(`
            UPDATE users
            SET
                password_hash = ?
            WHERE id=${id}`,
            params
        );

        // delete all password-reset tokens for that user
        const tryDeleteToken = await tx.execute(
            `DELETE FROM tokens WHERE user_id = ? AND type_id = ?`,
            [id, tokenTypes.PASSWORD_RESET]
        );

        return {
            tryNewUser,
            tryDeleteToken
        }
    });

    return {
        results
    };
}

export default async function handler(req, res) {

    if (req.method == 'POST') {
        // get data from the body and instigate ...
        const { id, token, password } = req.body;

        try {
            const result = await verifyNewUserAccount(token, id, password);

            // if result is null there was something wrong with the token
            if (result === null) {
                res.status(400).json({ message: 'Token is not valid.' });
                return;
            }

            // if result is false, there was no user or it doesn't match the user sent with POST
            if (result === false) {
                res.status(404).json({ message: 'User does not match.' })
                return;
            }

            res.status(200).json({ message: "successfully reset password" });
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
