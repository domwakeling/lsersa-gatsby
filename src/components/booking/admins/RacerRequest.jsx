import React, { useState } from "react";
import TextField from "../elements/TextField";
import FreeField from "../elements/FreeField";
import { MESSAGE_CLASSES } from "../../../lib/constants";
import GenderSelection from "../elements/GenderSelection";
import ClubSelection from "../elements/ClubSelection";
import TwoSegment from "../elements/TwoSegment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import parseISO from 'date-fns/parseISO';

const RacerRequest = ({ racer, updateRequests, displayMessage, clubs }) => {
    const [adminText, setAdminText] = useState(racer.admin_text || '');
    const [clubId, setClubId] = useState(racer.club_id || undefined);
    const [deleting, setDeleting] = useState(false);
    const [concession, setConcession] = useState(racer.concession || false);
    const [clubExpiry, setClubExpiry] = useState(racer.club_expiry ? parseISO(racer.club_expiry) : null);

    const segmentHandler = (label) => {
        setConcession(label === "yes" ? true : false);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (deleting) {
            // button is acting as "cancel"
            setDeleting(false);
        } else {
            // button is acting as verify
            const body = {
                type: "racer",
                id: racer.id,
                club_expiry: clubExpiry || null,
                concession,
                club_id: clubId || null,
                admin_text: adminText || ''
            }
            const res = await fetch(`/api/admin/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status === 200) {
                updateRequests();
                displayMessage(MESSAGE_CLASSES.SUCCESS, "Racer verified");
            } else {
                const data = await res.json();
                displayMessage(MESSAGE_CLASSES.WARN, data.message);
            }
        }
    }

    const rejectHandler = async (e) => {
        e.preventDefault();
        if (!deleting) {
            setDeleting(true);
        } else {
            // delete the racer
            const body = {
                type: "racer",
                id: racer.id
            }
            const res = await fetch(`/api/admin/requests`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status === 200) {
                updateRequests();
                displayMessage(MESSAGE_CLASSES.SUCCESS, "Racer request rejected");
            } else {
                const data = await res.json();
                displayMessage(MESSAGE_CLASSES.WARN, data.message);
            }
        }
    }

    const displayDOB = (s) => {
        if (s === null || s === undefined || s === '') return '';
        const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
        return `${m[3]}/${m[2]}/${m[1]}`;
    }

    return (
        <div className="admin-pane">
            <TextField
                label="name"
                placeholder="name"
                value={`${racer.first_name} ${racer.last_name}`}
                setValue={() => { }}
                checkEnterKey={() => { }}
                disabled={true}
            />
            <TextField
                label="date of birth"
                value={displayDOB(racer.dob)}
                setValue={() => { }}
                checkEnterKey={() => { }}
                disabled={true}
            />
            <GenderSelection
                genderId={racer.gender_id}
                setGenderId={() => {}}
                disabled={true}
            />
            <ClubSelection
                clubId={clubId}
                setClubId={setClubId}
                clubs={clubs}
            />
            <div className='date-selection'>
                <label>
                    renewal date
                    <DatePicker
                        selected={clubExpiry}
                        onChange={(date) => setClubExpiry(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText='dd/mm/yyyy'
                    />
                </label>
            </div>
            {racer.user_text && racer.user_text !== '' && (
                <FreeField
                    label="user text"
                    value={racer.user_text}
                    setValue={() => { }}
                    checkEnterKey={() => { }}
                    disabled={true}
                />
            )}
            <TwoSegment
                label="concession rate"
                leftLabel="yes"
                rightLabel="no"
                segmentMinWidth="50px"
                activeSegment={concession ? "left" : "right"}
                reportClick={segmentHandler}
            />
            <FreeField
                label="free text (admin only)"
                value={adminText}
                setValue={setAdminText}
                checkEnterKey={() => { }}
            />
            <button className="confirm" onClick={submitHandler}>
                {deleting ? "cancel" : "verify"}
            </button>
            <button className="reject" onClick={rejectHandler}>
                {deleting ? "confirm" : "reject"}
            </button>
        </div>
    )
}

export default RacerRequest;