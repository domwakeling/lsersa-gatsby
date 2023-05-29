import { sendShortEmail } from "./send_short_email";

// async..await is not allowed in global scope, must use a wrapper
const adminEmailNewAccountTokenToUser = async (token, email) => {

    const subject = "Your invitation LSERSA";

    const headText = "WELCOME TO LSERSA";

    const bodyText = `You have been invited to set up an account on LSERSA. Please follow <a
        href="https://lsersa.org/validateuser/${token}">this link</a> to complete your account
        sign-up.`

    const plainText = `You have been invited to set up an account on LSERSA. Please follow this link
        https://lsresa.org/validateuser/${token} to complete your account sign-up.`

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
    adminEmailNewAccountTokenToUser
}