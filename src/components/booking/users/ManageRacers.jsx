import React, { useState, useEffect } from "react";
import RacerPane from "./RacerPane";

const ManageRacers = ({ racers, setRacers, displayMessage, user }) => {
    const [clubs, setClubs] = useState([]);
    const [addingRacer, setAddingRacer] = useState(false);

    useEffect(() => {
        async function retrieveClubs() {
            const res = await fetch(`/api/admin/clubs`);
            if (res.status === 200) {
                const data = await res.json();
                setClubs(data.clubs);
            } else {
                // likely status 400, but error regardless
                setClubs([])
            }
        }
        retrieveClubs();
    }, []);

    const toggleAddRacer = (e) => {
        e.preventDefault();
        setAddingRacer(!addingRacer);
    }

    const updateRacers = async () => {
        const res = await fetch(`/api/user/racers/${user.id}`);
        if (res.status === 200) {
            const data = await res.json();
            setRacers(data.racers);
            if (data.racers.length === 0) {
                setAddingRacer(true);
            } else {
                setAddingRacer(false);
            }
        }
    }


    return (
        <>
            <button
                className="club-add-button"
                onClick={toggleAddRacer}
                >
                {addingRacer ? "Cancel" : "Add Racer"}
            </button>
            <h3>Racer Management</h3>
            {addingRacer && (
                <>
                    <h4>new racer</h4>
                    <div className="pane-container">
                        <RacerPane
                            racer={{
                                first_name: '',
                                last_name: '',
                                dob: undefined,
                                gender_id: undefined,
                                club_id: undefined,
                                user_text: ''
                            }}
                            newRacerFlag={true}
                            displayMessage={displayMessage}
                            updatePane={updateRacers}
                            clubs={clubs}
                            user={user}
                        />
                    </div>
                    <br />
                </>
            )}
            {!addingRacer && racers.length === 0 && (
                <p>There are currently no racers or racer requests associated with this account.</p>
            )}
            <div className="pane-container">
                {racers.sort((a, b) => a.name < b.name ? -1 : 1).map(racer => (
                    <RacerPane
                        key={racer.id}
                        racer={racer}
                        displayMessage={displayMessage}
                        updatePane={updateRacers}
                        clubs={clubs}
                        user={user}
                    />
                ))}
            </div>
        </>
    )
}

export default ManageRacers;
