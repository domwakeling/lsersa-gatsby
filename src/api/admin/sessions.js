import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const checkSessionHasNoRacers = async (conn, session_date) => {
    const data = await conn.execute(`
        SELECT date, COUNT(racer_id) as racer_count
        FROM sessions s
        LEFT JOIN bookings b
        ON s.date = b.session_date
        WHERE date = '${session_date}'
        GROUP BY date
    `);

    if (data.rows.length === 0 || data.rows[0].racer_count === '0') return true;
    return false;
}


export default async function handler(req, res) {

    if (req.method == 'GET') {
        // no protection on the GET route - needed by non-admin and doesn't reveal personal info

        try {
            const conn = await connect(config);
            const sessions = await conn.execute(`
                SELECT date, max_count, message, COUNT(racer_id)
                FROM sessions s
                LEFT JOIN bookings b
                ON s.date = b.session_date
                GROUP BY date;`
            );

            res.status(200).json({sessions: sessions.rows});
            return;

        } catch (error) {
            console.log(error.message);
            // generic error message
            res.status(500).json({ message: "SERVER ERROR: Bad request" });
            return;
        }

    }
    
    // authorisation for other methods - check the requester has admin
    try {
        // get JWT from request
        const userJWT = req.cookies.lsersaUserToken;
        if (!userJWT || userJWT === undefined || userJWT === null) {
            // error, most likely didn't find a cookie
            res.status(204).json({ message: "Cookie not found" });
            return;
        }

        // get admin status from JWT
        const hasAdmin = await verifyUserHasAdminRole(userJWT);

        if (!hasAdmin) {
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

    if (req.method === 'POST') {

        try {
            const { date, message, max_count } = req.body;
            if (!date || date === undefined || date === '') {
                res.status(400).json({message: 'No date provided'});
                return;
            }
            const dateString = date.split("T")[0];
            
            const conn = await connect(config);
            const _ = await conn.execute(`
                INSERT INTO sessions (date, message, max_count) VALUES (?,?,?)`,
                [dateString, message, max_count]
            );
            
            res.status(200).json({ message: "Successfully added session" });
            return;

        } catch (error) {
            const m = error.message;
            if (/Duplicate entry/.test(m)) {
                res.status(409).json({ message: "Session already created for that date" });
                return;
            };
            console.log(m);
            res.status(500).json({ message: m });
            return;
        }
    
    } else if (req.method === 'PUT') {

        try {
            const { old_date, date, message, max_count } = req.body;
            let dateString = date.split("T")[0];
            const oldDateString = old_date.split("T")[0];

            const conn = await connect(config);

            if (dateString !== oldDateString) {
                // trying to change date, check there's no racers signed up
                const noRacers = await checkSessionHasNoRacers(conn, oldDateString);
                if (!noRacers) {
                    res.status(400).json({message: 'There are racers booked on the session, unable to change date'});
                    return;
                }
            }
            
            const _ = await conn.execute(`
                UPDATE sessions
                SET
                    date = ?,
                    message = ?,
                    max_count = ?
                WHERE date = '${oldDateString}'`,
                [dateString, message, max_count]
            );

            res.status(200).json({ message: "Successfully updated session" });
            return;

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
            return;
        }

    } else if (req.method === 'DELETE') {

        try {    
            const { date } = req.body;
            const dateString = date.split("T")[0];

            // check days to session
            const sessionDate = new Date(date);
            const today = new Date();
            const daysBetween = differenceInCalendarDays(today, sessionDate);
            
            const conn = await connect(config);

            // if > 27 days old, can delete everything (test in the component is >28, extra day )
            if (daysBetween > 27) {
                const _ = await conn.transaction(async (tx) => {

                    const tryBookingsDelete = await tx.execute(
                        'DELETE FROM bookings WHERE session_date = ?',
                        [dateString]
                    );

                    const trySessionDelete = await tx.execute(
                        'DELETE FROM sessions WHERE date = ?',
                        [dateString]
                    );

                    return [
                        tryBookingsDelete,
                        trySessionDelete
                    ]
                });

                res.status(200).json({message: 'Successfully deleted session'});
                return;
            }

            // check there are no racers booked on that session
            const noRacers = await checkSessionHasNoRacers(conn, dateString);
            if (!noRacers) {
                res.status(400).json({ message: 'There are racers booked on the session, unable to delete it' });
                return;
            }

            const _ = await conn.execute(`DELETE FROM sessions WHERE date = '${dateString}'`);

            res.status(200).json({ message: "Successfully deleted session" });
            return;

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
            return;
        }

    } else {
        // method is not supported fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }

}