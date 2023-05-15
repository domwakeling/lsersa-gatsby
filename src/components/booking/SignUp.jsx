import React, { useState }from "react";
import { Link } from "gatsby";
import { MODES } from "../../lib/modes";
import LoadingSpinner from "./elements/LoadingSpinner";

const SignUp = ({ email, setEmail, emailValid, setEmailValid, setMode }) => {
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false);

    const handleEmail = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
        setMessage('');
        setEmailValid(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(e.target.value));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setWaiting(true);
        const body = {
            email: email,
        }
        
        const res = await fetch("/api/user/newaccountrequest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const status = res.status;
        const data = await res.json();
        // response as appropriate
        setWaiting(false);
        if (status === 200) {
            setMessage(`Your request has been sent and a confirmation email has been sent to your
                email address. Please check your emails (and possible any spam folder) to ensure that
                this is received — once approved you will receive another email message inviting you
                to complete the sign-up process.`);
            setEmail('');
        } else {
            setMessage(data.message);
        }
    }

    // capture <enter> key from 'search' input and divert
    const checkEnterKey = (e) => {
        if (e.keyCode === 13 && emailValid) {
            e.preventDefault();
            const fakeE = { preventDefault: () => { } };
            handleSubmit(fakeE);
        }
    };

    const setLogIn = (e) => {
        e.preventDefault();
        setMode(MODES.LOGGING_IN)
    }

    return (
        <div>
            <h2>REQUEST AN ACCOUNT</h2>
            <p>To request a new account, please submit your email address. The
                request will be sent to the head coach for review.</p>
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
            <p>If you have an account, you need to <Link to="#" onClick={setLogIn}>log in</Link>.</p>
            { waiting && ( <LoadingSpinner />)}
            { message !== '' && (
                <div className="advice-box">
                    <p>{message}</p>
                </div>
            )}

            <br />
            <p><b>TODO:</b></p>
            <ul>
                <li>send confirmation email to the requestor</li>
                <li>send request email to head coach/admin</li>
                <li>add user with pending to the DB</li>
                <li><i>user then appears in the admin pane to confirm or deny</i></li>
                <li><i>once user is confirmed, they get an email with a link to confirm ...</i></li>
            </ul>
        </div>
    )
}

export default SignUp;