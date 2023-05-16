import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { tokenTypes } from '../../lib/db_refs';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const getUserFromToken = async (token) => {
    const conn = await connect(config);
    const foundTokens = await conn.execute(`SELECT * FROM tokens WHERE token = '${token}'`);

    // if the token doesn't exist, return empty
    if (foundTokens.rows.length == 0) {
        return [];
    }

    // if it's not an account-request token, return empty
    const foundToken = foundTokens.rows[0];
    if (foundToken.type_id != tokenTypes.ACCOUNT_REQUEST) {
        return null;
    }

    // check the token is in date ...
    let today = new Date();
    let expiry = new Date(foundToken.expiresAt);
    if (today > expiry) {
        const _ = await conn.execute(`DELETE FROM tokens WHERE token = '${token}'`);
        return null;
    }

    // look for the user
    const foundUsers = await conn.execute(`SELECT * FROM users WHERE id = '${foundToken.user_id}'`);
    
    // if user is empty, something is wrong ...
    if (foundUsers.rows.length == 0) {
        const _ = await conn.execute(`DELETE FROM tokens WHERE token = '${token}'`);
        return null;
    }

    return foundUsers.rows[0];
}

const verifyNewUserAccount = async (token, userData) => {
    const conn = await connect(config);

    // re-check thaet the token is valid and relates to this user
    const checkUser = getUserFromToken (token);

    // if it's null or an empty array, something was wrong with the token
    if (checkUser == null || checkUser == []) {
        return null;
    }

    // if there isn't a returned id, or it doesn't match the userData, return false
    if (!checkUser || !checkUser.id || (checkUser.id !== userData.id) ) {
        return false;
    }

    // TODO: hash the password; insert the info into database row and make verified; delete the access token; set a jwt (or maybe thats in the client)
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

    if (req.method == 'GET') {
        // get the token and retrieve data
        const token = req.url.match(/\/\?token=([a-zA-Z0-9]*)$/)[1];
        const data = await getUserFromToken(token);

        // if data is null the token was invalid
        if (data === null) {
            res.status(400).json({message: 'Token is not valid.'});
            return;
        }

        // if daeta is an empty array, array wasn't found
        if (data == []) {
            res.status(404).json({message: 'Token not found.'})
            return;
        }

        // success, return the data (which will be a user)
        res.status(200).json(data);
        return;

    } else if (req.method == 'POST') {
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

        console.log(result);
        res.status(200).json({ message: "hi there" });
        return;

    } else {
        // method is not GET or POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}