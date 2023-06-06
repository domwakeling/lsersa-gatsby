import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import Layout from "../../../components/Layout";
import LoadingSpinner from "../../../components/booking/elements/LoadingSpinner";
import { COMPLETING_MODES } from "../../../lib/modes";

const PaymentSuccess = ({ params }) => {
    const [mode, setMode] = useState(COMPLETING_MODES.LOADING);

    // on load, check to see if the token is valid paymentPending token and if so set paid ...
    useEffect(() => {
        async function completePaymentForToken() {
            const res = await fetch(`/api/stripe/complete-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            });
            if (res.status === 200) {
                setMode(COMPLETING_MODES.SUBMIT_GOOD);
                // attempt to transfer to booking page (which will recognise the cookie) ...
                navigate("/booking/");

            } else {
                // likely status 400, but error regardless
                setMode(COMPLETING_MODES.SUBMIT_BAD);
            }
        }
        completePaymentForToken();
    }, [params]);

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className="underlined">Payment Successful</h1>

                    {(mode === COMPLETING_MODES.LOADING) && (
                        <>
                            <LoadingSpinner />
                            <div className="advice-box">
                                <p>Payment completing, please wait.</p>
                            </div>
                        </>
                    )}

                    {mode === COMPLETING_MODES.SUBMIT_GOOD && (
                        <div className="advice-box">
                            <p>Payment confirmed, return to the <a href="/booking/">booking
                                page</a> to continue.</p>
                        </div>
                    )}

                    {mode === COMPLETING_MODES.SUBMIT_BAD && (
                        <div className="advice-box">
                            <p>There was a problem completing your payment; this appears to have
                                been in the booking system rather than with Stripe so your payment
                                has likely gone through. Please contact the coaching team.</p>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    )
}

export default PaymentSuccess;