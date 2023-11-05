import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { veryIdMatchesJWT } from '../../lib/users/verify_user_id';
import parseISO from 'date-fns/parseISO';
import addDays from 'date-fns/addDays';
import { safeDateConversion } from '../../lib/date-handler';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    try {
        // ensure that the user is changing their own entries
        const userJWT = req.cookies.lsersaUserToken;
        const { user_id } = req.body;
        const validToken = await veryIdMatchesJWT(user_id, userJWT);
        if (!validToken) {
            res.status(401).json({ message: 'ERROR: You do not have access' });
            return;
        }

        if (req.method === 'POST') {
            // get details and build dates
            const { racer_id, date, max_count, restricted } = req.body;
            
            const session_date = date.split("T")[0];

            // midnight (UTC/GMT) two days before => Weds night/Thurs morning for a Saturday;
            const cutoff = addDays(parseISO(session_date + "Z"), -2);
            const now = new Date();

            if (now  > cutoff) {
                res.status(406).json({ message: 'Booking system is closed' })
                return
            }

            let expiryDate = new Date(session_date);
            // add 30 days
            expiryDate = safeDateConversion(addDays(expiryDate, 30));

            // get the existing bookings for that session ...
            const conn = await connect(config);
            const bookings = await conn.execute(`
                SELECT *
                FROM bookings
                WHERE session_date = ?`,
                [session_date]);
            
            // check that there are spaces
            if (bookings.rows.length >= max_count) {
                res.status(204).json({message: 'No spaces available'});
                return;
            }

            // check that the racer doesn't already have a space
            if (bookings.rows.filter(item => item.racer_id === racer_id).length > 0) {
                res.status(204).json({ message: 'Racer is already booked' });
                return;
            }

            // if the session is restricted ...
            if (restricted) {
                
                // are we still in the restricted period?
                const endRestrict = addDays(parseISO(session_date + "Z"), -4);
                if (now < endRestrict) {

                    // restricted session; inside the period; not booked; spaces available
                    let lsersa_club = false;

                    // does the racer have a club?
                    const racers = await conn.execute(
                        'SELECT * FROM racers WHERE id = ?',
                        [racer_id]
                    );
                    
                    // if racer has a club, is it lsersa?
                    if (racers.rows.length > 0 && racers.rows[0].club_id && racers.rows[0].club_id > 0) {

                        const clubs = await conn.execute(
                            'SELECT * FROM clubs WHERE id = ?',
                            [racers.rows[0].club_id]
                        );

                        if (clubs.rows.length > 0 && clubs.rows[0].affiliated) {
                            lsersa_club = true;
                        }

                    }
                    
                    if (!lsersa_club) {
                        // restricted, inside period, not booked, spaces available but not lsersa
                        res.status(400).json({ message: 'Racer is not registered to a LSERSA club, please wait until Tuesday' });
                        return;
                    }
                }

                // we're not inside th restricted period, or it's a lsersa club - so keep going
            }

            // insert
            const _ = await conn.execute(
                'INSERT INTO bookings (session_date, racer_id, paid, expiresAt) VALUES (?,?,?,?)',
                [session_date, racer_id, false, expiryDate]
            );

            // return
            res.status(200).json({ message: 'Added new booking' });
            return;

        } else if (req.method === 'DELETE') {
            // get details and build dates
            const { racer_id, date } = req.body;
            const session_date = date.split("T")[0];

            // get the existing bookings for that session ...
            const conn = await connect(config);
            const bookings = await conn.execute(`
                SELECT *
                FROM bookings
                WHERE session_date = ?`,
                [session_date]);

            // check that the racer is booked
            const userBookings = bookings.rows.filter(item => item.racer_id === racer_id);
            if (userBookings.length === 0) {
                res.status(204).json({ message: 'Racer is not booked' });
                return;
            }

            // check that the booking is not paid
            if (userBookings[0].paid) {
                res.status(204).json({ message: 'Booking is paid, cannot cancel' });
                return;
            }

            // delete
            const _ = await conn.execute(
                'DELETE FROM bookings WHERE racer_id = ? AND session_date = ?',
                [racer_id, session_date]
            );

            // return
            res.status(200).json({ message: 'Added new booking' });
            return;

        } else {
            // method is not acceptable, fail gracefully
            res.status(405).json({ message: "ERROR: method not allowed" });
            return;
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
        return;
    }
}