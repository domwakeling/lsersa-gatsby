import sql from '../../lib/db';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';

export default async function handler(req, res) {

    try {
        // check user has admin rights
        const userJWT = req.cookies.lsersaUserToken;
        const hasAdmin = await verifyUserHasAdminRole(userJWT);
        if (!hasAdmin) {
            res.status(401).json({ message: 'ERROR: You do not have admin access' });
            return;
        }

        if (req.method == 'GET') {
            // get all the data
            const results = await sql`
                SELECT
                    u.first_name as "00_user_first_name",
                    u.last_name as "01_user_last_name",
                    u.email as "02_user_email",
                    u.verified as "03_account_verified",
                    ro.name as "04_role",
                    u.address_1 as "05_address_1",
                    u.address_2 as "06_address_2",
                    u.city as "07_city",
                    u.postcode as "08_postcode",
                    u.mobile as "09_mobile",
                    u.emergency_name as "10_emergency_contact",
                    u.emergency_mobile as "11_emergency_mobile",
                    u.emergency_email as "12_emergency_email",
                    u.secondary_name as "13_secondary_contact",
                    u.secondary_mobile as "14_secondary_mobile",
                    u.secondary_email as "15_secondary_email",
                    r.first_name as "16_racer_first_name",
                    r.last_name as "17_racer_last_name",
                    r.dob as "18_racer_dob",
                    g.name as "19_racer_gender",
                    c.name as "20_racer_club",
                    r.verified as "21_racer_verified",
                    r.club_expiry as "22_club_expiry_date",
                    r.concession as "23_racer_concession"
                FROM users u
                LEFT JOIN users_racers ur
                ON u.id = ur.user_id
                LEFT JOIN racers r
                ON ur.racer_id = r.id
                LEFT JOIN genders g
                ON r.gender_id = g.id
                LEFT JOIN clubs c
                ON r.club_id = c.id
                LEFT JOIN roles ro
                ON u.role_id = ro.id
            `;

            res.status(200).json(results);
            return;
            
        } else {
            // method is not accepted, fail gracefully
            res.status(405).json({ message: "ERROR: method not allowed" });
            return;
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
        return;
    }
}