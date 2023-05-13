import React, { useState } from "react";
import Layout from "../components/Layout.jsx";
import { MODES, ADMINMODES } from "../lib/modes.js";
import SignUp from "../components/booking/SignUp.jsx";

const BookingPage = () => {
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState(MODES.WELCOME);
    const [adminMode, setAdminMode] = useState(null);
    const [userMode, setUserMode] = useState(null);

    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);

    const setWelcome = () => { setMode(MODES.WELCOME) }
    const setAdmin = () => { setMode(MODES.ADMIN) }
    const setLoggedIn = () => { setMode(MODES.LOGGED_IN) }
    const setLogging = () => { setMode(MODES.LOGGING_IN) }
    const setSigning = () => { setMode(MODES.SIGNING_UP) }
    
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className="underlined">Booking</h1>

                    <div style={{ backgroundColor: "lightgreen", marginBottom: "2.0rem"}}>
                        <h2>TEMPORARY PANEL</h2>
                        <p>Select mode to see the developed UI (not currently linked up to database)</p>
                        <div>
                            <button onClick={setWelcome}>Welcome</button>
                            <button onClick={setLogging}>Log In</button>
                            <button onClick={setAdmin}>Admin User</button> 
                            <button onClick={setLoggedIn}>Normal User</button>
                            <button onClick={setSigning}>Sign Up</button>
                        </div>
                        <br/>
                    </div>

                    {mode === MODES.ADMIN && (
                        <div>
                            <p>ADMIN</p>
                            <p>Needs to be able to:</p>
                            <ul>
                                <li>invite someone to create an account by sending an email</li>
                                <li>make edits on someone else's account - contact details, email address etc</li>
                                <li>edit name, club and age for individual racers</li>
                                <li>Link an existing racer to a new parent account</li>
                                <li>turn off bookings for future weeks and specify why</li>
                                <li>change the number of racers that will be accepted on a sesssion</li>
                                <li>post a message about a session (which may be why it's cancelled!)</li>
                            </ul>
                        </div>
                    )}

                    {mode === MODES.LOGGED_IN && (
                        <div>
                            <p>LOGGED IN</p>
                            <p>Normal user logged in</p>
                        </div>
                    )}

                    {mode === MODES.LOGGING_IN && (
                        <div>
                            <p>LOGGING IN</p>
                            <p>present an email and password login, plus a "forgot password"
                                dialogue option and a link for "actually I don't have an account"</p>
                        </div>
                    )}

                    {mode === MODES.SIGNING_UP && (
                        <SignUp
                            email={email}
                            emailValid={emailValid}
                            setEmail={setEmail}
                            setEmailValid={setEmailValid}
                        />
                    )}

                    {mode === MODES.WELCOME && (
                        <div>
                            <p>WELCOME</p>
                        </div>
                    )}

                </div>
            </div>
        </Layout>

    )
}

export default BookingPage;