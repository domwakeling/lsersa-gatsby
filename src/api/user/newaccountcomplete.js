import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { getUserFromToken } from '../../lib/users/get_user_from_token';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const verifyNewUserAccount = async (token, userData) => {
    // re-check thaet the token is valid and relates to this user
    const checkUser = await getUserFromToken (token);
    
    // if it's null or an empty array, something was wrong with the token
    if (checkUser == null || checkUser == []) {
        return null;
    }

    // if there isn't a returned id, or it doesn't match the userData, return false
    if (!checkUser || !checkUser.id || (checkUser.id !== userData.id) ) {
        return false;
    }

    // TODO: hash the password; insert the info into database row and make verified; delete the access token; set a jwt (or maybe thats in the client)
    // const conn = await connect(config);
    return [token, userData];
}

// const insertUser = async (conn, email, role_id) => {
//     const results = await conn.transaction(async (tx) => {
//         // insert a new user into users table
//         const newIdentifier = token(20);
//         const tryNewUser = await tx.execute(
//             'INSERT INTO users (email, role_id, verified, identifier) VALUES (?,?,?,?)',
//             [email, role_id, false, newIdentifier]
//         );
//         // insert a new ACCOUNT_REQUEST token for that user in the tokens table
//         const newUserId = tryNewUser.insertId;
//         const newToken = token(12);
//         const newDate = new Date();
//         newDate.setDate(newDate.getDate() + 7); // 7 days to use token
//         const tryNewToken = await tx.execute(
//             'INSERT INTO tokens (user_id, token, expiresAt, type_id) VALUES (?,?,?,?)',
//             [newUserId, newToken, newDate, tokenTypes.ACCOUNT_REQUEST]
//         )
//         // return the info
//         return {
//             tryNewUser,
//             tryNewToken,
//             newToken
//         }
//     });

//     return results;
// }

export default async function handler(req, res) {

    if (req.method == 'POST') {
        // get data from the body and instigate ...
        const { user, token } = req.body;
        const result = await verifyNewUserAccount(token, user);

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

        res.status(200).json({ message: "hi there" });
        return;

    } else {
        // method is not POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}