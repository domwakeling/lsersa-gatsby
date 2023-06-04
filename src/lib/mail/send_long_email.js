import { sendEmail } from './send_email';
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

    let info = await sendEmail(
        emails,
        subject,
        `${headerText}\n\n${plainElements}`,
        htmlBlank.replace("PLACEHOLDER_SECTION", bodyText)
    )

    return info;
}

export {
    sendLongEmail
}