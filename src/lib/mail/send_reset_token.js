import { sendShortEmail } from "./send_short_email";

// async..await is not allowed in global scope, must use a wrapper
const emailResetPasswordTokenToUser = async (token, email) => {

    const subject = "Welcome to LSERSA";

    const headText = "PASSWORD RESET";

    const bodyText = `Please follow <a href="https://lsersa.org/passwordreset/${token}">this link</a>
        to complete your password reset. If you did not request this reset, please contact the
        coaching team.`

    const plainText = `Please follow this link https://lsersa.org/passwordreset/${token} to complete
        your password reset. If you did not request this reset, please contact the coaching team.`

    let info = await sendShortEmail(
        [email],
        subject,
        headText,
        bodyText,
        plainText
    )

    return info;
}

export {
    emailResetPasswordTokenToUser
}