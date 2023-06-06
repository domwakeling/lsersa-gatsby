import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { getIdentifierFromJWT } from '../../lib/jwt-methods';
import brcypt from 'bcryptjs';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

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

            // construct a partial for the query string, and a params
            const columns = [];
            const params = [];

            keys.forEach(key => {
                const newColumn = `${key} = ?`;
                columns.push(newColumn);
                params.push(updates[key]);
            });

            const query = columns.join(", ");

            // try to update the user
            const conn = await connect(config);
            const tryUpdateUser = await conn.execute(`
                    UPDATE users
                    SET ${query}
                    WHERE id=${id}`,
                params
            );
            
            // if for some reason this hasn't worked, error out ...
            if (!tryUpdateUser || tryUpdateUser.rowsAffected !== 1) {
                res.status(500).json({message: 'ERROR: Changes not saved'});
                return;
            }

            // retrieve the updated user
            const updatedUsers = await conn.execute(`SELECT * FROM users WHERE id = ${id}`);
            const newUser = updatedUsers.rows[0];
            
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