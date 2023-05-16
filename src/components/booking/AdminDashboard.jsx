import React from "react";
import { ADMINMODES } from "../../lib/modes";

const AdminDashboard = ({ user }) => {
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Needs to be able to:</p>
            <ul>
                <li>invite someone to create an account by sending an email</li>
                <li>make edits on someone else's account - contact details, email address etc</li>
                <li>edit name, club and age for individual racers</li>
                <li>Link an existing racer to a new parent account</li>
                <li>turn off bookings for future weeks and specify why</li>
                <li>change the number of racers that will be accepted on a sesssion</li>
                <li>post a message about a session (which may be why it's cancelled!)</li>
            </ul>
        </div>
    )
}

export default AdminDashboard;