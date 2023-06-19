import { fetch } from 'undici';
import { connect } from '@planetscale/database';
import { emailNewAccountTokenToUser } from '../../lib/mail/send_signup_token';
import { tokenGenerator} from '../../lib/token';
import { tokenTypes } from '../../lib/db_refs';
import { verifyUserHasAdminRole } from '../../lib/admin/verify_admin';
import addDays from 'date-fns/addDays';
import { safeDateConversion } from '../../lib/date-handler';

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

const verifyUser = async (id, email, admin_text) => {
    const conn = await connect(config);
    const cleanEmail = email.toLowerCase();
    
    const params = [
        admin_text,
        true
    ];
    const results = await conn.transaction(async (tx) => {
        // update the user
        const tryUpdateUser = await tx.execute(`
                    UPDATE users
                    SET
                        admin_text = ?,
                        verified = ?
                    WHERE email="${cleanEmail}"`,
            params
        );

        // create a new token and an expiry date, insert them
        const newToken = tokenGenerator(12);
        let newDate = new Date();
        // add 7 days
        newDate = safeDateConversion(addDays(newDate, 7));

        const tryNewToken = await tx.execute(
            'INSERT INTO tokens (user_id, token, expiresAt, type_id) VALUES (?,?,?,?)',
            [id, newToken, newDate, tokenTypes.ACCOUNT_REQUEST]
        );

        return {
            tryUpdateUser,
            tryNewToken,
            newToken
        }
    });

    return results;
}

const verifyRacer = async (id, club_expiry, club_id, concession, admin_text) => {
    const conn = await connect(config);
    let dateString = null;
    if (club_expiry && club_expiry !== undefined && club_expiry !== '') {
        dateString = club_expiry.split("T")[0];
    }

    const params = [
        dateString,
        club_id,
        concession,
        admin_text,
        true
    ];
    const results = await conn.transaction(async (tx) => {
        // update the user
        const tryUpdateRacer = await tx.execute(`
                    UPDATE racers
                    SET
                        club_expiry = ?,
                        club_id = ?,
                        concession = ?,
                        admin_text = ?,
                        verified = ?
                    WHERE id = ${id}`,
            params
        );

        return {
            tryUpdateRacer,
        }
    });

    return results;
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
            const conn = await connect(config);
            const users = await conn.execute(`
                SELECT id, email, admin_text
                FROM users
                WHERE verified = FALSE`
            );
            const racers = await conn.execute(`
                SELECT id, first_name, last_name, gender_id, club_id, user_text, dob
                FROM racers
                WHERE verified = FALSE`
            );
            
            // return
            res.status(200).json({
                users: users.rows,
                racers: racers.rows
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
                const conn = await connect(config);
                const _ = await conn.execute(`DELETE FROM users WHERE id = ${id}`);

                res.status(200).json({message: "Successfully deleted user"});
                return;

            } else {
                // type is going to be racer
                const { id } = req.body;
                const conn = await connect(config);
                const results = await conn.transaction(async (tx) => {
                    const tryDeleteRacer = await tx.execute(`DELETE FROM racers WHERE id = ${id}`);
                    const tryDeleteJoin = await tx.execute(`DELETE FROM users_racers WHERE racer_id = ${id}`);
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