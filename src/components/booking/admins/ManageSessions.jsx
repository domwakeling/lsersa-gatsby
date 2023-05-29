import React, { useState, useEffect} from "react";
import SessionPane from "./SessionPane";
import LoadingSpinner from "../elements/LoadingSpinner";
import { SESSION_MAX } from "../../../lib/constants";

const ManageSessions = ({ displayMessage }) => {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addingSession, setAddingSession] = useState(false);

    const updateSessions = async () => {
        const res = await fetch(`/api/admin/sessions`);
        if (res.status === 200) {
            const data = await res.json();
            setSessions(data.sessions);
        } else {
            // likely status 400, but error regardless
            setSessions([])
        }
    }

    useEffect(() => {
        async function retrieveSessions() {
            setIsLoading(true);
            const res = await fetch(`/api/admin/sessions`);
            if (res.status === 200) {
                const data = await res.json();
                setSessions(data.sessions);
            } else {
                // likely status 400, but error regardless
                setSessions([])
            }
            setIsLoading(false);
        }

        retrieveSessions();
    }, []);

    const toggleAddSession = (e) => {
        e.preventDefault();
        setAddingSession(!addingSession);
    }

    return (
        <>
            <button
                className="club-add-button"
                onClick={toggleAddSession}
            >
                {addingSession ? "Cancel" : "Add Session"}
            </button>
            <h3>Manage Sessions</h3>
            {isLoading && <LoadingSpinner />}
            {addingSession && (
                <>
                    <h4>new session</h4>
                    <div className="pane-container">
                        <SessionPane
                            session={{
                                date: null,
                                max_count: SESSION_MAX,
                                message: ''
                            }}
                            editing={true}
                            displayMessage={displayMessage}
                            updatePane={updateSessions}
                        />
                    </div>
                    <br />
                </>
            )}
            {!isLoading && (
                <div className="pane-container">
                    {sessions
                        .sort((a, b) => a.date < b.date ? -1 : 1)
                        .map(session => (
                            <SessionPane
                                key={session.date}
                                session={session}
                                displayMessage={displayMessage}
                                updatePane={updateSessions}
                            />
                        ))}
                </div>
            )}
        </>
    )
}

export default ManageSessions;