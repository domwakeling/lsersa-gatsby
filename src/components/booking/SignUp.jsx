import React, { useState }from "react";

const SignUp = ({ email, setEmail, emailValid, setEmailValid }) => {
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
        setMessage(`Your request has been sent and a confirmation email has been sent to your
            email address. Please check your emails (and possible any spam folder) to ensure that
            this is received — once approved you will receive another email message inviting you
            to complete the sign-up process.`);
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
            <h2>REQUEST AN ACCOUNT</h2>
            <p>To request a new account, please submit your email address. The
                request will be sent to the head coach for review.</p>
            <div className="postcode-form">
                <input
                    type="text"
                    id="emailRequest"
                    name="emailRequest"
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
            { message != '' && (
                <p className="advice-box">{message}</p>
            )

            }

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