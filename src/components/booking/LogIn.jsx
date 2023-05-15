import React, { useState } from "react";
import { Link } from "gatsby";
import { MODES } from "../../lib/modes";

const LogIn = ({ email, setEmail, emailValid, setEmailValid, setMode }) => {
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');

    const handleEmail = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
        setMessage('');
        setEmailValid(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(e.target.value));
    }

    const handlePassword = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
        setMessage('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: logic for requesting an account + visual notification
        setEmail('');
        setMessage(`Your request has been sent and a confirmation email has been sent to your
            email address. Please check your emails (and possible any spam folder) to ensure that
            this is received — once approved you will receive another email message inviting you
            to complete the sign-up process.`);
    }

    const setSignIn = (e) => {
        e.preventDefault();
        setMode(MODES.SIGNING_UP)
    }

    const setPasswordReset = (e) => {
        e.preventDefault();
        setMode(MODES.PASWORD_RESET_REQUEST)
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
            <h2>LOG IN</h2>
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
                <br/>
                <input
                    type="password"
                    id="passwordEnter"
                    name="passwordEnter"
                    onChange={handlePassword}
                    onKeyDown={checkEnterKey}
                    value={password}
                    placeholder="password"
                />
                <button
                    disabled={!(emailValid && password !== '')}
                    onClick={handleSubmit}
                >
                    Log In
                </button>
            </div>
            <p>If you don't have an account, you need to <Link to="#" onClick={setSignIn}>create one</Link>.</p>
            <p><Link to="#" onClick={setPasswordReset}>Forgotten password</Link>?</p>
            {message !== '' && (
                <div className="advice-box">
                    <p>{message}</p>
                </div>
            )}

            <br />
            <p><b>TODO:</b></p>
            <ul>
                <li>deal with login flow</li>
                <li>error message in the event of a problem</li>
                <li><i>work out persistence of login using JWTs?</i></li> 
            </ul>
        </div>
    )
}

export default LogIn;