import React from "react";
import TextField from "../elements/TextField";
import EmailField from "../elements/EmailField";

const AdminUserListItem = ({user, setDetailUserId }) => {

    const clickHandler = (e) => {
        e.preventDefault();
        setDetailUserId(user.id);
    }
    return (
        <div className="admin-pane">
            <div className="list-pane-content-holder">
                <TextField
                    label="user name"
                    value={`${user.first_name} ${user.last_name}`}
                    disabled={true}
                />
                <EmailField
                    label="user email"
                    value={user.email}
                    disabled={true}
                />
            </div>
            <button className="edit-button"
                onClick={clickHandler}
            >
                edit
            </button>
        </div>
    )
}

export default AdminUserListItem;