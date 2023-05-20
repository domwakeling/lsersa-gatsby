import React, { useState } from "react";
import EmailField from "../elements/EmailField";

const InviteUser = () => {
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [message, setMessage] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        // button is acting as verify
        const body = {
            email
        }        
        
        const res = await fetch(`/api/admin/adminnewaccount`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            setMessage("Invite sent");
            setTimeout(() => {
                setMessage('');
            }, 3000)
        } else {
            setMessage("There was a problem");
            setTimeout(() => {
                setMessage('');
            }, 3000)
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
            {message && message !== '' && (
                <div className="advice-box">
                    <p>{message}</p>      
                </div>
            )}
        </>
    )
}

export default InviteUser;