import nodemailer from 'nodemailer';
import { htmlBlank } from '../email_blank';

// async..await is not allowed in global scope, must use a wrapper
const sendShortEmail = async (email, subject, headerText, bodyTextSent) => {

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
                <tr>
                    <td class="row" style="padding:0;padding-bottom:16px;">
                        ${bodyTextSent}
                    </td>
                </tr>
            </table>
        </td>
`
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

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"LSERSA Booking System" <${process.env.EMAIL_ADDRESS}>`, // sender address
        to: email.join(", "), // list of receivers
        subject: subject, // Subject line
        text: `${headerText}\n\n${bodyTextSent}`, // plain text body
        html: htmlBlank
            .replace("PLACEHOLDER_SECTION", bodyText), // html body
    });

    return info;
}

export {
    sendShortEmail
}