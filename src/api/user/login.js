import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import brcypt from 'bcryptjs';
import { createToken, MAX_AGE } from '../../lib/jwtmethods';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const getPasswordHashForEmail = async (email) => {

    try {
        const conn = await connect(config);
        const result = await conn.execute(`SELECT * FROM users WHERE email = '${email}'`);

        if (result && result.rows && result.rows.length > 0) {
            return result.rows[0];
        }

        return null;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export default async function handler(req, res) {

    if (req.method == 'POST') {

        try {
            // get data from the body and instigate ...
            const { email, password } = req.body;

            // look for a stored hash
            const user = await getPasswordHashForEmail(email);

            if (user == undefined || user == null) {
                res.status(404).json({ message: 'Email not found.' });
                return;
            }

            const verified = brcypt.compareSync(password, user.password_hash);

            if (verified) {
                const jwt = createToken(user.identifier);
                res.setHeader("Set-Cookie", `lsersaUserToken=${jwt}; Max-Age=${MAX_AGE}; Path=/`);
                res.status(200).json(user);
                return;
            }

            res.status(401).json({message: 'Password did not match'});
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
