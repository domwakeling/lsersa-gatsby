import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import brcypt from 'bcryptjs';
import { getUserFromToken } from '../../lib/users/get_user_from_token';
import { createToken, MAX_AGE } from '../../lib/jwt-methods';
import { tokenTypes } from '../../lib/db_refs';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const verifyNewUserAccount = async (token, userData) => {
    // re-check that the token is valid and relates to this user
    const checkUser = await getUserFromToken (token, tokenTypes.ACCOUNT_REQUEST);
    
    // if it's null or an empty array, something was wrong with the token
    if (checkUser == null || checkUser == []) {
        return null;
    }

    // if there isn't a returned id, or it doesn't match the userData, return false
    if (!checkUser || !checkUser.id || (checkUser.id !== userData.id) ) {
        return false;
    }

    // user matches so prepare to update; last element of params is the verified status
    const hashedPassword = brcypt.hashSync(userData.password, 10);
    const cleanEmail = userData.email.toLowerCase();
    const params = [
        cleanEmail,
        hashedPassword,
        userData.first_name,
        userData.last_name,
        userData.address_1,
        userData.address_2,
        userData.mobile,
        userData.city,
        userData.postcode,
        userData.emergency_name,
        userData.emergency_email,
        userData.emergency_mobile,
        userData.secondary_name,
        userData.secondary_email,
        userData.secondary_mobile,
        true
    ];

    const conn = await connect(config);
    const results = await conn.transaction(async (tx) => {
        // update the record
        
        const tryNewUser = await tx.execute(`
            UPDATE users
            SET
                email = ?,
                password_hash = ?,
                first_name = ?,
                last_name = ?,
                address_1 = ?,
                address_2 = ?,
                mobile = ?,
                city = ?,
                postcode = ?,
                emergency_name = ?,
                emergency_email = ?,
                emergency_mobile = ?,
                secondary_name = ?,
                secondary_email = ?,
                secondary_mobile = ?,
                verified = ?
            WHERE id=${userData.id}`,
            params
        );
        
        // delete the access token
        const tryDeleteToken = await tx.execute(`DELETE FROM tokens WHERE token = '${token}'`);
        
        return {
            tryNewUser,
            tryDeleteToken
        }
    });


    return {
        results,
        identifier: checkUser.identifier
    };
}

export default async function handler(req, res) {

    if (req.method == 'POST') {
        // get data from the body and instigate ...
        const { user, token } = req.body;

        try {
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

            // get a JWT, set it in the header, return success
            const jwt = createToken(result.identifier);
            res.setHeader("Set-Cookie", `lsersaUserToken=${jwt}; Max-Age=${MAX_AGE}; Path=/`);
            res.status(200).json({ message: "successfully verified account" });
            return;
        
        } catch (error) {
            console.log(error.message);
            // generic error message
            res.status(500).json({ message: "Server error: bad request" });
            return;
        }

    } else {
        // method is not POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}
