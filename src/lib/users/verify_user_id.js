import sql from '../db';
import { getIdentifierFromJWT } from '../jwt-methods';

const veryIdMatchesJWT = async (id, userJWT) => {

    try {
        const identifier = await getIdentifierFromJWT(userJWT);

        const foundUsers = await sql`
            SELECT id, identifier FROM users WHERE identifier = ${identifier}
        `;

        // if the identifier doesn't exist, return empty
        if (foundUsers.length == 0) {
            return false;
        }

        // check if the id matches the identifier
        const foundUser = foundUsers[0];
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
const verifyJWTIsValid = async (userJWT) => {

    try {
        const identifier = await getIdentifierFromJWT(userJWT);

        const foundUsers = await sql`
            SELECT identifier, role_id FROM users WHERE identifier = ${identifier}
        `;

        // if the identifier doesn't exist, return empty
        if (foundUsers.length == 0) {
            return false;
        }

        // the JWT matches a real identifier, all good
        return true;

    } catch (error) {
        console.log(error.message);
        return false
    }
}

export {
    veryIdMatchesJWT,
    verifyJWTIsValid
}