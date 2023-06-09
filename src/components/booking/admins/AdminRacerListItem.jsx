import React from "react";
import TextField from "../elements/TextField";
import EmailField from "../elements/EmailField";

const AdminRacerListItem = ({ racer, setDetailRacerId }) => {

    const clickHandler = (e) => {
        e.preventDefault();
        setDetailRacerId(racer.racer_id);
    }

    let nameStr = '' + ( racer.first_name ? racer.first_name : '' );
    nameStr = nameStr + (racer.first_name && racer.last_name ? ' ' : '');
    nameStr = nameStr + (racer.last_name ? racer.last_name : '');

    return (
        <div className="admin-pane">
            <div className="list-pane-content-holder">
                <TextField
                    label="racer name"
                    value={nameStr}
                    disabled={true}
                    required={true}
                />
                <EmailField
                    label="user's email"
                    value={racer.email}
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

export default AdminRacerListItem;