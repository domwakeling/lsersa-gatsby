import React, { useState } from "react";
import FreeField from "../elements/FreeField";
import { EMAIL_BATCH_SIZE, MESSAGE_CLASSES } from "../../../lib/constants";

const AdminSendEmail = ({ displayMessage }) => {

    let stdText = "If you want to take part in next Saturdays Regional Training, please read the ";
    stdText = stdText + "notes below and enter using the booking system ";
    stdText = stdText + "(https://lsersa.org/booking) by this Wednesday evening (booking won't be ";
    stdText = stdText + "available after midnight Wednesday). Please don't attend without booking ";
    stdText = stdText + "on as we arrange coaches and sessions based on who has registered.";

    let stdBullets = "The cost of the session is currently £22\n";
    stdBullets = stdBullets + "Session is 9 - 11am as usual\n";
    stdBullets = stdBullets + "Please only put your name down if you definitely want to train\n"
    stdBullets = stdBullets + "Payments should be made through the booking system."

    const [subject, setSubject] = useState('Saturday Training');
    const [text1, setText1] = useState('Hi Everyone');
    const [text2, setText2] = useState('');
    const [text3, setText3] = useState('');
    const [text4, setText4] = useState(stdText);
    const [bulletText, setBulletText] = useState(stdBullets);
    const [text5, setText5] = useState('Thanks and best');
    const [text6, setText6] = useState('Andy');

    const clickHandler = async (e) => {
        e.preventDefault();
        if (!subject || subject === '') {
            displayMessage(MESSAGE_CLASSES.ALERT, "Please add a subject for the email")
            return;
        }
        const body = {
            textElements: {
                subject,
                text1,
                text2,
                text3,
                text4,
                bulletText,
                text5,
                text6
            },
            iteration: 0
        }
        try {
            // get the count of emails
            const resCount = await fetch('/api/admin/email-count');
            const dataCount = await resCount.json();
            if (resCount.status !== 200) {
                // there was a problem, throw an error
                throw dataCount;
            }
            const emailCount = dataCount.emailCount;
            const cycleCount = Math.ceil(emailCount / EMAIL_BATCH_SIZE);

            // send batches
            let i = 0;
            while (i < cycleCount) {

                body.iteration = i;
                const res = await fetch(`/api/admin/send-group-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (res.status === 200) {
                    displayMessage(MESSAGE_CLASSES.SUCCESS, `Emails sent, batch ${i+1} of ${cycleCount}`);
                } else {
                    const data = await res.json();
                    throw data;
                }
                i = i + 1;
            }

        } catch (error) {
            console.log("error caught")
            displayMessage(MESSAGE_CLASSES.WARN, error.message);
        }
    }

    return (
        <>
            <button className="club-add-button" onClick={clickHandler}>
                send email
            </button>
            <h3>Admin Send Email</h3>
            <ul>
                <li>Adjust the fields below as required.</li>
                <li>Any fields that are empty will be skipped when the email is sent.</li>
            </ul>
            
            <div className="email-para-container">
                <FreeField
                    label="subject"
                    value={subject}
                    setValue={setSubject}
                    limited={false}
                    singleRow={true}
                />
                <FreeField
                    label="salutation"
                    value={text1}
                    setValue={setText1}
                    limited={false}
                    singleRow={true}
                />
                <FreeField
                    label="special if needed"
                    value={text2}
                    setValue={setText2}
                    limited={false}
                />
                <FreeField
                    label="special if needed"
                    value={text3}
                    setValue={setText3}
                    limited={false}
                />
                <FreeField
                    label="main body"
                    value={text4}
                    setValue={setText4}
                    limited={false}
                />
                <p><i>enter items for the bullet list as individual rows, they will be converted
                    to bullets when the email is sent (only in the field below)</i></p>
                <FreeField
                    label="bullet list"
                    value={bulletText}
                    setValue={setBulletText}
                    limited={false}
                />
                <FreeField
                    label="wrap up"
                    value={text5}
                    setValue={setText5}
                    limited={false}
                    singleRow={true}
                />
                <FreeField
                    label="name"
                    value={text6}
                    setValue={setText6}
                    limited={false}
                    singleRow={true}
                />
            </div>
        </>
    )
}

export default AdminSendEmail;