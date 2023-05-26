import React, { useState } from "react";
import TextField from "../elements/TextField";
import { MESSAGE_CLASSES } from "../../../lib/constants";

const UserRequest = ({ user, updateRequests, displayMessage }) => {
    const [adminText, setAdminText] = useState(user.admin_text || '');
    const [deleting, setDeleting] = useState(false);

    const textHandler = (e) => {
        e.preventDefault();
        setAdminText(e.target.value.substring(0,255));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (deleting) {
            // button is acting as "cancel"
            setDeleting(false);
        } else {
            // button is acting as verify
            const body = {
                type: "user",
                id: user.id,
                email: user.email,
                admin_text: adminText
            }
            const res = await fetch(`/api/admin/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status === 200) {
                updateRequests();
                displayMessage(MESSAGE_CLASSES.SUCCESS, "Account confirmed, email has been sent");
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
            // delete the user
            const body = {
                type: "user",
                id: user.id
            }
            const res = await fetch(`/api/admin/requests`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status === 200) {
                updateRequests();
                displayMessage(MESSAGE_CLASSES.SUCCESS, "Account request rejected");
            } else {
                const data = await res.json();
                displayMessage(MESSAGE_CLASSES.WARN, data.message);
            }
        }
    }

    return (
        <div className="admin-pane">
            <TextField label="email" value={user.email} disabled={true} />
            <label>free text (admin only) {adminText.length}/255
                <textarea
                    value={adminText}
                    onChange={textHandler}
                />
            </label>
            <button className="confirm" onClick={submitHandler}>
                {deleting ? "cancel" : "verify"}
            </button>
            <button className="reject" onClick={rejectHandler}>
                {deleting ? "confirm" : "reject"}
            </button>
        </div>
    )
}

export default UserRequest;