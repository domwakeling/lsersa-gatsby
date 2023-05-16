import nodemailer from 'nodemailer';

const sendEmail = async (emails, subject, messageText, messgeHTML) => {

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
        to: emails.join(", "), // list of receivers
        subject: subject, // Subject line
        text: messageText, // plain text body
        html: messgeHTML // html body
    });

    return info;
}

export {
    sendEmail
}