import Stripe from "stripe";
import sql from "../../lib/db";
import { tokenGenerator} from '../../lib/token';
import { veryIdMatchesJWT } from '../../lib/users/verify_user_id';
import { tokenTypes } from "../../lib/db_refs";
import addDays from 'date-fns/addDays';
import { safeDateConversion } from "../../lib/date-handler";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        // method is not accepted, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }

    try {
        const { id, date } = req.body; 

        // check that the user is self
        const userJWT = req.cookies.lsersaUserToken;
        if (!userJWT || userJWT === undefined || userJWT === null) {
            // error, most likely didn't find a cookie
            res.status(204).json({ message: "Cookie not found" });
            return;
        }

        // check if user_id matches with stored JWT
        const isUser = await veryIdMatchesJWT(id, userJWT);

        if (!isUser) {
            // not self and not an admin
            res.status(401).json({ message: 'ERROR: You do not have access' });
            return;
        }

        // get racers that are booked and awaiting payment
        const session_date = date.split("T")[0];

        const racers = await sql`
            SELECT b.racer_id, paid, user_id, id, concession
            FROM bookings b
            LEFT JOIN users_racers ur
            ON b.racer_id = ur.racer_id
            LEFT JOIN racers r
            ON b.racer_id = r.id
            WHERE session_date = ${session_date} AND paid = ${false} AND user_id = ${id}
        `;

        const newToken = tokenGenerator(12);

        let newDate = new Date();
        newDate = safeDateConversion(addDays(newDate, 1)); // 1 day to use token
        
        const racersIds = racers.map(racer => racer.racer_id);


        const _ = await sql.begin(async sql => {
        
            // insert the token
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
                    ${tokenTypes.PAYMENT_PENDING}
                )
            `;

            // update bookings by adding token to those who are being paid for
            const trySetToken = await sql`
                UPDATE bookings
                SET token = ${newToken}
                WHERE racer_id IN ${ sql(racersIds) }
            `;

            return [
                tryNewToken, 
                trySetToken
            ]
        });

        // set up line items based on the racers we're booking
        const full_price = racers.filter(r => r.concession === 0).length;
        const reduced_price = racers.filter(r => r.concession !== 0).length;
        const line_items = [];
        if (full_price > 0) {
            line_items.push({
                'price': process.env.PRODUCT_PRICE_ID,
                'quantity': full_price
            })
        }
        if (reduced_price > 0) {
            line_items.push({
                'price': process.env.CONCESSION_PRICE_ID,
                'quantity': reduced_price
            })
        }
        
        // set up the session
        const session = await stripe.checkout.sessions.create({
            line_items,
            client_reference_id: newToken,
            mode: 'payment',
            success_url: `${process.env.ROOT_URL}/payment/success/${newToken}/`,
            cancel_url: `${process.env.ROOT_URL}/payment/failure/${newToken}/`,
        });

        res.redirect(303, session.url);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
        return;
    }
};
