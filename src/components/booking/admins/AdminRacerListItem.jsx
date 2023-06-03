import React from "react";
import TextField from "../elements/TextField";
import EmailField from "../elements/EmailField";

const AdminRacerListItem = ({ racer, setDetailRacerId }) => {

    const clickHandler = (e) => {
        e.preventDefault();
        setDetailRacerId(racer.racer_id);
    }
    return (
        <div className="admin-pane">
            <div className="list-pane-content-holder">
                <TextField
                    label="racer name"
                    value={`${racer.first_name} ${racer.last_name}`}
                    disabled={true}
                />
                <EmailField
                    label="user's email"
                    value={racer.email}
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