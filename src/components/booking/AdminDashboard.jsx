import React, {useState, useEffect} from "react";
import updateUserDetails from "../../lib/users/updateUser";
import InviteUser from "./admins/InviteUser";
import ReviewRequests from "./admins/ReviewRequest";
import TabLabel from "./elements/TabLabel";
import TabPanel from "./elements/TabPanel";
import UserDetail from "./UserDetails";
import { ADMINMODES } from "../../lib/modes";
import { MESSAGE_CLASSES, MESSAGE_TIME } from "../../lib/constants";
import ManageClubs from "./admins/ManageClubs";

const AdminDashboard = ({ user, setUser }) => {    
    const [requestsCount, setRequestsCount] = useState(0);
    const [adminMode, setAdminMode] = useState(ADMINMODES.REVIEW_REQUESTS);
    const [message, setMessage] = useState('');
    const [messageClass, setMessageClass] = useState('');

    const tabData = [
        {
            text: "review requests",
            mode: ADMINMODES.REVIEW_REQUESTS
        },
        {
            text: "invite user",
            mode: ADMINMODES.INVITE_USER
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
            mode: ADMINMODES.MANAGE_CLUBS
        },
        {
            text: "manage your details",
            mode: ADMINMODES.MANAGING_OWN_DETAILS
        }
    ];

    const displayMessage = (messageType, messageText, messageTime) => {
        setMessageClass(messageType)
        setMessage(messageText);
        setTimeout(() => {
            setMessage('');
        }, messageTime);
    }

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
            const res = await fetch("/api/admin/requestcounts");
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
                {adminMode === ADMINMODES.REVIEW_REQUESTS && (
                    <ReviewRequests setCount={setRequestsCount} />
                )}
                {adminMode === ADMINMODES.INVITE_USER && (
                    <InviteUser />
                )}
                {adminMode === ADMINMODES.MANAGING_OWN_DETAILS && (
                    <UserDetail
                        user={user}
                        emptyPasswordOk={true}
                        handleUserDetailSubmit={handleUserDetailSubmit}
                        updating={true}
                    />
                )}
                {adminMode === ADMINMODES.MANAGE_CLUBS && (
                    <ManageClubs />
                )}
            </div>
            {message && message !== '' && (
                <div className={messageClass}>
                    <p>{message}</p>
                </div>
            )}
            <br/>
            <hr/>
            <p>Needs to be able to:</p>
            <ul>
                <li><b>ensure that only admin can hit the API endpoints ...</b></li>
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