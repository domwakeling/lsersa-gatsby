import React, { useState } from "react";
import EmailField from "../elements/EmailField";
import TextField from "../elements/TextField";
import FreeField from '../elements/FreeField';
import GenderSelection from "../elements/GenderSelection";
import ClubSelection from "../elements/ClubSelection";
import DateField from "../elements/DateField";
import parseISO from 'date-fns/parseISO';
import TwoSegment from "../elements/TwoSegment";
import { STYLES } from "../../../lib/constants";

const AdminRacerDetail = ({
    racer,
    handleRacerDetailSubmit,
    handleRacerDetailCancel,
    handleRacerDetailDelete,
    userEmails,
    clubs
}) => {
    const checkEmail = (email) => {
        if (!email || email === '') return false;
        if (userEmails.filter(user => user.email === email.toLowerCase()).length === 0) return false;
        return true;
    }

    const [racerEmail, setRacerEmail] = useState(racer.email || '');
    const [racerEmailValid, setRacerEmailValid] = useState(true);
    const [racerFirstName, setRacerFirstName] = useState(racer.first_name || '');
    const [racerLastName, setRacerLastName] = useState(racer.last_name || '');
    const [dob, setDob] = useState(racer.dob ? parseISO(racer.dob + "Z") : null);
    const [genderId, setGenderId] = useState(racer.gender_id || null);
    const [concession, setConcession] = useState(racer.concession || false);
    const [clubExpiry, setClubExpiry] = useState(racer.club_expiry ? parseISO(racer.club_expiry + "Z") : null);
    const [clubId, setClubId] = useState(racer.club_id || null);
    const [userText, setUserText] = useState(racer.user_text || '');
    const [adminText, setAdminText] = useState(racer.admin_text || '');
    const [isDeleting, setIsDeleting] = useState(false);

    const segmentHandler = (label) => {
        setConcession(label === "yes" ? true : false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // gather all the the details with correct keys
        const newRacer = {
            first_name: racerFirstName,
            last_name: racerLastName,
            dob: dob ? dob.toISOString().split("T")[0] : null,
            gender_id: genderId,
            concession: concession ? 1 : 0,
            club_id: clubId,
            club_expiry: clubExpiry ? clubExpiry.toISOString().split("T")[0] : null,
            user_text: userText,
            admin_text: adminText,
        };
        // start the update object & add all the key/value pairs that have changed
        const updateInfo = {
            racer_id: racer.racer_id,
            updates: {},
            racer_email: racerEmail
        };
        for (const [key, value] of Object.entries(newRacer)) {
            if (newRacer[key] !== racer[key]) updateInfo.updates[key] = value;
        }
        // get the user_id for the current email; if it's different, add it to the list ...
        const user_id = userEmails.filter(user => user.email === racerEmail.toLowerCase())[0].user_id;
        if (user_id !== racer.user_id) {
            updateInfo.user_id = user_id;
        }
        // send back to the AdminManageRacers pane to run the update
        handleRacerDetailSubmit(updateInfo);
    }

    const handleCancel = (e) => {
        e.preventDefault();
        if (isDeleting) {
            setIsDeleting(false)
        } else {
            handleRacerDetailCancel();
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();
        if (!isDeleting) {
            setIsDeleting(true);
        } else {
            handleRacerDetailDelete(racer.racer_id)
        }
    }

    // capture <enter> key from 'search' input and divert
    const checkEnterKey = (e) => {
        if (e.keyCode === 13 && racerEmailValid) {
            e.preventDefault();
            const fakeE = { preventDefault: () => { } };
            handleSubmit(fakeE);
        }
    };

    return (
        <div className="user-form">
            <h2 className="as-h3">Racer's details</h2>
            <div className="user-form-columns">
                <TextField
                    label="first name"
                    placeholder="first name"
                    value={racerFirstName}
                    setValue={setRacerFirstName}
                    checkEnterKey={checkEnterKey}
                    required={true}
                />
                <TextField
                    label="last name"
                    placeholder="last name"
                    value={racerLastName}
                    setValue={setRacerLastName}
                    checkEnterKey={checkEnterKey}
                    required={true}
                />
                <div style={ checkEmail(racerEmail) ? {} : STYLES.redText}>
                    <EmailField 
                        label="account email"
                        placeholder="email"
                        value={racerEmail}
                        setValue={setRacerEmail}
                        emailValid={racerEmailValid}
                        setEmailValid={setRacerEmailValid}
                        checkEnterKey={checkEnterKey}
                    />
                </div>
                <GenderSelection
                    genderId={genderId}
                    setGenderId={setGenderId}
                />
                <div className='date-selection'>
                    <DateField
                        label="date of birth"
                        value={dob}
                        setValue={setDob}
                        required={true}
                    />
                </div>
                <ClubSelection
                    clubId={clubId}
                    setClubId={setClubId}
                    clubs={clubs}
                />
                <FreeField
                    label="user text"
                    value={userText}
                    setValue={setUserText}
                    disabled={true}
                />
                
            </div>
            <hr />

            <h2 className="as-h3">Admin only</h2>
            <div className="user-form-columns">
                <FreeField
                    label="free text (admin only)"
                    value={adminText}
                    setValue={setAdminText}
                />
                <div className='date-selection'>
                    <DateField
                        label="renewal date"
                        value={clubExpiry}
                        setValue={setClubExpiry}
                    />
                </div>
                <TwoSegment
                    label="concession rate"
                    leftLabel="yes"
                    rightLabel="no"
                    segmentMinWidth="50px"
                    activeSegment={concession ? "left" : "right"}
                    reportClick={segmentHandler}
                />               
            </div>
            <br />
            <button className="cancel-button no-top-margin" onClick={handleCancel}
            >
                Cancel
            </button>
            <button
                className="cancel-button no-top-margin"
                onClick={handleDelete}
                disabled={racer.racer_count > 0 ? true : false}
            >
                {isDeleting ? "Confirm" : "Delete"}
            </button>
            <button
                disabled={(racerFirstName === '') || (racerLastName === '') || !genderId ||
                !dob || !racerEmailValid || !checkEmail(racerEmail)}
                onClick={handleSubmit}
            >
                Update
            </button>
        </div>
    )
}

export default AdminRacerDetail;