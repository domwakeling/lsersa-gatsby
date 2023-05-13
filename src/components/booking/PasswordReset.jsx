import React, { useState } from "react";
import { Link } from "gatsby";
import { MODES } from "../../lib/modes";

const PasswordReset = ({ email, setEmail, emailValid, setEmailValid, setMode }) => {
    const [message, setMessage] = useState('');

    const handleEmail = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
        setMessage('');
        setEmailValid(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(e.target.value));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: logic for requesting an account + visual notification
        setEmail('');
        setMessage(`An email has been sent with instructions to reset your password.`);
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
                <p className="advice-box">{message}</p>
                )
            }
            <p>Back to <Link to="#" onClick={setLogIn}>log in</Link>.</p>

            <br />
            <p><b>TODO:</b></p>
            <ul>
                <li>check email address is in the system</li>
                <li>send email</li>
                <li>deal with errors</li>
                <li><i>user then appears in the admin pane to confirm or deny</i></li>
                <li><i>once user is confirmed, they get an email with a link to confirm ...</i></li>
            </ul>
        </div>
    )
}

export default PasswordReset;