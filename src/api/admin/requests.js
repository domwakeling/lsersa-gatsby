import sql from '../../lib/db';
import { emailNewAccountTokenToUser } from '../../lib/mail/send_signup_token';
import { tokenGenerator} from '../../lib/token';
import { tokenTypes } from '../../lib/db_refs';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';
import addDays from 'date-fns/addDays';
import { safeDateConversion } from '../../lib/date-handler';


const verifyUser = async (id, email, admin_text) => {

    const cleanEmail = email.toLowerCase();

    const results = await sql.begin(async sql => {
        
        // update the user
        const tryUpdateUser = await sql`
            UPDATE users
            SET
                admin_text = ${admin_text},
                verified = ${true}
            WHERE email=${cleanEmail}
            RETURNING *
        `;

        // create a new token and an expiry date, insert them
        const newToken = tokenGenerator(12);
        let newDate = new Date();
        // add 7 days
        newDate = safeDateConversion(addDays(newDate, 7));

        const tryNewToken = await sql`
            INSERT INTO tokens (
                user_id,
                token,
                expires_at,
                type_id
            )
            VALUES (
                ${id},
                ${newToken},
                ${newDate},
                ${tokenTypes.ACCOUNT_REQUEST}
            )
            RETURNING *
        `;

        return {
            tryUpdateUser: tryUpdateUser[0],
            tryNewToken: tryNewToken[0],
            newToken
        }

    });
    
    return results;
}

const verifyRacer = async (id, club_expiry, club_id, concession, admin_text) => {
    
    let dateString = null;
    if (club_expiry && club_expiry !== undefined && club_expiry !== '') {
        dateString = club_expiry.split("T")[0];
    }

    const tryUpdateRacer = await sql`
        UPDATE racers
        SET
            club_expiry = ${dateString},
            club_id = ${club_id},
            concession = ${concession},
            admin_text = ${admin_text},
            verified = ${true}
        WHERE id = ${id}
        RETURNING *
    `;

    return {
        tryUpdateRacer: tryUpdateRacer[0],
    }

}

export default async function handler(req, res) {

    // the GET route provides personal details so protect everything

    try {
        // check user has admin rights
        const userJWT = req.cookies.lsersaUserToken;
        const hasAdmin = await verifyUserHasAdminRole(userJWT);
        if (!hasAdmin) {
            res.status(401).json({ message: 'ERROR: You do not have admin access' });
            return;
        }

        if (req.method == 'GET') {
            // get info
            const users = await sql`
                SELECT id, email, admin_text
                FROM users
                WHERE verified = FALSE
            `;
            
            const racers = await sql`
                SELECT id, first_name, last_name, gender_id, club_id, user_text, dob
                FROM racers
                WHERE verified = FALSE
            `;
            
            // return
            res.status(200).json({
                users: users,
                racers: racers
            });
            return;
        
        } else if (req.method === 'POST') {

            const { type } = req.body;

            if (type === 'user') {
                const { id, email, admin_text } = req.body;
                const results = await verifyUser(id, email, admin_text);
                
                // trigger an email to the new user
                const _ = await emailNewAccountTokenToUser(results.newToken, email);

                // done
                res.status(200).json({ message: "Successfully updated user"});
                return;

            } else {
                // type will be racer ...
                const { id, club_expiry, club_id, concession, admin_text } = req.body;
                const _ = await verifyRacer(id, club_expiry, club_id, concession, admin_text);

                res.status(200).json({ message: "Successfully updated racer" });
                return;
            }
    
        } else if (req.method === 'DELETE') {
        
            const { type } = req.body;
            
            if (type === 'user') {
                const { id } = req.body;
                const _ = await sql`DELETE FROM users WHERE id = ${id}`;

                res.status(200).json({message: "Successfully deleted user"});
                return;

            } else {
                // type is going to be racer
                const { id } = req.body;
                
                const _ = await sql.begin(async sql => {
                    const tryDeleteJoin = await sql`DELETE FROM users_racers WHERE racer_id = ${id}`;
                    const tryDeleteRacer = await sql`DELETE FROM racers WHERE id = ${id}`;
                    return [
                        tryDeleteRacer,
                        tryDeleteJoin
                    ]

                });

                res.status(200).json({ message: "Successfully deleted user" });
                return;
            }
            
        } else {
            // method is not GET, POST or DELETE, fail gracefully
            res.status(405).json({ message: "ERROR: method not allowed" });
            return;
        }
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
        return;
    }
}