import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { getIdFromToken } from '../../lib/jwt-methods';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';
import { sendShortEmail } from '../../lib/mail/send_short_email';
import { roles } from '../../lib/db_refs';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const insertNewRacer = async (user_id, new_racer) => {

    // set up the keys and values to insert
    const racerKeys = Object.keys(new_racer);
    const racerValues = racerKeys.map(key => new_racer[key]);
    racerKeys.push('verified');
    racerValues.push(false);

    // deal with dob issue
    const idx = racerKeys.indexOf('dob');
    if (idx >= 0) {
        let dob_date = new Date(racerValues[idx]);
        dob_date.setTime(dob_date.getTime() + (2 * 60 * 60 * 1000)); // errors with summertime ... ?
        racerValues[idx] = dob_date;
    }

    // get the strings for INSERT
    const insertStringCols = racerKeys.join(",");
    const insertStringValues = racerKeys.map(key => '?').join(",");

    // db
    const conn = await connect(config);
    const results = await conn.transaction(async (tx) => {

        const tryInsertRacer = await tx.execute(`
                INSERT INTO racers (${insertStringCols}) VALUES (${insertStringValues})
            `,
            racerValues
        );
        
        const newRacerId = tryInsertRacer.insertId;
        const tryInsertUserRacer = await tx.execute(`
                INSERT INTO users_racers (user_id, racer_id) VALUES (${user_id}, ${newRacerId})
            `,
            racerValues
        );

        return [
            tryInsertRacer,
            tryInsertUserRacer,
            newRacerId
        ]
    });

    return results;
}

const updateRacer = async (racer_id, racer) => {

    // set up the keys and values to insert
    const racerKeys = Object.keys(racer);
    const racerValues = racerKeys.map(key => racer[key]);

    // deal with dob issue
    const idx = racerKeys.indexOf('dob');
    if (idx >= 0) {
        let dob_date = new Date(racerValues[idx]);
        dob_date.setTime(dob_date.getTime() + (2 * 60 * 60 * 1000)); // errors with summertime ... ?
        console.log(dob_date);
        racerValues[idx] = dob_date;
    }

    // get the strings for INSERT
    const insertStringCols = racerKeys.map(key => `${key} = ?`).join(",");

    // db
    const conn = await connect(config);
    const results = await conn.transaction(async (tx) => {
        const tryUpdateRacer = await tx.execute(`
                UPDATE racers
                SET ${insertStringCols}
                WHERE id = ${racer_id}
            `,
            racerValues
        );

        return [
            tryUpdateRacer
        ]
    });

    return results;
}


export default async function handler(req, res) {

    // authorisation first - check the user_id is real and that either requester is 'self' or admin
    try {
        // get the id
        const {user_id} = req.body;

        // get token from request
        const token = req.cookies.lsersaUserToken;
        if (!token || token === undefined || token === null) {
            // error, most likely didn't find a cookie
            res.status(204).json({ message: "Cookie not found" });
            return;
        }

        // get admin status from token
        const hasAdmin = await verifyUserHasAdminRole(token);

        // get identifier from token; get user_id from db; check they align OR token has admin
        const identifier = getIdFromToken(token);
        const conn = await connect(config);
        const users = await conn.execute(`SELECT * FROM users where id = '${user_id}'`);

        const user = users.rows[0];
        if (!user) {
            res.status(400).json({ message: 'ERROR: No such user' });
            return;
        }

        if (user.identifier !== identifier && !hasAdmin) {
            // not self and not an admin
            res.status(401).json({ message: 'ERROR: You do not have access' });
            return;
        }

    } catch (error) {
        // something has gone wrong whilst trying to check the request is authorised
        console.log(error.message);
        res.status(500).json({ message: error.message });
        return;
    }

    // if we're here, the user account exists and request has appropriate authorisation
    if (req.method === 'POST') {
    
        try {
            const { user_id, new_racer } = req.body;
            let _ = await insertNewRacer(user_id, new_racer);

            // send email to admins
            const conn = await connect(config);
            const admin = await conn.execute(`SELECT email FROM users WHERE role_id = ${roles.ADMIN}`);
            _ = await sendShortEmail(
                admin.rows.map(item => item.email),
                "[TEST, IGNORE] New Racer Request",
                "New Racer Request",
                `A user has requested a new racer be approved, please log in to the admin
                        dashboard to review`
            );

            res.status(200).json({message: 'success'})
            return;

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
            return;
        }

    } else if (req.method === 'PUT') {

        try {
            const { racer_id, racer } = req.body;
            let _ = await updateRacer(racer_id, racer);

            res.status(200).json({ message: 'success' })
            return;

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
            return;
        }

    } else {
        // method is not accepted, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }

}