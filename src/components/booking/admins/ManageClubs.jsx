import React, { useState, useEffect } from "react";
import ClubPane from "./ClubPane";
import LoadingSpinner from "../elements/LoadingSpinner";

const ManageClubs = ({ displayMessage}) => {
    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addingClub, setAddingClub] = useState(false);
    const [clubsFilter, setClubsFilter] = useState('');
    const [filterRegex, setFilterRegex] = useState(null);

    const updateClubs = async () => {
        const res = await fetch(`/api/admin/clubs`);
        if (res.status === 200) {
            const data = await res.json();
            setClubs(data.clubs);
            setAddingClub(false);
        } else {
            // likely status 400, but error regardless
            setClubs([]);
            setAddingClub(false);
        }
    }

    useEffect(() => {
        async function retrieveClubs() {
            setIsLoading(true);
            const res = await fetch(`/api/admin/clubs`);
            if (res.status === 200) {
                const data = await res.json();
                setClubs(data.clubs);
            } else {
                // likely status 400, but error regardless
                setClubs([])
            }
            setIsLoading(false);
        }

        retrieveClubs();
    }, [])

    const toggleAddClub = (e) => {
        e.preventDefault();
        setAddingClub(!addingClub);
    }

    const handleFilterChange = (e) => {
        e.preventDefault();
        const newFilter = e.target.value;
        setClubsFilter(newFilter);
        if (newFilter !== '') {
            setFilterRegex(new RegExp(newFilter, "i"));
        } else {
            setFilterRegex(null);
        }
    }

    return (
        <>
            <button
                className="club-add-button"
                onClick={toggleAddClub}
            >
                { addingClub ? "Cancel" : "Add Club"}
            </button>
            <h3>Manage Clubs</h3>
            {isLoading && <LoadingSpinner />}
            {addingClub && (
                <>
                    <h4>new club</h4>
                    <div className="pane-container">
                        <ClubPane
                            club={{
                                name: '',
                                contact_name: '',
                                contact_email: '',
                                affiliated: false
                            }}
                            editing={true}
                            displayMessage={displayMessage}
                            updatePane={updateClubs}
                        />
                    </div>
                    <br/>
                </>
            )}
            {!isLoading && (
                <>
                <h4>filter</h4>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        value={clubsFilter}
                        placeholder="filter clubs"
                    />
                    <br/>   
                </>
            )}
            {!isLoading && (
                <div className="pane-container">
                    {clubs
                        .filter(a => filterRegex === null ? true : filterRegex.test(a.name))
                        .sort((a,b) => a.name < b.name? -1 : 1).map(club => (
                        <ClubPane
                            key={club.id}
                            club={club}
                            displayMessage={displayMessage}
                            updatePane={updateClubs}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export default ManageClubs;