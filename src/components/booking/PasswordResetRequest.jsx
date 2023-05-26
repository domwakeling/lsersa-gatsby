import React, { useState } from "react";
import { Link } from "gatsby";
import { MODES } from "../../lib/modes";

const PasswordResetRequest = ({ email, setEmail, emailValid, setEmailValid, setMode }) => {
    const [message, setMessage] = useState('');

    const handleEmail = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
        setMessage('');
        setEmailValid(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(e.target.value));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { email: email }
        const res = await fetch(`/api/user/password-reset-request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            setEmail('');
            setMessage(`An email has been sent with instructions to reset your password.`);
        } else {
            setMessage('There was an issue - please try again.')
        }
    }

    const setLogIn = (e) => {
        e.preventDefault();
        setMode(MODES.LOGGING_IN)
    }

    // capture <enter> key from 'search' input and divert
    const checkEnterKey = (e) => {
        if (e.keyCode === 13 && emailValid) {
            e.preventDefault();
            const fakeE = { preventDefault: () => { } };
            handleSubmit(fakeE);
        }
    };

    return (
        <div>
            <h2>RESET PASSWORD</h2>
            <p>Enter your email below and submit to request a password reset email.</p>
            <div className="booking-form">
                <input
                    type="text"
                    id="emailEnter"
                    name="emailEnter"
                    onChange={handleEmail}
                    onKeyDown={checkEnterKey}
                    value={email}
                    placeholder="email address"
                />
                <button
                    disabled={!emailValid}
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
            {message !== '' && (
                <div className="advice-box">
                    <p>{message}</p>
                </div>
            )}
            <p>Back to <Link to="#" onClick={setLogIn}>log in</Link>.</p>
        </div>
    )
}

export default PasswordResetRequest;