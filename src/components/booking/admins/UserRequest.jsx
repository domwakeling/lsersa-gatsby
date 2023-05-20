import React, { useState } from "react";
import TextField from "../elements/TextField";

const UserRequest = ({ user, updateRequests }) => {
    const [freetext, setFreetext] = useState(user.freetext || '');
    const [deleting, setDeleting] = useState(false);

    const textHandler = (e) => {
        e.preventDefault();
        setFreetext(e.target.value.substring(0,255));
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
                freetext
            }
            const res = await fetch(`/api/admin/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status === 200) {
                updateRequests();
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
            }
        }
    }

    return (
        <div className="admin-pane">
            <TextField label="email" value={user.email} disabled={true} />
            <label>freetext (admin only) {freetext.length}/255
                <textarea
                    value={freetext}
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