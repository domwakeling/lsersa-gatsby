import { getUserFromToken } from "../../../lib/users/get_user_from_token";

export default async function handler(req, res) {

    if (req.method == 'GET') {
        // get the token and retrieve data
        const token = req.params.token;
        const data = await getUserFromToken(token);

        // if data is null the token was invalid
        if (data === null) {
            res.status(400).json({ message: 'Token is not valid.' });
            return;
        }

        // if daeta is an empty array, array wasn't found
        if (data == []) {
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