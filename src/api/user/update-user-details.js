import sql from '../../lib/db';
import { getIdentifierFromJWT } from '../../lib/jwt-methods';
import brcypt from 'bcryptjs';

export default async function handler(req, res) {

    if (req.method === 'POST') {

        try {
            const { id, identifier, updates } = req.body;

            // check that there is a valid user via JWT and it's for the user being updated
            const userJWT = req.cookies.lsersaUserToken;
            const storedIdentifier = getIdentifierFromJWT(userJWT);

            if (identifier !== storedIdentifier) {
                res.status(401).json({message: "ERROR: Trying to update details for a different user"});
                return;
            }

            // hash password, or remove from updates if blank
            if (updates.password && updates.password !== '') {
                const hashedPassword = brcypt.hashSync(updates.password, 10);
                updates.password_hash = hashedPassword;
            }

            // get keys; if empty => no updates, gracefully fail
            const keys = Object.keys(updates).filter(key => key !== 'password');
            if (keys.length === 0) {
                console.log("no keys")
                res.status(409).json({message: 'Update found no changes'});
                return;
            }

            // try to update the user
            const tryUpdateUser = await sql`
                UPDATE users
                SET ${
                    sql(updates, keys)
                }
                WHERE id=${id}
                RETURNING *
            `;
            
            // if for some reason this hasn't worked, error out ...
            if (!tryUpdateUser || tryUpdateUser.length !== 1) {
                res.status(500).json({message: 'ERROR: Changes not saved'});
                return;
            }

            // retrieve the updated user
            const updatedUsers = await sql`SELECT * FROM users WHERE id = ${id}`;
            const newUser = updatedUsers[0];
            
            res.status(200).json({message: "all great", newUser});
            return;

        } catch (error) {
            // log the error and send back the error message
            console.log(error.message);
            res.status(500).json({ message: error.message });
            return;
        }

    } else {
        // method is not POST, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}