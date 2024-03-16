import sql from '../../lib/db';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';
import { veryIdMatchesJWT } from '../../lib/users/verify_user_id';
import { sendShortEmail } from '../../lib/mail/send_short_email';
import { roles } from '../../lib/db_refs';
import { insertNewRacer } from '../../lib/users/addNewRacer';

const updateRacer = async (racer_id, racer) => {

    // set up the keys and values to insert
    const racerKeys = Object.keys(racer);

    const idx = racerKeys.indexOf('dob');
    if (idx >= 0) {
        const newDob = racerValues[idx].split("T")[0];
        racerValues[idx] = newDob;
    }

    // db
    const results = await sql`
        UPDATE racers
        SET ${
            sql(racer, racerKeys)
        }
        WHERE id = ${racer_id}
        RETURNING *
    `;

    return results;
}


export default async function handler(req, res) {

    // authorisation first - check the user_id is real and that either requester is 'self' or admin
    try {
        // get the id
        const {user_id} = req.body;

        // get JWT from request
        const userJWT = req.cookies.lsersaUserToken;
        if (!userJWT || userJWT === undefined || userJWT === null) {
            // error, most likely didn't find a cookie
            res.status(204).json({ message: "Cookie not found" });
            return;
        }

        // get admin status from userJWT
        const hasAdmin = await verifyUserHasAdminRole(userJWT);

        // check if user_id matches with stored JWT
        const isUser = await veryIdMatchesJWT(user_id, userJWT);

        if (!isUser && !hasAdmin) {
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
            const admin = await sql`SELECT email FROM users WHERE role_id = ${roles.ADMIN}`;
            _ = await sendShortEmail(
                admin.map(item => item.email),
                "New Racer Request",
                "New Racer Request",
                `A user has requested a new racer be approved, please log in to the admin
                        dashboard to review`
            );

            res.status(200).json({message: 'success'})
            return;

        } catch (error) {
            const m = error.message;
            if (/Duplicate entry/.test(m)) {
                res.status(409).json({ message: "A racer already exists with that name" });
                return;
            };
            console.log(m);
            res.status(500).json({ message: m });
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