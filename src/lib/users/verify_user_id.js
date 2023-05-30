import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { getIdentifierFromToken } from '../jwt-methods';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const verifyIdMatchesToken = async (id, userToken) => {

    try {
        const identifier = await getIdentifierFromToken(userToken);

        const conn = await connect(config);
        const foundUsers = await conn.execute(`
            SELECT identifier, role_id FROM users WHERE identifier = '${identifier}'
        `);

        // if the identifier doesn't exist, return empty
        if (foundUsers.rows.length == 0) {
            return false;
        }

        // check if the id matches the identifier
        const foundUser = foundUsers.rows[0];
        if (foundUser.id != id) {
            return false;
        }

        // id matches
        return true;
        
    } catch (error) {
        console.log(error.message);
        return false
    }
}

/* verifies that the supplied JWT contains a valid identifier; no checks on the user info */
const verifyTokenIsValid = async (userToken) => {

    try {
        const identifier = await getIdentifierFromToken(userToken);

        const conn = await connect(config);
        const foundUsers = await conn.execute(`
            SELECT identifier, role_id FROM users WHERE identifier = '${identifier}'
        `);

        // if the identifier doesn't exist, return empty
        if (foundUsers.rows.length == 0) {
            return false;
        }

        // the token matches a real identifier, all good
        return true;

    } catch (error) {
        console.log(error.message);
        return false
    }
}

export {
    verifyIdMatchesToken,
    verifyTokenIsValid
}