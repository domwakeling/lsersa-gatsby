import React from "react";
import TwoSegment from "./TwoSegment";
import { roles } from "../../../lib/db_refs";

const AdminSelection = ({ roleId, setRoleId, disabled=false }) => {

    const handleClick = (v) => {
        if (v === 'yes') {
            setRoleId(roles.ADMIN);
        } else {
            setRoleId(roles.USER);
        }
    }

    return (
        <TwoSegment
            label="admin"
            leftLabel="yes"
            rightLabel="no"
            segmentMinWidth="50px"
            activeSegment={roleId === roles.ADMIN ? "left" : "right"}
            reportClick={handleClick}
            disabled={disabled}
        />
    )
}

export default AdminSelection;