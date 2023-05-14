import React, {useState} from "react";
import TextField from "./elements/TextField";
import EmailField from "./elements/EmailField";

const UserDetail = ({user}) => {
    const userId = user.id;
    const [userEmail, setUserEmail] = useState(user.email);
    const [userEmailValid, setUserEmailValid] = useState(true);
    const [userFirstName, setUserFirstName] = useState(user.first_name || '');
    const [userSecondName, setUserSecondName] = useState(user.second_name || '');
    const [userMobile, setUserMobile] = useState(user.mobile || '');
    const [secondEmail, setSecondEmail] = useState(user.secondary_email);
    const [secondEmailValid, setSecondEmailValid] = useState(false); // TODO: this needs to be checked on load
    const [secondName, setSecondName] = useState(user.secondary_name || '');
    const [secondMobile, setSecondMobile] = useState(user.secondary_mobile || '');
    const [emergencyEmail, setEmergencyEmail] = useState(user.emergency_email);
    const [emergencyEmailValid, setEmergencyEmailValid] = useState(false); // TODO: this needs to be checked on load
    const [emergencyName, setEmergencyName] = useState(user.emergency_name || '');
    const [emergencyMobile, setEmergencyMobile] = useState(user.emergency_mobile || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: logic for requesting an account + visual notification
        // setEmail('');
        // setMessage(`Your request has been sent and a confirmation email has been sent to your
        //     email address. Please check your emails (and possible any spam folder) to ensure that
        //     this is received — once approved you will receive another email message inviting you
        //     to complete the sign-up process.`);
    }

    // capture <enter> key from 'search' input and divert
    const checkEnterKey = (e) => {
        if (e.keyCode === 13 && userEmailValid) {
            e.preventDefault();
            const fakeE = { preventDefault: () => { } };
            handleSubmit(fakeE);
        }
    };

    return (
        <div className="user-form">
            <h2 className="as-h3">User details</h2>
            <div className="user-form-columns">
                <EmailField
                    label="Email"
                    placeholder="email"
                    value={userEmail}
                    setValue={setUserEmail}
                    setEmailValid={setUserEmailValid}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="First Name"
                    placeholder="first name"
                    value={userFirstName}
                    setValue={setUserFirstName}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="Second Name"
                    placeholder="second name"
                    value={userSecondName}
                    setValue={setUserSecondName}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="Mobile"
                    placeholder="mobile"
                    value={userMobile}
                    setValue={setUserMobile}
                    checkEnterKey={checkEnterKey}
                />
                <label>
                    Password
                    <input
                        type="password"
                        // id="emailEnter"
                        // name="emailEnter"
                        // onChange={handleEmail}
                        // onKeyDown={checkEnterKey}
                        // value={email}
                        placeholder="password"
                    />
                </label>
                <label>
                    confirm password
                    <input
                        type="password"
                        // id="emailEnter"
                        // name="emailEnter"
                        // onChange={handleEmail}
                        // onKeyDown={checkEnterKey}
                        // value={email}
                        placeholder="password"
                    />
                </label>
                <label>
                    Address 1
                    <input
                        type="text"
                        // id="emailEnter"
                        // name="emailEnter"
                        // onChange={handleEmail}
                        // onKeyDown={checkEnterKey}
                        // value={email}
                        placeholder="address 1"
                    />
                </label>
                <label>
                    Address 2
                    <input
                        type="text"
                        // id="emailEnter"
                        // name="emailEnter"
                        // onChange={handleEmail}
                        // onKeyDown={checkEnterKey}
                        // value={email}
                        placeholder="address 2"
                    />
                </label>
                <label>
                    City
                    <input
                        type="text"
                        // id="emailEnter"
                        // name="emailEnter"
                        // onChange={handleEmail}
                        // onKeyDown={checkEnterKey}
                        // value={email}
                        placeholder="city"
                    />
                </label>
                <label>
                    Postcode
                    <input
                        type="text"
                        // id="emailEnter"
                        // name="emailEnter"
                        // onChange={handleEmail}
                        // onKeyDown={checkEnterKey}
                        // value={email}
                        placeholder="postcode"
                    />
                </label>
            </div>
            <hr />
            
            <h2 className="as-h3">Second contact (optional)</h2>
            <div className="user-form-columns">
                <TextField
                    label="Name"
                    placeholder="name"
                    value={secondName}
                    setValue={setSecondName}
                    checkEnterKey={checkEnterKey}
                />
                <EmailField
                    label="Email"
                    placeholder="email"
                    value={secondEmail}
                    setValue={setSecondEmail}
                    setEmailValid={setSecondEmailValid}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="Mobile"
                    placeholder="mobile"
                    value={secondMobile}
                    setValue={setSecondMobile}
                    checkEnterKey={checkEnterKey}
                />
            </div>
            <hr/>

            <h2 className="as-h3">Emergency contact</h2>
            <div className="user-form-columns">
                <TextField
                    label="Name"
                    placeholder="name"
                    value={emergencyName}
                    setValue={setEmergencyName}
                    checkEnterKey={checkEnterKey}
                />
                <EmailField
                    label="Email"
                    placeholder="email"
                    value={emergencyEmail}
                    setValue={setEmergencyEmail}
                    setEmailValid={setEmergencyEmailValid}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="Mobile"
                    placeholder="mobile"
                    value={emergencyMobile}
                    setValue={setEmergencyMobile}
                    checkEnterKey={checkEnterKey}
                />            
            </div>
            <br />
            <button
                disabled={!userEmailValid}
                onClick={handleSubmit}
            >
                Update
            </button>
        </div>
    )
}

export default UserDetail;