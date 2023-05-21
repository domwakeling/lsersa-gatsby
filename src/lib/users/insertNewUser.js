import { tokenTypes } from "../db_refs";
import { token } from "../token";

const insertUser = async (conn, email, role_id, verified=false) => {
    const results = await conn.transaction(async (tx) => {
        // insert a new user into users table
        const newIdentifier = token(20);
        const tryNewUser = await tx.execute(
            'INSERT INTO users (email, role_id, verified, identifier) VALUES (?,?,?,?)',
            [email, role_id, verified, newIdentifier]
        );
        if (verified) {
            // insert a new ACCOUNT_REQUEST token for that user in the tokens table IF verified
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
        } else {
            return {
                tryNewUser
            }
        }
    });

    return results;
}

export default insertUser;

