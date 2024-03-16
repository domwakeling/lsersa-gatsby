import sql from '../../lib/db';
import { roles } from '../db_refs';
import { getIdentifierFromJWT } from '../jwt-methods';

const verifyUserHasAdminRole = async (userToken) => {

    try {
        const identifier = await getIdentifierFromJWT(userToken);

        const foundUsers = await sql`
            SELECT identifier, role_id FROM users WHERE identifier = ${identifier}
        `;

        // if the identifier doesn't exist, return empty
        if (foundUsers.length == 0) {
            return false;
        }

        // if the found user doesn't have ADMIN, false
        const foundUser = foundUsers[0];
        if (foundUser.role_id != roles.ADMIN) {
            return false;
        }

        // identifier is valid for an ADMIN user, all good
        return true;

    } catch (error) {
        console.log(error.message);
        return false
    }
}

export {
    verifyUserHasAdminRole
}