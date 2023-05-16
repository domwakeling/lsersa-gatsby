import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { MODES } from "../lib/modes.js";
import { roles } from "../lib/db_refs.js";
import LogIn from "../components/booking/LogIn.jsx";
import PasswordResetRequest from "../components/booking/PasswordResetRequest.jsx";
import SignUp from "../components/booking/SignUp.jsx";
import UserDashboard from "../components/booking/UserDashboard.jsx";
import AdminDashboard from "../components/booking/AdminDashboard.jsx";
import LoadingSpinner from "../components/booking/elements/LoadingSpinner.jsx";

const BookingPage = () => {
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState(MODES.LOADING);

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);

    useEffect(() => {
        // hooks require that async function is defined before being called; this checks for a token
        async function checkForToken() {
            const res = await fetch("/api/polljwt");
            if (res.status == 200) {
                const data = await res.json();
                setUser(data);
                if(data.role === roles.ADMIN) {
                    setMode(MODES.ADMIN);
                } else {
                    setMode(MODES.LOGGED_IN);
                }
            } else {
                // no token or invalid user, go to the log-in screen
                setMode(MODES.LOGGING_IN)
            }
        }
        if (!user && mode === MODES.LOADING) {
            // send to an endpoint to see whether there's a token embedded ...
            checkForToken();
        }
    }, [user, mode]);

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className="underlined">Booking</h1>
                    <hr/>
                    {typeof user}
                    {' '}
                    {user}
                    {' '}
                    {user == null && "null"}
                    <hr />

                    {mode === MODES.LOADING && (
                        <LoadingSpinner />
                    )}

                    {mode === MODES.ADMIN && (
                        <AdminDashboard user={user}/>
                    )}

                    {mode === MODES.LOGGED_IN && (
                        <UserDashboard user={user} />
                    )}

                    {mode === MODES.LOGGING_IN && (
                        <LogIn
                            email={email}
                            emailValid={emailValid}
                            setEmail={setEmail}
                            setEmailValid={setEmailValid}
                            setMode={setMode}
                        />
                    )}

                    {mode === MODES.SIGNING_UP && (
                        <SignUp
                            email={email}
                            emailValid={emailValid}
                            setEmail={setEmail}
                            setEmailValid={setEmailValid}
                            setMode={setMode}
                        />
                    )}

                    {mode === MODES.PASWORD_RESET_REQUEST && (
                        <PasswordResetRequest
                            email={email}
                            emailValid={emailValid}
                            setEmail={setEmail}
                            setEmailValid={setEmailValid}
                            setMode={setMode}
                        />
                    )}

                </div>
            </div>
        </Layout>

    )
}

export default BookingPage;