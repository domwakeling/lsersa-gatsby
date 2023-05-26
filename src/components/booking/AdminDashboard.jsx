import React, {useState, useEffect} from "react";
import updateUserDetails from "../../lib/users/updateUser";
import InviteUser from "./admins/InviteUser";
import ReviewRequests from "./admins/ReviewRequest";
import TabLabel from "./elements/TabLabel";
import TabPanel from "./elements/TabPanel";
import UserDetail from "./UserDetails";
import { ADMIN_MODES } from "../../lib/modes";
import { MESSAGE_CLASSES, MESSAGE_TIME } from "../../lib/constants";
import ManageClubs from "./admins/ManageClubs";

const AdminDashboard = ({ user, setUser, displayMessage }) => {    
    const [requestsCount, setRequestsCount] = useState(0);
    const [adminMode, setAdminMode] = useState(ADMIN_MODES.REVIEW_REQUESTS);

    const tabData = [
        {
            text: "review requests",
            mode: ADMIN_MODES.REVIEW_REQUESTS
        },
        {
            text: "invite user",
            mode: ADMIN_MODES.INVITE_USER
        },
        {
            text: "choice three",
            mode: 2
        },
        {
            text: "choice four",
            mode: 3
        },
        {
            text: "choice five",
            mode: 4
        },
        {
            text: "manage clubs",
            mode: ADMIN_MODES.MANAGE_CLUBS
        },
        {
            text: "manage your details",
            mode: ADMIN_MODES.MANAGING_OWN_DETAILS
        }
    ];

    const handleUserDetailSubmit = async (newUser) => {
        const result = await updateUserDetails(user, newUser);
        const data = await result.json();
        if (result.status === 200) {
            setUser(data.newUser);
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Details updated", MESSAGE_TIME);
        } else if (result.status === 409) {
            displayMessage(MESSAGE_CLASSES.ALERT, data.message, MESSAGE_TIME);
        } else {
            displayMessage(MESSAGE_CLASSES.WARN, data.message, MESSAGE_TIME);
        }
    }

    useEffect(() => {
        async function checkForRequests() {
            const res = await fetch("/api/admin/request-counts");
            if (res.status === 200) {
                const data = await res.json();
                setRequestsCount(data.users + data.racers);
            }
        }
        checkForRequests();  
    }, [requestsCount]);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {requestsCount > 0 && (
                <>
                    <div className="advice-box">
                        <p>There are activation requests awaiting review.</p>
                    </div>
                    <br/>
                </>
            )}

            <div className="row">
                <TabPanel>
                    {tabData.map((item, idx) => (
                        <TabLabel
                            key={idx}
                            text={item.text}
                            mode={item.mode}
                            setMode={setAdminMode}
                            active={idx === adminMode}
                        />
                    ))}
                </TabPanel>
                <br/>
                {adminMode === ADMIN_MODES.REVIEW_REQUESTS && (
                    <ReviewRequests setCount={setRequestsCount} displayMessage={displayMessage} />
                )}
                {adminMode === ADMIN_MODES.INVITE_USER && (
                    <InviteUser displayMessage={displayMessage} />
                )}
                {adminMode === ADMIN_MODES.MANAGING_OWN_DETAILS && (
                    <UserDetail
                        user={user}
                        emptyPasswordOk={true}
                        handleUserDetailSubmit={handleUserDetailSubmit}
                        updating={true}
                        displayMessage={displayMessage}
                    />
                )}
                {adminMode === ADMIN_MODES.MANAGE_CLUBS && (
                    <ManageClubs displayMessage={displayMessage} />
                )}
            </div>
            <br/>
            <hr/>
            <p>Needs to be able to:</p>
            <ul>
                <li><b>ensure that only admin can hit the API endpoints ...</b></li>
                <li>make edits on someone else's account - contact details, email address etc</li>
                <li>edit name, club and age for individual racers</li>
                <li>Link an existing racer to a new parent account</li>
                <li>turn off bookings for future weeks and specify why</li>
                <li>change the number of racers that will be accepted on a session</li>
                <li>post a message about a session (which may be why it's cancelled!)</li>
            </ul>
        </div>
    )
}

export default AdminDashboard;