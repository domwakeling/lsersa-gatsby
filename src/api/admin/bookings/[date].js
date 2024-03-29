import sql from '../../../lib/db';
import { verifyUserHasAdminRole } from '../../../lib/admin/verify_admin';


export default async function handler(req, res) {

    if (req.method == 'GET') {

        try {

            // check there's a JWT stored
            const userJWT = req.cookies.lsersaUserToken;
            if (!userJWT || userJWT === undefined || userJWT === null) {
                // error, most likely didn't find a cookie
                res.status(204).json({ message: "Cookie not found" });
                return;
            }

            // check that the JWT is for admin
            const hasAdmin = verifyUserHasAdminRole(userJWT);
            if (!hasAdmin) {
                res.status(409).json({ message: "You are not authorised" });
                return;
            }

            // get booking information
            const { date } = req.params;
            const bookings = await sql`
                SELECT
                    r.first_name as "00_first_name",
                    r.last_name as "01_last_name",
                    paid as "02_paid",
                    token as "03_payment_ref",
                    emergency_name as "04_emergency_contact",
                    emergency_mobile as "05_emergency_mobile",
                    c.name as "06_club",
                    g.name as "07_gender",
                    email as "08_email",
                    secondary_email as "09_secondary",
                    dob as "10_date_of_birth"
                FROM bookings b
                LEFT JOIN racers r ON b.racer_id = r.id
                LEFT JOIN clubs c ON r.club_id = c.id
                LEFT JOIN genders g ON r.gender_id = g.id
                LEFT JOIN users_racers ur ON r.id = ur.racer_id
                LEFT JOIN users u ON ur.user_id = u.id
                WHERE session_date = ${date}
            `;

            // return data
            res.status(200).json(bookings);
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