import React, { useState } from "react";
import EmailField from "../elements/EmailField";
import TextField from "../elements/TextField";
import FreeField from '../elements/FreeField';
import AdminSelection from "../elements/AdminSelection";
import { roles } from "../../../lib/db_refs";

const AdminUserDetail = ({
    user,
    handleUserDetailSubmit,
    handleUserDetailCancel,
    handleUserDetailDelete
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
    const [adminText, setAdminText] = useState(user.admin_text || '');
    const [roleId, setRoleId] = useState(user.role_id || roles.USER);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            email: userEmail.toLowerCase(),
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
            admin_text: adminText,
            role_id: roleId
        };
        const updates = {};
        for (const [key, value] of Object.entries(newUser)) {
            if (newUser[key] !== user[key]) updates[key] = value;
        }
        handleUserDetailSubmit({id: user.id, updates: updates});
    }

    const handleCancel = (e) => {
        e.preventDefault();
        if (isDeleting) {
            setIsDeleting(false)
        } else {
            handleUserDetailCancel();
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();
        if (!isDeleting) {
            setIsDeleting(true);
        } else {
            handleUserDetailDelete(user.id)
        }
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
        let newName = userFirstName + (userFirstName !== '' && userLastName !== '' ? ' ' : '');
        newName = newName + userLastName;
        setEmergencyName(newName);
        setEmergencyEmail(userEmail);
        setEmergencyMobile(userMobile);
        setEmergencyEmailValid(userEmailValid);
    }

    return (
        <div className="user-form">
            <h2 className="as-h3">User's details</h2>
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
            <hr />

            <button
                style={{ float: "right" }}
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
                    emptyOk={false}
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
            <hr />

            <h2 className="as-h3">Admin only</h2>
            <div className="user-form-columns">
                <FreeField
                    label="Free text (admin only)"
                    value={adminText}
                    setValue={setAdminText}
                />
                <AdminSelection
                    roleId={roleId}
                    setRoleId={setRoleId}
                />
                <p>Account has {user.racer_count} racer{user.racer_count === 1 ? "" : "s"}</p>
            </div>
            <br />
            <button className="cancel-button no-top-margin" onClick={handleCancel}
            >
                Cancel
            </button>
            <button
                className="cancel-button no-top-margin"
                onClick={handleDelete}
                disabled={user.racer_count > 0 ? true : false}
            >
                {isDeleting ? "Confirm" : "Delete"}
            </button>
            <button
                disabled={(userFirstName === '') || (userLastName === '') || !userEmailValid ||
                    (userEmail === '') || !secondEmailValid || !emergencyEmailValid ||
                    (emergencyEmail === '') || (emergencyMobile === '') || (city === '') ||
                    (emergencyName === '')}
                onClick={handleSubmit}
            >
                Update
            </button>
        </div>
    )
}

export default AdminUserDetail;