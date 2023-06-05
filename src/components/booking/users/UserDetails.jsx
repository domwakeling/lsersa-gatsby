import React, {useState} from "react";
import EmailField from "../elements/EmailField";
import PasswordField from "../elements/PasswordField";
import TextField from "../elements/TextField";

const UserDetail = ({
    user,
    emptyPasswordOk = false,
    handleUserDetailSubmit,
    updating = false
}) => {
 
    const [userEmail, setUserEmail] = useState(user.email);
    const [userEmailValid, setUserEmailValid] = useState(true);
    const [userFirstName, setUserFirstName] = useState(user.first_name || '');
    const [userLastName, setUserLastName] = useState(user.last_name || '');
    const [userMobile, setUserMobile] = useState(user.mobile || '');
    const [secondEmail, setSecondEmail] = useState(user.secondary_email || '');
    const [secondEmailValid, setSecondEmailValid] = useState(true);
    const [secondName, setLastName] = useState(user.secondary_name || '');
    const [secondMobile, setSecondMobile] = useState(user.secondary_mobile || '');
    const [emergencyEmail, setEmergencyEmail] = useState(user.emergency_email || '');
    const [emergencyEmailValid, setEmergencyEmailValid] = useState(true);
    const [emergencyName, setEmergencyName] = useState(user.emergency_name || '');
    const [emergencyMobile, setEmergencyMobile] = useState(user.emergency_mobile || '');
    const [address1, setAddress1] = useState(user.address_1 || '');
    const [address2, setAddress2] = useState(user.address_2 || '');
    const [city, setCity] = useState(user.city || '');
    const [postcode, setPostcode] = useState(user.postcode || '');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = ({
            id: user.id,
            email: userEmail.toLowerCase(),
            password: password1,
            mobile: userMobile,
            first_name: userFirstName,
            last_name: userLastName,
            address_1: address1,
            address_2: address2,
            city: city,
            postcode: postcode,
            emergency_name: emergencyName,
            emergency_email: emergencyEmail.toLowerCase(),
            emergency_mobile: emergencyMobile,
            secondary_name: secondName,
            secondary_email: secondEmail.toLowerCase(),
            secondary_mobile: secondMobile,
        });
        handleUserDetailSubmit(newUser);
    }

    // capture <enter> key from 'search' input and divert
    const checkEnterKey = (e) => {
        if (e.keyCode === 13 && userEmailValid) {
            e.preventDefault();
            const fakeE = { preventDefault: () => { } };
            handleSubmit(fakeE);
        }
    };

    const copyDetails = (e) => {
        e.preventDefault();
        let newName = userFirstName + ( userFirstName !== '' && userLastName !== '' ? ' ' : '');
        newName = newName + userLastName;
        setEmergencyName(newName);
        setEmergencyEmail(userEmail);
        setEmergencyMobile(userMobile);
        setEmergencyEmailValid(userEmailValid);
    }

    return (
        <div className="user-form">
            <h2 className="as-h3">Your details</h2>
            <div className="user-form-columns">
                <TextField
                    label="First Name"
                    placeholder="first name"
                    value={userFirstName}
                    setValue={setUserFirstName}
                    checkEnterKey={checkEnterKey}
                    required={true}
                />
                <TextField
                    label="Last Name"
                    placeholder="last name"
                    value={userLastName}
                    setValue={setUserLastName}
                    checkEnterKey={checkEnterKey}
                    required={true}
                />
                <EmailField
                    label="Email"
                    placeholder="email"
                    value={userEmail}
                    setValue={setUserEmail}
                    emailValid={userEmailValid}
                    setEmailValid={setUserEmailValid}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="Mobile"
                    placeholder="mobile"
                    value={userMobile}
                    setValue={setUserMobile}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="Address 1"
                    placeholder="address 1"
                    value={address1}
                    setValue={setAddress1}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="Address 2"
                    placeholder="address 2"
                    value={address2}
                    setValue={setAddress2}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="City"
                    placeholder="city"
                    value={city}
                    setValue={setCity}
                    checkEnterKey={checkEnterKey}
                    required={true}
                />
                <TextField
                    label="Postcode"
                    placeholder="postcode"
                    value={postcode}
                    setValue={setPostcode}
                    checkEnterKey={checkEnterKey}
                />
            </div>
            <hr/>
            <h2 className="as-h3">Security</h2>
            <div className="user-form-columns">
                <PasswordField
                    label="Password"
                    value={password1}
                    setValue={setPassword1}
                    checkEnterKey={checkEnterKey}
                    required={!updating}
                />
                <PasswordField
                    label="Confirm Password"
                    value={password2}
                    setValue={setPassword2}
                    checkEnterKey={checkEnterKey}
                    required={!updating || (password1 !== password2)}
                />
            </div>
            {updating && (
                <p><i>To  update password, complete the fields above; otherwise password is not
                    required.</i></p>
            )}
            
            <hr/>

            <button
                style={{float: "right"}}
                disabled={((userFirstName === '') && (userLastName === '')) || (userMobile === '') ||
                        (userEmail === '') || !userEmailValid}
                onClick={copyDetails}
            >
                same as above
            </button>
            <h2 className="as-h3">Emergency contact</h2>
            <p>Please complete this <b>even if</b> the details are the same as for the account
                holder.</p>
            
            <div className="user-form-columns">
                <TextField
                    label="Name"
                    placeholder="name"
                    value={emergencyName}
                    setValue={setEmergencyName}
                    checkEnterKey={checkEnterKey}
                    required={true}
                />
                <EmailField
                    label="Email"
                    placeholder="email"
                    value={emergencyEmail}
                    setValue={setEmergencyEmail}
                    emailValid={emergencyEmailValid}
                    setEmailValid={setEmergencyEmailValid}
                    checkEnterKey={checkEnterKey}
                />
                <TextField
                    label="Mobile"
                    placeholder="mobile"
                    value={emergencyMobile}
                    setValue={setEmergencyMobile}
                    checkEnterKey={checkEnterKey}
                    required={true}
                />            
            </div>
            <hr />
            
            <h2 className="as-h3">Second contact (optional)</h2>
            <p>Please complete if there is a second person you would like to be notified when emails
                relating to the booking system are sent (can also be used for account recovery in
                the event that you lose access to your main email).</p>
            <div className="user-form-columns">
                <TextField
                    label="Name"
                    placeholder="name"
                    value={secondName}
                    setValue={setLastName}
                    checkEnterKey={checkEnterKey}
                />
                <EmailField
                    label="Email"
                    placeholder="email"
                    value={secondEmail}
                    setValue={setSecondEmail}
                    emailValid={secondEmailValid}
                    setEmailValid={setSecondEmailValid}
                    checkEnterKey={checkEnterKey}
                    emptyOk={true}
                />
                <TextField
                    label="Mobile"
                    placeholder="mobile"
                    value={secondMobile}
                    setValue={setSecondMobile}
                    checkEnterKey={checkEnterKey}
                />
            </div>
            <br />
            <button
                disabled={(userFirstName === '') || (userLastName === '') || !userEmailValid ||
                    (userEmail === '') || !secondEmailValid || !emergencyEmailValid ||
                    (emergencyEmail === '') || (emergencyMobile === '') || (city === '') ||
                    (emergencyName === '') || (password1 !== password2) ||
                    (!emptyPasswordOk && password1 === '')}
                onClick={handleSubmit}
            >
                Update
            </button>
        </div>
    )
}

export default UserDetail;