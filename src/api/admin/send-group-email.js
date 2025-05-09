import sql from "../../lib/db";
import { sendLongEmail } from "../../lib/mail/send_long_email";
import { verifyUserHasAdminRole } from "../../lib/admin/verify_admin";
import { EMAIL_BATCH_SIZE } from '../../lib/constants';

export default async function handler(req, res) {

    if (req.method === 'POST') {

        console.log('called POST admin/send-group-email');

        try {
            // ensure user has admin rights
            const userJWT = req.cookies.lsersaUserToken;
            const hasAdmin = await verifyUserHasAdminRole(userJWT);
            if (!hasAdmin) {
                // without admin use we can only GET info ...
                console.log("Trying an operation without admin status")
                res.status(401).json({ message: 'ERROR: You do not have admin access' });
                return;
            }

            // parse the text into an html array and a plain-text array

            const { textElements, iteration } = req.body;
            console.log(`iteration ${iteration}`)
            
            const { subject } = textElements;
            if (!subject || subject === '') {
                res.status(400).json({message: "Cannot send an email with no subject"});
                return;
            }
            const htmlArray = [];
            const textArray = [];

            let keys = ['text1', 'text2', 'text3', 'text4'];
            for (let key of keys) {
                if (textElements[key] && textElements[key] !== '') {
                    htmlArray.push(textElements[key]);
                    textArray.push(textElements[key]);
                }
            }

            if (textElements.bulletText && textElements.bulletText !== '') {
                let bullets = textElements.bulletText.split("\n");
                let htmlBullets = ["<ul>"];
                for (let bullet of bullets) {
                    htmlBullets.push(`<li>${bullet}</li>`)
                }
                htmlBullets.push("</ul>");
                htmlArray.push(htmlBullets.join(""));
                textArray.push(bullets.map(item => `- ${item}`).join("\n"))
            }

            keys = ['text5', 'text6'];
            for (let key of keys) {
                if (textElements[key] && textElements[key] !== '') {
                    htmlArray.push(textElements[key]);
                    textArray.push(textElements[key]);
                }
            }

            if (htmlArray.length === 0) {
                // blank email
                console.log("No content received, email not sent");
                res.status(400).json({message: 'No content received, email not sent'});
                return;
            }

            // need to get all main and secondary emails, and ensure no duplicates ...
            console.log('Getting emails from DB');
            const users = await sql`SELECT email, secondary_email FROM users`;
            console.log('Got emails from DB');

            const userEmails = users.map(user => user.email);
            const secondEmails = users
                .filter(user => (user.secondary_email && user.secondary_email !== ''))
                .map(user => user.secondary_email);

            let emails = Array.from(new Set([...userEmails, ...secondEmails])).sort();

            const firstEmailIdx = iteration * EMAIL_BATCH_SIZE;
            const lastEmailIdx = (iteration + 1 ) * EMAIL_BATCH_SIZE;
            emails = emails.slice(firstEmailIdx, lastEmailIdx);
            
            // send the email
            console.log('Sending emails');
            const _ = await sendLongEmail(emails, subject, subject, htmlArray, textArray);
            console.log('Sent emails');

            res.status(200).json({ message: 'successfully sent email'});
            return;


        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
            return;
        }

    } else {
        // method is not acceptable, fail gracefully
        res.status(405).json({ message: "ERROR: method not allowed" });
        return;
    }
}