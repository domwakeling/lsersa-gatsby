import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

export default async function handler(req, res) {

    try {
        // ensure user has admin rights
        const token = req.cookies.lsersaUserToken;
        const hasAdmin = await verifyUserHasAdminRole(token);
        if (!hasAdmin && req.method !== 'GET') {
            // without admin use we can only GET info ...
            res.status(401).json({ message: 'ERROR: You do not have admin access' });
            return;
        }

        if (req.method === 'GET') {
            // get all clubs
            const conn = await connect(config);
            const clubs = await conn.execute('SELECT * FROM clubs');
            
            res.status(200).json({ message: 'success', clubs: clubs.rows });
            return;

        } else if (req.method === 'POST') {
            // insert a new club
            const {name, contact_name, contact_email, affiliated} = req.body;
            const conn = await connect(config);
            const _ = await conn.execute(
                'INSERT INTO clubs (name, contact_name, contact_email, affiliated) VALUES (?,?,?,?)',
                [name, contact_name, contact_email, affiliated]
            )
            // return
            res.status(200).json({ message: 'Added new club'});
            return;
            
        } else if (req.method === 'PUT') {
            // update a club
            const { id, name, contact_name, contact_email, affiliated } = req.body;
            const conn = await connect(config);
            const _ = await conn.execute(`
                    UPDATE clubs
                    SET
                        name = ?,
                        contact_name = ?,
                        contact_email = ?,
                        affiliated = ?
                    WHERE id = ${ id }`,
                [name, contact_name, contact_email, affiliated]
            )
            // return
            res.status(200).json({ message: 'Updated clubs' });
            return;
            
        } else if (req.method === 'DELETE') {
            // delete a club
            const { id } = req.body;
            const conn = await connect(config);
            
            // are there any racers aligned to that club?
            const racers = await conn.execute(`SELECT COUNT(club_id) FROM racers WHERE club_id = ${id};`);
            if(racers.rows[0]['count(club_id)'] > 0) {
                res.status(400).json({ message: "ERROR: there are racers associated with that club" });
                return;
            };
            const _ = await conn.execute(`DELETE FROM clubs WHERE id = ${id}`);
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