import React, { useState, useEffect } from "react";
import LoadingSpinner from "../elements/LoadingSpinner";
import AdminRacerListItem from "./AdminRacerListItem";
import AdminRacerDetail from "./AdminRacerDetail";
import { MESSAGE_CLASSES } from "../../../lib/constants";
import { MANAGE_MODES } from "../../../lib/modes";

const AdminManageRacers = ({ displayMessage }) => {
    const [racers, setRacers] = useState([]);
    const [userEmails, setUserEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState(MANAGE_MODES.LIST);
    const [filteredRacers, setFilteredRacers] = useState([]);
    const [selectedRacerId, setSelectedRacerId] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [clubs, setClubs] = useState('');

    useEffect(() => {
        async function initialRetrieveRacers() {
            setIsLoading(true);
            const result = await fetch(`/api/admin/racers`);
            if (result.status === 200) {
                const data = await result.json();
                setRacers(data.racers);
                setFilteredRacers(data.racers);
                setUserEmails(data.user_emails);
                setClubs(data.clubs)
            } else {
                // likely status 400, but error regardless
                setRacers([]);
                setFilteredRacers([]);
                setClubs([]);
                displayMessage(MESSAGE_CLASSES.WARN, "Unable to retrieve racers");
            }
            setIsLoading(false);
        }

        initialRetrieveRacers();
    }, [displayMessage])

    const selectRacerCallback = (id) => {
        setSelectedRacerId(id);
        setMode(MANAGE_MODES.DETAIL);
    }

    const refilterRacers = (currentFilter, racerArray = racers) => {
        let tempArr = JSON.parse(JSON.stringify(racerArray));
        if (currentFilter !== '') {
            const reg = new RegExp(currentFilter, "i");
            tempArr = tempArr.filter(racer => (
                reg.test(racer.email) || reg.test(`${racer.first_name} ${racer.last_name}`)
            ))
            setFilteredRacers(tempArr);
        } else {
            setFilteredRacers(tempArr);
        }
    }

    const handleFilterChange = (e) => {
        e.preventDefault();
        const newFilter = e.target.value;
        setFilterText(newFilter);
        refilterRacers(newFilter);
    }

    const handleRacerDetailSubmit = async (update) => {
        // alert if no changes
        if (Object.keys(update.updates).length === 0 && !update.user_id) {
            displayMessage(MESSAGE_CLASSES.ALERT, "Update made no changes")
            return;
        }
        // changes ...
        const res = await fetch(`/api/admin/racers`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update),
        });
        if (res.status === 200) {
            // update the user array in memory (don't want to call it back again)
            const tempArr = JSON.parse(JSON.stringify(racers));  // ensure we have a copy
            const idx = tempArr.map(racer => racer.racer_id).indexOf(update.racer_id);
            const keys = Object.keys(update.updates);
            for (const key of keys) {
                tempArr[idx][key] = update.updates[key];
            }
            if (update.user_id) {
                tempArr[idx].user_id = update.user_id;
                tempArr[idx].email = update.racer_email;
            }
            setRacers(tempArr);
            // run the filter again in case something has changed
            refilterRacers(filterText, tempArr);
            // back to list view
            setMode(MANAGE_MODES.LIST);
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Racer updated");
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
        }
    }

    const handleRacerDetailCancel = () => {
        setMode(MANAGE_MODES.LIST);
        setSelectedRacerId(null);
    }

    const handleRacerDetailDelete = async (id) => {
        const body = { id }
        const res = await fetch(`/api/admin/racers`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            // update the racer array in memory (don't want to call it back again)
            let tempArr = JSON.parse(JSON.stringify(racers));  // ensure we have a copy
            // filter out the racer we've just deleted
            tempArr = tempArr.filter(racer => racer.racer_id !== id);
            setRacers(tempArr);
            // run the filter again in case something has changed
            refilterRacers(filterText, tempArr);
            // back to list view
            setMode(MANAGE_MODES.LIST);
            displayMessage(MESSAGE_CLASSES.SUCCESS, "Racer deleted");
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
        }
    }

    return (
        <>
            <h3>Admin Manage Racers</h3>
            {isLoading && <LoadingSpinner />}
            {mode === MANAGE_MODES.LIST && !isLoading && (
                <>
                    <h4>filter</h4>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        value={filterText}
                        placeholder="search filter"
                        />
                    <br />
                    <div className="pane-container">
                        {filteredRacers.slice(0, 10).map((racer, idx) => (
                            <AdminRacerListItem
                            key={idx}
                            racer={racer}
                            setDetailRacerId={selectRacerCallback}
                            />
                            ))}
                    </div>
                    {filteredRacers.length > 10 && (
                        <p>First 10 results showing, use filters to refine list.</p>
                        )}
                </>
            )}
            {mode === MANAGE_MODES.DETAIL && !isLoading && (
                <AdminRacerDetail
                    racer={racers.filter(racer => racer.racer_id === selectedRacerId)[0]}
                    userEmails={userEmails}
                    clubs={clubs}
                    handleRacerDetailSubmit={handleRacerDetailSubmit}
                    handleRacerDetailCancel={handleRacerDetailCancel}
                    handleRacerDetailDelete={handleRacerDetailDelete}
                />
            )}
        </>
    )
}

export default AdminManageRacers;