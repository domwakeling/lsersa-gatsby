import { tokenTypes } from "../db_refs";
import { tokenGenerator} from "../token";
import addDays from 'date-fns/addDays';
import { safeDateConversion } from "../date-handler";

const insertUser = async (conn, email, role_id, verified=false) => {
    const results = await conn.transaction(async (tx) => {
        // insert a new user into users table
        const newIdentifier = tokenGenerator(20);
        const cleanEmail = email.toLowerCase();
        const tryNewUser = await tx.execute(
            'INSERT INTO users (email, role_id, verified, identifier) VALUES (?,?,?,?)',
            [cleanEmail, role_id, verified, newIdentifier]
        );
        if (verified) {
            // insert a new ACCOUNT_REQUEST token for that user in the tokens table IF verified
            const newUserId = tryNewUser.insertId;
            const newToken = tokenGenerator(12);
            let newDate = new Date();
            // add 7 days
            newDate = safeDateConversion(addDays(newDate, 7));
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

