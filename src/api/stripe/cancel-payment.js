import { connect } from '@planetscale/database';
import { fetch } from 'undici';
import { tokenTypes } from "../../lib/db_refs";
import { getUserFromToken } from '../../lib/users/get_user_from_token';
import { getIdentifierFromJWT } from '../../lib/jwt-methods';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        // method is not accepted, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }

    try {
        // check that the token exists, is correct type, and get the user
        const { token } = req.body;
        const user = await getUserFromToken(token, tokenTypes.PAYMENT_PENDING);
        if (!user || user == []) {
            res.status(404).json({ message: 'Token not found' });
            return;
        }

        // check that we have a JWT ...
        const userJWT = req.cookies.lsersaUserToken;
        if (!userJWT || userJWT === undefined || userJWT === null) {
            // error, most likely didn't find a cookie
            res.status(204).json({ message: "Cookie not found" });
            return;
        }

        // ... and that it matches the user for the payment token
        const storedIdentifier = await getIdentifierFromJWT(userJWT);
        if (user.identifier !== storedIdentifier) {
            res.status(401).json({ message: "ERROR: Trying to update details for a different user" });
            return;
        }

        // token is valid, correct user, so we can remove the reference and delete token
        const conn = await connect(config);
        const results = await conn.transaction(async (tx) => {

            // add token to the racers
            const tryUpdateBookings = await tx.execute(`
                UPDATE bookings
                SET token = NULL
                WHERE token = ?`,
                [token]
            );

            // delete the token
            const tryDeleteToken = await tx.execute(`DELETE FROM tokens WHERE token = '${token}'`);

            return [
                tryUpdateBookings,
                tryDeleteToken
            ]
        });

        res.status(200).json({ message: 'Payment cancelled' });
        return;

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
        return;
    }
};
