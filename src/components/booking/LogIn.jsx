import React, { useState } from "react";
import { Link } from "gatsby";
import { MODES } from "../../lib/modes";
import LoadingSpinner from "./elements/LoadingSpinner";
import { roles } from "../../lib/db_refs";

const LogIn = ({ email, setEmail, emailValid, setEmailValid, setMode, setUser }) => {
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const body = {
            email: email,
            password: password
        }
        const res = await fetch(`/api/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        setLoading(false);

        if (res.status === 200) {
            const data = await res.json();    
            setUser(data);
            if (data.role_id == roles.ADMIN) {
                setMode(MODES.ADMIN);
            } else {
                setMode(MODES.LOGGED_IN);
            }

        } else {
            // likely status 400, but error regardless
            setMessage(`There was a problem signing in. Please try again.`);
        }
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
            {loading && <LoadingSpinner />}
            {message !== '' && (
                <div className="advice-box">
                    <p>{message}</p>
                </div>
            )}
        </div>
    )
}

export default LogIn;