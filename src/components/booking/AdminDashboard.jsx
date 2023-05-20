import React, {useState, useEffect} from "react";
import { ADMINMODES } from "../../lib/modes";
import TabPanel from "./elements/TabPanel";
import TabLabel from "./elements/TabLabel";
import ReviewRequests from "./admins/ReviewRequest";
import InviteUser from "./admins/InviteUser";

const AdminDashboard = ({ user }) => {    
    const [requestsCount, setRequestsCount] = useState(0);
    const [adminMode, setAdminMode] = useState(ADMINMODES.REVIEW_REQUESTS);

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
            text: "choice six",
            mode: 5
        },
        {
            text: "choice seven",
            mode: 6
        }
    ]

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
                            setAdminMode={setAdminMode}
                            active={idx === adminMode}
                        />
                    ))}
                </TabPanel>
                <br/>
                {adminMode === ADMINMODES.REVIEW_REQUESTS && (
                    <ReviewRequests count={requestsCount} setCount={setRequestsCount} />
                )}
                {adminMode === ADMINMODES.INVITE_USER && (
                    <InviteUser />
                )}
            </div>
            <br/>
            <hr/>
            <p>Needs to be able to:</p>
            <ul>
                <li><b>ensure that only admin can hit the API endpoints ...</b></li>
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