import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/booking/elements/LoadingSpinner";
import UserDetail from "../../components/booking/users/UserDetails";
import { COMPLETING_MODES } from "../../lib/modes";

const ValidateUser = ({params}) => {
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState(COMPLETING_MODES.LOADING)

    const token = params.token;

    // on load, check to see if the token is valid and if so retrieve user ...
    useEffect(() => {
        // hooks require that async function is defined before being called; this checks for a token
        async function retrieveUserFromToken() {
            const res = await fetch(`/api/user/new-account-complete/${token}/`);
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

    const handleUserDetailSubmit = async (userData) => {
        const body = {
            user: userData,
            token: token
        }
        const res = await fetch(`/api/user/new-account-complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.status === 200) {
            // set message ...
            setMode(COMPLETING_MODES.SUBMIT_GOOD);
            // attempt to transfer to booking page (which will recognise the cookie) ...
            navigate("/booking/");

        } else {
            // likely status 400, but error regardless
            setMode(COMPLETING_MODES.SUBMIT_BAD);
        }
    }

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className="underlined">Complete Sign Up</h1>
                    
                    { (mode === COMPLETING_MODES.LOADING) && (
                        <LoadingSpinner />
                    )}

                    { mode === COMPLETING_MODES.INVALID_TOKEN && (
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
                            <p>Please fill out the details below to complete your account
                                sign-up.</p>
                            <UserDetail
                                user={user}
                                handleUserDetailSubmit={handleUserDetailSubmit}
                            />
                        </>
                    )}

                    {mode === COMPLETING_MODES.SUBMIT_GOOD && (
                        <div className="advice-box">
                            <p>Success, your account is verified! Please <a href="/booking/">log
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

export default ValidateUser;