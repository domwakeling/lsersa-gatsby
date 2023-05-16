import { sendShortEmail } from "./send_short_email";

// async..await is not allowed in global scope, must use a wrapper
const emailNewAccountTokenToUser = async (token, email) => {

    const subject = "[TEST, IGNORE] Welcome to LSERSA";

    const headText = "WELCOME TO LSERSA";
    
    const bodyText = `Your account request has been accepted. Please follow <a
        href="https://lsersa.org/validateuser/${token}">this link</a> to complete your account
        sign-up.`

    const plainText = `Your account request has been accepted. Please follow this link
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
    emailNewAccountTokenToUser
}