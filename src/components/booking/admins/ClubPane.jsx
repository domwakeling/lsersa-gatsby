import React, { useState} from 'react';
import EmailField from '../elements/EmailField';
import TextField from '../elements/TextField';
import TwoSegment from '../elements/TwoSegment';
import { MESSAGE_CLASSES, MESSAGE_TIME } from '../../../lib/constants';

const ClubPane = ({ club, editing=false, displayMessage, updatePane }) => {
    const [clubName, setClubName] = useState(club.name);
    const [affiliated, setAffiliated] = useState(club.affiliated);
    const [clubContact, setClubContact] = useState(club.contact_name);
    const [clubEmail, setClubEmail] = useState(club.contact_email);
    const [emailValid, setEmailValid] = useState(true);
    const [editable, setEditable] = useState(editing);
    const [isDeleting, setIsDeleting] = useState(false);

    const segmentHandler = (label) => {
        setAffiliated(label === "yes"? true : false);
    }

    const newClub = async () => {
        const body = {
            name: clubName,
            contact_name: clubContact,
            contact_email: clubEmail,
            affiliated
        }
        const res = await fetch(`/api/admin/clubs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Club added", MESSAGE_TIME);
            updatePane();
            return true;
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message, MESSAGE_TIME);
            return false;
        }
    }

    const updateClub = async () => {
        const body = {
            id: club.id,
            name: clubName,
            contact_name: clubContact,
            contact_email: clubEmail,
            affiliated
        }
        const res = await fetch(`/api/admin/clubs`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Club updated", MESSAGE_TIME);
            return true;
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message, MESSAGE_TIME);
            return false;
        }
    }

    const deleteClub = async () => {
        const body = { id: club.id }
        const res = await fetch(`/api/admin/clubs`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Club deleted", MESSAGE_TIME);
            return true;
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message, MESSAGE_TIME);
            return false;
        }
    }

    const buttonHandler = async (e) => {
        e.preventDefault();
        if (editing) {
            // saving a new club
            const result = await newClub();
            if (result) {
                setClubName('');
                setClubContact('');
                setClubEmail('');
                setAffiliated(false);
            }
        } else if(isDeleting) {
            // cancelling a delete request
            setIsDeleting(false);
        } else if(!editable) {
            // editing an existing club
            setEditable(true);
        } else {
            // saving an exisdting club
            const result = await updateClub();
            if (result) {
                setEditable(false);
                setEditable(false);
                updatePane();
            }
        }
    }

    const cancelHandler = async (e) => {
        e.preventDefault();
        if(editable) {
            // cancel an editing attempt
            setEditable(false);
            setClubName(club.name);
            setAffiliated(club.affiliated);
            setClubContact(club.contact_name);
            setClubEmail(club.contact_email);
        } else if(!isDeleting) {
            // not editable, not deleting => have pressed delete, change to confirm
            setIsDeleting(true);
        } else {
            // this was the confirm button
            const result = await deleteClub();
            if (result) {
                setIsDeleting(false);
                updatePane();
            }
        }
    }

    return (
        <div className="admin-pane">
            <TextField
                label="name"
                placeholder="club name"
                value={clubName}
                setValue={setClubName}
                checkEnterKey={() =>{}}
                disabled={!editable}
            />
            <TextField
                label="contact name"
                placeholder="club contact"
                value={clubContact}
                setValue={setClubContact}
                checkEnterKey={() => { }}
                disabled={!editable}
            />
            <EmailField
                label="email"
                placeholder="club name"
                value={clubEmail}
                setValue={setClubEmail}
                setEmailValid={setEmailValid}
                checkEnterKey={() => { }}
                emptyOk={true}
                disabled={!editable}
            />
            <button
                className="club-button"
                onClick={buttonHandler}
                disabled={editable && (!emailValid || clubName === '')}
            >
                {editable ? "save" : (isDeleting ? "cancel" : "edit")}
            </button>
            {!editing && (
                <button
                    className="cancel-button"
                    onClick={cancelHandler}
                >
                    {editable ? "cancel" : (isDeleting ? "confirm" : "delete")}
                </button>
            )}
            <TwoSegment
                label="affiliated"
                leftLabel="yes"
                rightLabel="no"
                segmentMinWidth="50px"
                activeSegment={affiliated ? "left" : "right"}
                reportClick={segmentHandler}
                disabled={!editable}
            />
        </div>
    )
}

export default ClubPane;