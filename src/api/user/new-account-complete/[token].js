import { getUserFromToken } from "../../../lib/users/get_user_from_token";
import { tokenTypes } from "../../../lib/db_refs";

export default async function handler(req, res) {

    // user doesn't have an account, so can't use JWT

    if (req.method == 'GET') {
        // get the token and retrieve data
        const token = req.params.token;
        const data = await getUserFromToken(token, tokenTypes.ACCOUNT_REQUEST);

        // if data is null the token was invalid
        if (data === null) {
            res.status(400).json({ message: 'Token is not valid.' });
            return;
        }

        // if data is an empty array, array wasn't found (object will have length undefined, won't trip this)
        if (data.length == 0) {
            res.status(404).json({ message: 'Token not found.' })
            return;
        }

        // success, return the data (which will be a user)
        res.status(200).json(data);
        return;

    } else {
        // method is not GET, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}