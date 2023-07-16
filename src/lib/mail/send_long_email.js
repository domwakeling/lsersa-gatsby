import nodemailer from 'nodemailer';
import { htmlBlank } from './email_blank';

// async..await is not allowed in global scope, must use a wrapper
const sendLongEmail = async (emails, subject, headerText, bodyArrSent, plainBodyArr = bodyArrSent) => {

    const bodyElements = bodyArrSent.map(item => (
        `<tr>
            <td class="row" style="padding:0;padding-bottom:16px;">
                ${item}
            </td>
        </tr>`
    )).join('\n');

    const bodyText = `
        <td style="padding:0;">
            <table class="column" style="border-spacing:0;padding-left:8px;padding-right:8px;">
                <tr>
                    <td style="padding:10px 0 0 0;">
                        <h2 style="font-size: 20px;">
                            ${headerText}
                        </h2>
                    </td>
                </tr>
                ${bodyElements}
                <tr>
                    <td class="row" style="padding:0;padding-bottom:16px;padding-top:32px">
                        <img style="width: 100%" src="https://lsersa.org/images/sponsor_banner_1200.png">
                    </td>
                </tr>
            </table>
        </td>
    `

    const plainElements = plainBodyArr.join("\n\n");

    const messageText = `${headerText}\n\n${plainElements}`;

    const messageHTML = htmlBlank.replace("PLACEHOLDER_SECTION", bodyText);

    try {

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

        console.log('transporter ready for use');

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"LSERSA Booking System" <${process.env.EMAIL_ADDRESS}>`, // sender address
            to: `${process.env.EMAIL_ADDRESS}`,
            bcc: emails.join(", "), // list of receivers; this will go as bcc
            subject: subject, // Subject line
            text: messageText, // plain text body
            html: messageHTML // html body
        });

        console.log('Long email send request generated:', info)
        return info;

    } catch (error) {

        console.error(error.message);
        return null;
    }

}

export {
    sendLongEmail
}