import React, { useState } from "react";
import DateField from "../elements/DateField";
import FreeField from "../elements/FreeField";
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import parseISO from 'date-fns/parseISO';
import TextField from "../elements/TextField";
import { json2csv } from "../../../lib/json2csv";
import { MESSAGE_CLASSES, SESSION_MAX } from "../../../lib/constants";
import { safeDateConversion } from "../../../lib/date-handler";

const SessionPane = ({ session, editing=false, displayMessage, updatePane }) => {
    const [date, setDate] = useState(session.date ? parseISO(session.date + "Z") : null);
    const [message, setMessage] = useState(session.message || '');
    const [maxCount, setMaxCount] = useState((!session.max_count && session.max_count !== 0) ? SESSION_MAX : session.max_count);
    const [editable, setEditable] = useState(editing);
    const [isDeleting, setIsDeleting] = useState(false);

    const newSession = async () => {
        const body = {
            date,
            message,
            max_count: maxCount
        }
        const res = await fetch(`/api/admin/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Session added");
            updatePane();
            return true;
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
            return false;
        }
    }

    const updateSession = async () => {
        const newDateStr = safeDateConversion(date);
        if ((newDateStr !== session.date) && (parseInt(session['count(racer_id)']) > 0)) {
            displayMessage(MESSAGE_CLASSES.WARN, "Can't change date of a session once bookings have started");
            return false;
        }
        if (maxCount < parseInt(session['count(racer_id)'])) {
            displayMessage(MESSAGE_CLASSES.WARN, "Racer limit can't be less than current bookings");
            return false;
        }
        const body = {
            old_date: session.date,
            date,
            message,
            max_count: maxCount
        }
        const res = await fetch(`/api/admin/sessions`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Session updated");
            return true;
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
            return false;
        }
    }

    const deleteSession = async () => {
        const body = { date }
        
        const res = await fetch(`/api/admin/sessions`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Session deleted");
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
            // saving a new session
            const result = await newSession();
            if (result) {
                setDate(null);
                setMaxCount(SESSION_MAX);
                setMessage('');
            }
        } else if (isDeleting) {
            // cancelling a delete request
            setIsDeleting(false);
        } else if (!editable) {
            // editing an existing session
            setEditable(true);
        } else {
            // saving an existing session
            const result = await updateSession();
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
            setDate(session.date ? parseISO(session.date + "Z") : null);
            setMaxCount(session.max_count || SESSION_MAX);
            setMessage(session.message || '');
        } else if (!isDeleting) {
            // not editable, not deleting => have pressed delete, change to confirm
            setIsDeleting(true);
        } else {
            // this was the confirm button
            const result = await deleteSession();
            if (result) {
                setIsDeleting(false);
            }
            updatePane();
        }
    }

    const today = new Date();
    const daysBetween = differenceInCalendarDays(today, date);
    const classNames = "admin-pane" + (daysBetween > 28 ? " old" : "");

    const downloadHandler = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/admin/bookings/${session.date}`);
        const data = await res.json();
        if (res.status === 200) {
            // data into csv
            const csv = json2csv(data);
            // create blob
            const blob = new Blob([csv], { type: 'text/csv' });
            // create object for downloading url
            const url = window.URL.createObjectURL(blob)
            // create a virtual anchor tag
            const a = document.createElement('a')
            // pass the url to virtual anchor
            a.setAttribute('href', url)
            // set the attributes and virtually click
            a.setAttribute('download', `${session.date}-bookings.csv`);
            a.click();
            // confirm to user
            displayMessage(MESSAGE_CLASSES.SUCCESS, 'Downloaded')
        } else {
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
        }
    }

    return (
        <div className={classNames}>
            <br/>
            <div className='session-date'>
                <DateField
                    label="date"
                    value={date}
                    setValue={setDate}
                    disabled={!editable}
                    required={true}
                />
            </div>
            <div className="racer-limit">
                <TextField 
                    label="racer limit"
                    placeholder="racer limit"
                    value={maxCount}
                    setValue={setMaxCount}
                    checkEnterKey={() => { }}
                    disabled={!editable}
                    required={true}
                />
            </div>
            {!editing ? (
                <p>{session['count(racer_id)']} racers entered</p>
            ) : (
                <div style={{ display: "block", height: "2.0rem"}} />
            )}
            
            <FreeField
                label="message (displayed)"
                value={message}
                setValue={setMessage}
                checkEnterKey={() => { }}
                disabled={!editable}
            />
            <button
                className="club-button"
                onClick={buttonHandler}
                disabled={editable && (date ==='' || !date || !maxCount)}
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
            {(!editable && session['count(racer_id)'] > 0 ) && (
                <button
                    className="club-button download-button"
                    onClick={downloadHandler}
                >
                    download entries
                </button>
            )}
        </div>
    )
}

export default SessionPane;