import React, { useState, useEffect } from "react";
import LoadingSpinner from "../elements/LoadingSpinner";
import AdminRacerListItem from "./AdminRacerListItem";
import { MESSAGE_CLASSES } from "../../../lib/constants";
import { MANAGE_MODES } from "../../../lib/modes";

const AdminManageRacers = ({ displayMessage }) => {
    const [racers, setRacers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState(MANAGE_MODES.LIST);
    const [filteredRacers, setFilteredRacers] = useState([]);
    const [selectedRacerId, setSelectedRacerId] = useState(null);
    const [filterText, setFilterText] = useState('');

    const retrieveAllRacers = async () => {
        const res = await fetch(`/api/admin/racers`);
        if (res.status === 200) {
            const data = await res.json();
            setRacers(data);
            setFilteredRacers(data);
            return true;
        } else {
            // likely status 400, but error regardless
            setRacers([]);
            setFilteredRacers([]);
            return false;
        }
    }

    useEffect(() => {
        async function initialRetrieveRacers() {
            setIsLoading(true);
            const result = await retrieveAllRacers();
            setIsLoading(false);
            if (!result) {
                displayMessage(MESSAGE_CLASSES.WARN, "Unable to retrieve racers");
            }
        }

        initialRetrieveRacers();
    }, [displayMessage])

    const selectRacerCallback = (id) => {
        setSelectedRacerId(id);
        setMode(MANAGE_MODES.DETAIL);
    }

    const handleFilterChange = (e) => {
        e.preventDefault();
        const newFilter = e.target.value;
        setFilterText(newFilter);
        if (newFilter !== '') {
            const reg = new RegExp(newFilter, "i");
            const tempArr = racers.filter(racer => (
                reg.test(racer.email) || reg.test(`${racer.first_name} ${racer.last_name}`)
            ))
            setFilteredRacers(tempArr);
        } else {
            setFilteredRacers(racers);
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
        </>
    )
}

export default AdminManageRacers;