import React from "react";
import UserDetail from "./UserDetails";
import { USERMODES } from "../../lib/modes";

const UserDashboard = ({user}) => {
    return (
        <>
            <h2>User Dashboard</h2>
            <UserDetail user={user} emptyPasswordOk={true} />
        </>
    )
}

export default UserDashboard;