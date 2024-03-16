import sql from '../db';
import parseISO from 'date-fns/parseISO';

const getUserFromToken = async (token, tokenType) => {
    const foundTokens = await sql`SELECT * FROM tokens WHERE token = ${token}`;
    
    // if the token doesn't exist, return empty
    if (foundTokens.length == 0) {
        return [];
    }

    // if it's not an account-request token, return empty
    const foundToken = foundTokens[0];
    if (foundToken.type_id != tokenType) {
        return null;
    }

    // check the token is in date ...
    let today = new Date();
    let expiry = parseISO(foundToken.expires_at + "Z");
    if (today > expiry) {
        const _ = await sql`DELETE FROM tokens WHERE token = ${token}`;
        return null;
    }

    // look for the user
    const foundUsers = await sql`SELECT * FROM users WHERE id = ${foundToken.user_id}`;

    // if user is empty, something is wrong ...
    if (foundUsers.length == 0) {
        const _ = await sql`DELETE FROM tokens WHERE token = ${token}`;
        return null;
    }

    return foundUsers[0];
}

export {
    getUserFromToken
}