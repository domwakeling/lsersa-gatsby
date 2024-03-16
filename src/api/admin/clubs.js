import sql from '../../lib/db';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';

export default async function handler(req, res) {

    try {
        // ensure user has admin rights
        const userJWT = req.cookies.lsersaUserToken;
        const hasAdmin = await verifyUserHasAdminRole(userJWT);
        if (!hasAdmin && req.method !== 'GET') {
            // without admin use we can only GET info ...
            res.status(401).json({ message: 'ERROR: You do not have admin access' });
            return;
        }

        if (req.method === 'GET') {
            // get all clubs
            const clubs = await sql`SELECT * FROM clubs`;
            
            // return
            res.status(200).json({ message: 'success', clubs });
            return;

        } else if (req.method === 'POST') {
            // insert a new club
            const {name, contact_name, contact_email, affiliated} = req.body;
            const _ = await sql`
                INSERT INTO clubs (
                    name,
                    contact_name,
                    contact_email,
                    affiliated
                )
                VALUES (
                    ${name},
                    ${contact_name},
                    ${contact_email},
                    ${affiliated}
                )
            `;

            // return
            res.status(200).json({ message: 'Added new club'});
            return;
            
        } else if (req.method === 'PUT') {
            // update a club
            const { id, name, contact_name, contact_email, affiliated } = req.body;
            
            const _ = await sql`
                UPDATE clubs
                SET
                    name = ${name},
                    contact_name = ${contact_name},
                    contact_email = ${contact_email},
                    affiliated = ${affiliated}
                WHERE
                    id = ${ id }
            `;

            // return
            res.status(200).json({ message: 'Updated clubs' });
            return;
            
        } else if (req.method === 'DELETE') {
            // delete a club
            const { id } = req.body;
            
            // are there any racers aligned to that club?
            const racers = await sql`
                SELECT
                COUNT(club_id) AS "count(club_id)"
                FROM racers
                WHERE club_id = ${id}
            `;

            if(racers[0]['count(club_id)'] > 0) {
                res.status(400).json({ message: "ERROR: there are racers associated with that club" });
                return;
            };

            // no racers, so go ahead and delete
            const _ = await sql`DELETE FROM clubs WHERE id = ${id}`;
            
            // return
            res.status(200).json({ message: "Deleted club" });
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