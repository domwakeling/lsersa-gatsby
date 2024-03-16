import sql from "../db";
import { tokenTypes } from "../db_refs";
import { tokenGenerator} from "../token";
import addDays from 'date-fns/addDays';
import { safeDateConversion } from "../date-handler";

const insertUser = async (passedSql, email, role_id, verified=false) => {

    // prepare new identifier and mail
    const newIdentifier = tokenGenerator(20);
    const cleanEmail = email.toLowerCase();

    const results = await sql.begin(async sql => {

        // insert a new user
        const tryNewUser = await sql`
            INSERT INTO users (
                email,
                role_id,
                verified,
                identifier
            )
            VALUES (
                ${cleanEmail},
                ${role_id},
                ${verified},
                ${newIdentifier}
            )
            RETURNING *
        `;

        if (verified) {
            // insert a new ACCOUNT_REQUEST token for that user in the tokens table IF verified
            const newUserId = tryNewUser[0].id;
            const newToken = tokenGenerator(12);
            let newDate = new Date();
            // add 7 days
            newDate = safeDateConversion(addDays(newDate, 7));
            // insert the token
            const tryNewToken = await sql`
                INSERT INTO tokens (
                    user_id,
                    token,
                    expires_at,
                    type_id
                )
                VALUES (
                    ${newUserId},
                    ${newToken},
                    ${newDate},
                    ${tokenTypes.ACCOUNT_REQUEST}
                )
                RETURNING *
            `;
            // close the transaction and return the info
            
            return {
                tryNewUser: tryNewUser[0],
                tryNewToken: tryNewToken[0],
                newToken
            }
            
        } else {
            // not a pre-verified account

            return {
                tryNewUser: tryNewUser[0]
            }

        }

    });

    return results;
}

export default insertUser;

