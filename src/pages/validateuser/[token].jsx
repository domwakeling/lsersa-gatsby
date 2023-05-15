import React, { useState } from "react";
import Layout from "../../components/Layout";
import UserDetail from "../../components/booking/UserDetails";
import LoadingSpinner from "../../components/booking/elements/LoadingSpinner";

const ValidateUser = ({params}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = params.token;

    // do something to try and retrieve data related to the token; if it matches a user, setUser;
    // when done setIsLoading false; show correct info in the meantime

    const setLoadingMode = () => {
        setIsLoading(true);
        setUser(null)
    }
    const setInputMode = () => {
        setIsLoading(false);
        setUser({
            email: 'dom@fmail.com',
            id: 1
        });
    }

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className="underlined">Complete Sign Up</h1>

                    <div style={{ backgroundColor: "lightgreen", marginBottom: "2.0rem" }}>
                        <h2>TEMPORARY PANEL</h2>
                        <p>Select mode to see the developed UI (not currently linked up to database)</p>
                        <div>
                            <button onClick={setLoadingMode}>Waiting for data</button>
                            <button onClick={setInputMode}>Complete user info</button>
                        </div>
                        <br />
                    </div>

                    
                    { isLoading && (
                        <LoadingSpinner />
                    )}

                    {
                        user !== null && (
                            <>
                                <p>Please fill out the details below to complete your account
                                    sign-up.</p>
                                <UserDetail
                                    user={user}
                                />
                            </>
                        )
                    }

                </div>
            </div>
        </Layout>
    )
}

export default ValidateUser;