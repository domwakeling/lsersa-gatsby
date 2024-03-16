import sql from "../../lib/db";

export default async function handler(req, res) {
    // not protecting this route
    
    if (req.method == 'GET') {
        try {
            const users = await sql`SELECT id FROM users WHERE verified = FALSE`;
            const racers = await sql`SELECT id FROM racers WHERE verified = FALSE`;

            res.status(200).json({
                users: users.length,
                racers: racers.length
            });
            return;

        } catch (error) {
            console.log(error.message);
            // generic error message
            res.status(500).json({ message: "Server error: bad request" });
            return;
        }

    } else {
        // method is not GET, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}