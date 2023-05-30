import React, {useState } from "react";
import ManageRacers from "./users/ManageRacers";
import ManageBookings from "./users/ManageBooking";
import TabLabel from "./elements/TabLabel";
import TabPanel from "./elements/TabPanel";
import UserDetail from "./users/UserDetails";
import updateUserDetails from "../../lib/users/updateUser";
import { MESSAGE_CLASSES } from "../../lib/constants";
import { USER_MODES } from "../../lib/modes";

const UserDashboard = ({user, setUser, racers, setRacers, displayMessage}) => {
    const [userMode, setUserMode] = useState(USER_MODES.ADDING_RACER);

    const tabData = [
        {
            text: "bookings",
            mode: USER_MODES.BOOKING
        },
        {
            text: "manage racers",
            mode: USER_MODES.ADDING_RACER
        },
        {
            text: "manage your details",
            mode: USER_MODES.MANAGING_DETAILS
        }
    ];

    const handleUserDetailSubmit = async (newUser) => {
        const result = await updateUserDetails(user, newUser);
        const data = await result.json();
        if (result.status === 200) {
            setUser(data.newUser);
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Details updated");
        } else if (result.status === 409) {
            displayMessage(MESSAGE_CLASSES.ALERT, data.message);
        } else {
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
        }
    }

    return (
        <div>
            <h2>User Dashboard</h2>
            <div className="row">
                <TabPanel>
                    {tabData.map((item, idx) => (
                        <TabLabel
                            key={idx}
                            text={item.text}
                            mode={item.mode}
                            setMode={setUserMode}
                            active={idx === userMode}
                        />
                    ))}
                </TabPanel>
                <br />
                {(userMode === USER_MODES.ADDING_RACER) && (
                    <ManageRacers
                        racers={racers}
                        setRacers={setRacers}
                        displayMessage={displayMessage}
                        user={user}
                    />
                )}
                {(userMode === USER_MODES.MANAGING_DETAILS && (
                    <UserDetail
                        user={user}
                        emptyPasswordOk={true}
                        handleUserDetailSubmit={handleUserDetailSubmit}
                        updating={true}
                    />
                ))}
                {(userMode === USER_MODES.BOOKING) && (
                    <ManageBookings
                        racers={racers}
                        displayMessage={displayMessage}
                        user={user}
                    />
                )}
            </div>
            <br />
        </div>
    )
}

export default UserDashboard;