import React, { useState } from 'react';
import FreeField from '../elements/FreeField';
import TextField from '../elements/TextField';
import { MESSAGE_CLASSES } from '../../../lib/constants';
import GenderSelection from '../elements/GenderSelection';
import ClubSelection from '../elements/ClubSelection';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import parseISO from 'date-fns/parseISO';

const RacerPane = ({ racer, editing = false, displayMessage, updatePane, clubs, user }) => {

    const [firstName, setFirstName] = useState(racer.first_name);
    const [lastName, setLastName] = useState(racer.last_name);
    const [dob, setDob] = useState(racer.dob ? parseISO(racer.dob) : null);
    const [clubId, setClubId] = useState(racer.club_id);
    const [genderId, setGenderId] = useState(racer.gender_id);
    const [userText, setUserText] = useState(racer.user_text || '')
    const [editable, setEditable] = useState(editing);

    const newRacer = async () => {
        const body = {
            user_id: user.id,
            new_racer: {
                first_name: firstName,
                last_name: lastName,
                dob,
                club_id: clubId,
                gender_id: genderId,
                user_text: userText
            }
        }
        const res = await fetch(`/api/user/racers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, `Racer added. New racer will need to be reviewed
                by the coaching team`);
            updatePane();
            return true;
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
            return false;
        }
    }

    const updateRacer = async () => {
        const body = {
            user_id: user.id,
            racer_id: racer.id,
            racer: {
                first_name: firstName,
                last_name: lastName,
                dob,
                club_id: clubId,
                gender_id: genderId,
                user_text: userText
            }
        }
        const res = await fetch(`/api/user/racers`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Racer updated");
            return true;
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
            return false;
        }
    }

    const buttonHandler = async (e) => {
        e.preventDefault();
        if (editing) {
            // saving a new racer
            const result = await newRacer();
            if (result) {
                setFirstName('');
                setLastName('');
                setDob(null);
                setClubId(undefined);
                setGenderId(undefined);
                setUserText('');
            }
        } else if (!editable) {
            // editing an existing racer
            setEditable(true);
        } else {
            // saving an existing racer
            const result = await updateRacer();
            if (result) {
                setEditable(false);
                setEditable(false);
                updatePane();
            }
        }
    }

    const cancelHandler = async (e) => {
        e.preventDefault();
        if (editable) {
            // cancel an editing attempt
            setEditable(false);
            setFirstName(racer.first_name);
            setLastName(racer.last_name);
            setDob(racer.dob ? parseISO(racer.dob) : null);
            setClubId(racer.club_id);
            setGenderId(racer.gender_id);
            setUserText(racer.user_text)
        } else {
            // this was the delete button
            displayMessage(MESSAGE_CLASSES.ALERT, `To delete a racer, please email the coaching
                team`);
        }
    }

    return (
        <div className="admin-pane">
            <TextField
                label="first name"
                placeholder="first name"
                value={firstName}
                setValue={setFirstName}
                checkEnterKey={() => { }}
                disabled={!editable}
            />
            <TextField
                label="last name"
                placeholder="last name"
                value={lastName}
                setValue={setLastName}
                checkEnterKey={() => { }}
                disabled={!editable}
            />
            <div className='date-selection'>
                <label>
                    date of birth
                    <DatePicker
                        selected={dob}
                        onChange={(date) => setDob(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText='dd/mm/yyyy'
                        disabled={!editable}
                    />
                </label>
            </div>
            <GenderSelection
                genderId={genderId}
                setGenderId={setGenderId}
                disabled={!editable}
            />
            <ClubSelection
                clubId={clubId}
                setClubId={setClubId}
                clubs={clubs}
                disabled={!editable}
            />
            <p><i>if club is not listed, include it below</i></p>
            <FreeField
                label="other info"
                value={userText}
                setValue={setUserText}
                checkEnterKey={() => { }}
                disabled={!editable}
            />
            <button
                className="club-button"
                onClick={buttonHandler}
                disabled={editable && (firstName === '' || lastName === '' || !genderId || !dob)}
            >
                {editable ? "save" : "edit"}
            </button>
            {!editing && (
                <button
                    className="cancel-button"
                    onClick={cancelHandler}
                >
                    {editable ? "cancel" : "delete"}
                </button>
            )}
        </div>
    )
}

export default RacerPane;