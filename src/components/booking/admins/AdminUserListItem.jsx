import React from "react";
import TextField from "../elements/TextField";
import EmailField from "../elements/EmailField";

const AdminUserListItem = ({user, setDetailUserId }) => {

    const clickHandler = (e) => {
        e.preventDefault();
        setDetailUserId(user.id);
    }

    let nameStr = '' + (user.first_name ? user.first_name : '');
    nameStr = nameStr + (user.first_name && user.last_name ? ' ' : '');
    nameStr = nameStr + (user.last_name ? user.last_name : '');

    return (
        <div className="admin-pane">
            <div className="list-pane-content-holder">
                <TextField
                    label="user name"
                    value={nameStr}
                    disabled={true}
                    required={true}
                />
                <EmailField
                    label="user email"
                    value={user.email}
                    emailValid={true}
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