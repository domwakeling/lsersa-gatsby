import React, {useState, useEffect} from "react";
import AdminManageRacers from "./admins/AdminManageRacers";
import AdminManageUsers from "./admins/AdminManageUsers";
import AdminSendEmail from "./admins/AdminSendEmail";
import InviteUser from "./admins/InviteUser";
import ManageClubs from "./admins/ManageClubs";
import ManageRacers from "./users/ManageRacers";
import ManageSessions from "./admins/ManageSessions";
import ManageBookings from "./users/ManageBooking";
import ReviewRequests from "./admins/ReviewRequest";
import TabLabel from "./elements/TabLabel";
import TabPanel from "./elements/TabPanel";
import UserDetail from "./users/UserDetails";
import updateUserDetails from "../../lib/users/updateUser";
import { ADMIN_MODES } from "../../lib/modes";
import { MESSAGE_CLASSES, MESSAGE_TIME } from "../../lib/constants";

const AdminDashboard = ({ user, setUser, displayMessage }) => {    
    const [requestsCount, setRequestsCount] = useState(0);
    const [racers, setRacers] = useState([]);
    const [adminMode, setAdminMode] = useState(ADMIN_MODES.MANAGE_OWN_BOOKINGS);

    const tabData = [
        {
            text: "manage own bookings",
            mode: ADMIN_MODES.MANAGE_OWN_BOOKINGS
        },
        {
            text: "manage your racers",
            mode: ADMIN_MODES.MANAGING_OWN_RACERS
        },
        {
            text: "manage your details",
            mode: ADMIN_MODES.MANAGING_OWN_DETAILS
        },
        {
            text: "review requests",
            mode: ADMIN_MODES.REVIEW_REQUESTS
        },
        {
            text: "manage sessions",
            mode: ADMIN_MODES.MANAGE_SESSION
        },
        {
            text: "send email",
            mode: ADMIN_MODES.SEND_EMAIL
        },
        {
            text: "invite user",
            mode: ADMIN_MODES.INVITE_USER
        },
        {
            text: "manage accounts",
            mode: ADMIN_MODES.MANAGE_ACCOUNT
        },
        {
            text: "manage racers",
            mode: ADMIN_MODES.MANAGE_RACERS
        },
        {
            text: "manage clubs",
            mode: ADMIN_MODES.MANAGE_CLUBS
        },
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
        async function prepOnLoad() {
            // requests count
            const res = await fetch("/api/admin/request-counts");
            if (res.status === 200) {
                const data = await res.json();
                setRequestsCount(data.users + data.racers);
            }
            // racers
            const res2 = await fetch(`/api/user/racers/${user.id}`);
            if (res2.status === 200) {
                const data = await res2.json();
                setRacers(data.racers);
            } else {
                // no response; display message and set racers empty
                setRacers([]);
            }
        }
        prepOnLoad();  
    }, [requestsCount, user.id]);

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
                {(adminMode === ADMIN_MODES.MANAGING_OWN_RACERS) && (
                    <ManageRacers
                        racers={racers}
                        setRacers={setRacers}
                        displayMessage={displayMessage}
                        user={user}
                    />
                )}
                {adminMode === ADMIN_MODES.MANAGE_CLUBS && (
                    <ManageClubs displayMessage={displayMessage} />
                )}
                {adminMode === ADMIN_MODES.MANAGE_SESSION && (
                    <ManageSessions displayMessage={displayMessage} />
                )}
                {(adminMode === ADMIN_MODES.MANAGE_OWN_BOOKINGS) && (
                    <ManageBookings
                        racers={racers}
                        displayMessage={displayMessage}
                        user={user}
                    />
                )}
                {(adminMode === ADMIN_MODES.MANAGE_ACCOUNT) && (
                    <AdminManageUsers
                        displayMessage={displayMessage}
                    />
                )}
                {(adminMode === ADMIN_MODES.MANAGE_RACERS) && (
                    <AdminManageRacers
                        displayMessage={displayMessage}
                    />
                )}
                {(adminMode === ADMIN_MODES.SEND_EMAIL) && (
                    <AdminSendEmail displayMessage={displayMessage} />
                )}
            </div>
            <br/>
        </div>
    )
}

export default AdminDashboard;