import React, { useState } from "react";
import FreeField from "../elements/FreeField";
import { EMAIL_BATCH_SIZE, MESSAGE_CLASSES } from "../../../lib/constants";

const AdminSendEmail = ({ displayMessage }) => {

    let stdText = "If you want to take part in next Saturday's Regional Training, please read the ";
    stdText = stdText + "notes below and enter using the booking system ";
    stdText = stdText + "(https://lsersa.org/booking). Places are limited to a maximum of XX for ";
    stdText = stdText + "this session on a first come first served basis as usual. Booking won't be ";
    stdText = stdText + "available once all places are taken OR after midnight Wednesday. Booking ";
    stdText = stdText + "is restricted to LSERSA club members until midnight Monday evening and ";
    stdText = stdText + "then open to all from then on. Please don't attend without booking on.";

    let stdBullets = "Please pay at the same time as booking on via the booking system\n";
    stdBullets = stdBullets + "The cost of the session is currently £22\n";
    stdBullets = stdBullets + "Session is 9 - 11am as usual\n";
    stdBullets = stdBullets + "Please only put your name down if you definitely want to train\n"
    stdBullets = stdBullets + "Ski racing is a sport which carries a heightened risk of injury ";
    stdBullets = stdBullets + "relative to many other sports. By booking and participating in ";
    stdBullets = stdBullets + "these sessions, athletes/parents/guardians are agreeing that they ";
    stdBullets = stdBullets + "fully understand this aspect of the sport and do so entirely at ";
    stdBullets = stdBullets + "their own risk. If you have any doubts regarding this, please ";
    stdBullets = stdBullets + "contact us at regionalcoach@lsersa.org and we will address any ";
    stdBullets = stdBullets + "concerns or queries with you"

    const [subject, setSubject] = useState('LSERSA Regional Race Training Saturday');
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
            console.log(`Got email count: total ${emailCount}  will be sent in ${cycleCount} batches`)

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
                    console.log(`Emails sent, batch ${i + 1} of ${cycleCount}`)
                    displayMessage(MESSAGE_CLASSES.SUCCESS, `Emails sent, batch ${i+1} of ${cycleCount}`);
                } else {
                    const data = await res.json();
                    throw data;
                }
                i = i + 1;
            }

        } catch (error) {
            console.log("error caught")
            console.log(error.message);
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