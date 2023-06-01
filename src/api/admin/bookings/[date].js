import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { verifyUserHasAdminRole } from '../../../lib/admin/verify_admin';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}


export default async function handler(req, res) {

    if (req.method == 'GET') {

        try {

            // check there's a token stored
            const token = req.cookies.lsersaUserToken;
            if (!token || token === undefined || token === null) {
                // error, most likely didn't find a cookie
                res.status(204).json({ message: "Cookie not found" });
                return;
            }

            // check that the token is for admin
            const hasAdmin = verifyUserHasAdminRole(token);
            if (!hasAdmin) {
                res.status(409).json({ message: "You are not authorised" });
                return;
            }

            // get booking information
            const { date } = req.params;
            const conn = await connect(config);
            const bookings = await conn.execute(`
                SELECT
                    r.first_name as '0_first_name',
                    r.last_name as '1_last_name',
                    paid as '2_paid',
                    token as '3_payment_ref',
                    emergency_name as '4_emergency_contact',
                    emergency_mobile as '5_emergency_mobile',
                    c.name as '6_club',
                    g.name as '7_gender'
                FROM bookings b
                LEFT JOIN racers r ON b.racer_id = r.id
                LEFT JOIN clubs c ON r.club_id = c.id
                LEFT JOIN genders g ON r.gender_id = g.id
                LEFT JOIN users_racers ur ON r.id = ur.racer_id
                LEFT JOIN users u ON ur.user_id = u.id
                WHERE session_date = '${date}'`);

            // return data
            res.status(200).json(bookings.rows);
            return;

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
            return;
        }

    } else {
        // method is not GET, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}