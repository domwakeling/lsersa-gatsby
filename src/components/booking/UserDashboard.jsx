import React, {useState } from "react";
import UserDetail from "./UserDetails";
import TabPanel from "./elements/TabPanel";
import TabLabel from "./elements/TabLabel";
import updateUserDetails from "../../lib/users/updateUser";
import { USER_MODES } from "../../lib/modes";
import { MESSAGE_CLASSES, MESSAGE_TIME } from "../../lib/constants";

const UserDashboard = ({user, setUser}) => {
    const [userMode, setUserMode] = useState(USER_MODES.ADDING_RACER);
    const [message, setMessage] = useState('');
    const [messageClass, setMessageClass] = useState('');

    const tabData = [
        {
            text: "bookings",
            mode: USER_MODES.BOOKING
        },
        {
            text: "add racer",
            mode: USER_MODES.ADDING_RACER
        },
        {
            text: "manage your details",
            mode: USER_MODES.MANAGING_DETAILS
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
                {(userMode === USER_MODES.MANAGING_DETAILS && (
                    <UserDetail
                        user={user}
                        emptyPasswordOk={true}
                        handleUserDetailSubmit={handleUserDetailSubmit}
                        updating={true}
                    />
                ))}
            </div>
            {message && message !== '' && (
                <div className={messageClass}>
                    <p>{message}</p>
                </div>
            )}
            <br />
            <hr />
            <p>Needs to be able to:</p>
            <ul>
                <li>Request add racer (and change?)</li>
                <li>make bookings</li>
            </ul>
        </div>
    )
}

export default UserDashboard;