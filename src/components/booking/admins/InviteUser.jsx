import React, { useState } from "react";
import EmailField from "../elements/EmailField";
import { MESSAGE_CLASSES, MESSAGE_TIME } from "../../../lib/constants";

const InviteUser = ({ displayMessage }) => {
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        // button is acting as verify
        const body = {
            email
        }        
        
        const res = await fetch(`/api/admin/admin-new-account`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Invite sent");
            setEmail('');
        } else if (res.status === 409) {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.ALERT, data.message);
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
        }
    }

    const checkEnterKey = (e) => {
        if (e.keyCode === 13 && emailValid) {
            e.preventDefault();
            const fakeE = { preventDefault: () => { } };
            submitHandler(fakeE);
        }
    };    

    return (
        <>
            <h3>Invite New Users</h3>
            <div className="invite-pane">
                <EmailField
                    label="email"
                    value={email}
                    setValue={setEmail}
                    placeholder="email"
                    setEmailValid={setEmailValid}
                    checkEnterKey={checkEnterKey}
                />
                <button onClick={submitHandler} disabled={!emailValid}>
                    Send
                </button>
            </div>
            <br />
        </>
    )
}

export default InviteUser;