import Stripe from "stripe";
import { connect } from '@planetscale/database';
import { fetch } from 'undici';
import { token } from '../../lib/token';
import { verifyIdMatchesToken } from '../../lib/users/verify_user_id';
import { tokenTypes } from "../../lib/db_refs";

const config = {
    fetch,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

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
        const jwtToken = req.cookies.lsersaUserToken;
        if (!jwtToken || jwtToken === undefined || jwtToken === null) {
            // error, most likely didn't find a cookie
            res.status(204).json({ message: "Cookie not found" });
            return;
        }

        // check if user_id matches with stored JWT
        const isUser = await verifyIdMatchesToken(id, jwtToken);

        if (!isUser) {
            // not self and not an admin
            res.status(401).json({ message: 'ERROR: You do not have access' });
            return;
        }

        // get racers that are booked and awaiting payment
        const session_date = date.split("T")[0];
        const conn = await connect(config);
        const racers = await conn.execute(`
            SELECT b.racer_id, paid, user_id, id, concession
            FROM bookings b
            LEFT JOIN users_racers ur
            ON b.racer_id = ur.racer_id
            LEFT JOIN racers r
            ON b.racer_id = r.id
            WHERE session_date = ? AND paid = ? AND user_id = ?`,
            [session_date, false, id]
        )

        const newToken = token(12);

        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 1); // 1 day to use token

        console.log(racers.rows);
        const racersIds = racers.rows.map(racer => racer.racer_id);
        // console.log(racersIds);
        const idPlaceholders = racersIds.map(racer => "?").join(",");

        const results = await conn.transaction(async (tx) => {
            // insert the token
            // console.log("STARTING TO INSERT TOKEN")
            const tryNewToken = await tx.execute(
                'INSERT INTO tokens (user_id, token, expiresAt, type_id) VALUES (?,?,?,?)',
                [id, newToken, newDate, tokenTypes.PAYMENT_PENDING]
            );

            // add token to the racers
            // console.log("STARTING TO UPDATE USERS")
            // console.log(`UPDATE bookings
                // SET token = ?
                // WHERE racer_id IN (${idPlaceholders})`)
            const trySetToken = await tx.execute(`
                UPDATE bookings
                SET token = ?
                WHERE racer_id IN (${idPlaceholders})`,
                [newToken, ... racersIds]
            );

            return [
                tryNewToken,
                trySetToken
            ]
        });

        const full_price = racers.rows.filter(r => r.concession === 0).length;
        const reduced_price = racers.rows.filter(r => r.concession !== 0).length;
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


        // use that token in the "success" and "failure" callbacks
        // write the callback pages
        // - on success, write everything to paid and remove the token
        // - on failure, write the tokens in 'bookings' back to null and remove the token
        
        const session = await stripe.checkout.sessions.create({
            line_items,
            client_reference_id: token,
            mode: 'payment',
            success_url: `${process.env.ROOT_URL}/payment/success/${newToken}/`,
            cancel_url: `${process.env.ROOT_URL}/payment/failure/${newToken}/`,
        });

        res.status(200).json({url: session.url});
        return;

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
        return;
    }
};
