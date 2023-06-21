import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import PasswordField from '../../components/booking/elements/PasswordField';
import LoadingSpinner from "../../components/booking/elements/LoadingSpinner";
import HeaderComponent from "../../components/head/HeaderComponent";
import { COMPLETING_MODES } from "../../lib/modes";

const ResetPassword = ({ params }) => {
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState(COMPLETING_MODES.LOADING)
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const token = params.token;

    // on load, check to see if the token is valid passwordReset and if so retrieve user info ...
    useEffect(() => {
        async function retrieveUserFromToken() {
            const res = await fetch(`/api/user/reset-password-complete/${token}/`);
            if (res.status === 200) {
                const data = await res.json();
                setUser(data);
                setMode(COMPLETING_MODES.TOKEN_FOUND);
            } else if (res.status === 404) {
                // if no token found, it'll be status 404
                setMode(COMPLETING_MODES.NO_TOKEN);
            } else {
                // likely status 400, but error regardless
                setMode(COMPLETING_MODES.INVALID_TOKEN);
            }
        }
        if (!user && mode === COMPLETING_MODES.LOADING) {
            // send to an endpoint to see whether there's a token embedded ...
            retrieveUserFromToken();
        }
    }, [user, mode, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            id: user.id,
            token: token,
            password: password1
        }
        const res = await fetch(`/api/user/reset-password-complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.status === 200) {
            // set message ...
            setMode(COMPLETING_MODES.SUBMIT_GOOD);

        } else {
            // likely status 400, but error regardless
            setMode(COMPLETING_MODES.SUBMIT_BAD);
        }
    }

    // capture <enter> key from 'search' input and divert
    const checkEnterKey = (e) => {
        if (e.keyCode === 13 && (password1 === password2) && password1 !== '') {
            e.preventDefault();
            const fakeE = { preventDefault: () => { } };
            handleSubmit(fakeE);
        }
    };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className="underlined">Reset Password</h1>

                    {(mode === COMPLETING_MODES.LOADING) && (
                        <LoadingSpinner />
                    )}

                    {mode === COMPLETING_MODES.INVALID_TOKEN && (
                        <div className="advice-box">
                            <p>Your link is invalid — it may have expired. Please contact the
                                coaching team for more help.</p>
                        </div>
                    )}

                    {mode === COMPLETING_MODES.NO_TOKEN && (
                        <div className="advice-box">
                            <p>That link does not work — it may be wrong, or may have expired. Please
                                check again, or contact the coaching team if you need more help.</p>
                        </div>
                    )}

                    {user !== null && (mode === COMPLETING_MODES.TOKEN_FOUND) && (
                        <>
                            <p>Please enter a new password.</p>
                            <div className="user-form">
                                <div className="user-form-columns">
                                    <PasswordField
                                        label="Password"
                                        value={password1}
                                        setValue={setPassword1}
                                        checkEnterKey={checkEnterKey}
                                    />
                                    <PasswordField
                                        label="Confirm Password"
                                        value={password2}
                                        setValue={setPassword2}
                                        checkEnterKey={checkEnterKey}
                                    />
                                </div>
                                <button
                                    disabled={(password1 !== password2) || (password1 === '')}
                                    onClick={handleSubmit}
                                >
                                    Update
                                </button>
                            </div>
                        </>
                    )}

                    {mode === COMPLETING_MODES.SUBMIT_GOOD && (
                        <div className="advice-box">
                            <p>Success, your password has been reset! Please <a href="/booking/">log
                                in</a> to continue.</p>
                        </div>
                    )}

                    {mode === COMPLETING_MODES.SUBMIT_BAD && (
                        <div className="advice-box">
                            <p>Unfortunately something has gone wrong - please reload the page. If
                                that doesn't work, contact the coaching team for help.</p>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    )
}

export default ResetPassword;

export const Head = () => (
    <HeaderComponent>
        <title>Booking | LSERSA</title>
    </HeaderComponent>
);