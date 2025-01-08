import sql from "../../lib/db";
import { tokenTypes } from "../../lib/db_refs";
import { getUserFromToken } from '../../lib/users/get_user_from_token';
import { getIdentifierFromJWT } from '../../lib/jwt-methods';


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
        if (!user || user.length == 0) {
            console.log("Booking token not recognised:", token)
            res.status(404).json({ message: `404 ERROR Token not found: ${token}`});
            return;
        }

        // check that we have a JWT ...
        const userJWT = req.cookies.lsersaUserToken;
        if (!userJWT || userJWT === undefined || userJWT === null) {
            // error, most likely didn't find a cookie
            res.status(404).json({ message: "404 ERROR JWT security token not found" });
            return;
        }

        // ... and that it matches the user for the payment token
        const storedIdentifier = await getIdentifierFromJWT(userJWT);
        if (user.identifier !== storedIdentifier) {
            console.log("JWT does not match booking token user")
            res.status(401).json({ message: "404 ERROR Trying to update details for a different user" });
            return;
        }

        // token is valid, correct user, so we can confirm the payments ...
        
        const _ = await sql.begin(async sql => {

            // set paid = true for relevant racers
            const tryUpdateBookings = await sql`
                UPDATE bookings
                SET paid = ${true}
                WHERE token = ${token}
                RETURNING *
            `;

            // delete the token
            const tryDeleteToken = await sql`DELETE FROM tokens WHERE token = ${token} RETURNING *`;

            return [
                tryUpdateBookings,
                tryDeleteToken
            ]

        });

        res.status(200).json({ message: 'Payment successful' });
        return;

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: `500 ERROR: ${error.message}` });
        return;
    }
};
