import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { roles } from '../db_refs';
import { getIdFromToken } from '../jwt-methods';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const verifyUserHasAdminRole = async (userToken) => {

    try {
        const identifier = await getIdFromToken(userToken);

        const conn = await connect(config);
        const foundUsers = await conn.execute(`
            SELECT identifier, role_id FROM users WHERE identifier = '${identifier}'
        `);

        // if the token doesn't exist, return empty
        if (foundUsers.rows.length == 0) {
            return [];
        }

        // if it's not an account-request token, return empty
        const foundUser = foundUsers.rows[0];
        if (foundUser.role_id != roles.ADMIN) {
            return null;
        }

        // id matches and role is ADMIN, good
        return true;
    } catch (error) {
        console.log(error.message);
        return false
    }
}

export {
    verifyUserHasAdminRole
}