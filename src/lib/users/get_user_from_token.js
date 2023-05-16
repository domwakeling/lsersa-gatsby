import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { tokenTypes } from '../db_refs';

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

export {
    getUserFromToken
}