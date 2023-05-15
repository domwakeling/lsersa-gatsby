// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';
import { htmlBlank } from '../../lib/email_blank';

/*

<tr>
    <td class="row" style="padding:0;padding-bottom:16px;">
        Please click on <a class="underlined" href="${rooturl}/forget-password/${token}">this link</a> to reset
        your password.
    </td>
    <tr>
        <td class="row" style="padding:0;padding-bottom:16px;">
            If you did not request a password reset, please contact Dom Wakeling.
        </td>
    </tr>
</tr>
*/



const bodyText = `
    <td style="padding:0;">
        <table class="column" style="border-spacing:0;padding-left:8px;padding-right:8px;">
            <tr>
                <td style="padding:10px 0 0 0;">
                    <h2 style="font-size: 20px;">
                        HEADER_PLACEHOLDER
                    </h2>
                </td>
            </tr>
            <tr>
                <td class="row" style="padding:0;padding-bottom:16px;">
                    BODY_PLACEHOLDER
                </td>
            </tr>
        </table>
    </td>
`

// async..await is not allowed in global scope, must use a wrapper
async function main() {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const subject = "Welcome to LSERSA";
    const newHeader = "WELCOME TO LSERSA";
    const newBodyText = "This is a test."

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"LSERSA Booking System" <${process.env.EMAIL_ADDRESS}>`, // sender address
        to: "domwakeling@gmail.com", // list of receivers
        subject: subject, // Subject line
        text: `${newHeader}\n\n${newBodyText}`, // plain text body
        html: htmlBlank
                .replace("PLACEHOLDER_SECTION", bodyText)
                .replace("HEADER_PLACEHOLDER", newHeader)
                .replace("BODY_PLACEHOLDER", newBodyText), // html body
    });

    return info;
}

export default async function handler(req, res) {

    const ret = await main().catch(console.error);

    res.status(200).json({ message: ret });

}

/* typical response:

{
    "message": {
        "accepted": [
            "domwakeling@gmail.com"
        ],
        "rejected": [],
        "ehlo": [
            "ENHANCEDSTATUSCODES",
            "PIPELINING",
            "8BITMIME",
            "SIZE 31457280",
            "DSN",
            "AUTH PLAIN LOGIN",
            "DELIVERBY",
            "HELP"
        ],
        "envelopeTime": 75,
        "messageTime": 137,
        "messageSize": 6151,
        "response": "250 2.0.0 34DC4ggT028963 Message accepted for delivery",
        "envelope": {
            "from": "bookingsystem@lsersa.org",
            "to": [
                "domwakeling@gmail.com"
            ]
        },
        "messageId": "<9de21d64-8c62-8615-a0e3-b4f6169d269d@lsersa.org>"
    }
}

*/