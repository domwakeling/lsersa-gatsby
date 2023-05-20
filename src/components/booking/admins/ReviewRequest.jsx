import React, {useState, useEffect} from "react";
import LoadingSpinner from "../elements/LoadingSpinner";
import UserRequest from "./UserRequest";

const ReviewRequests = ({ count, setCount }) => {
    const [users, setUsers] = useState([]);
    const [racers, setRacers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const updateRequests = async () => {
        const res = await fetch(`/api/admin/requests`);
        if (res.status === 200) {
            const data = await res.json();
            setUsers(data.users);
            setRacers(data.racers);
            setCount(data.users.length + data.racers.length);
        } else {
            // likely status 400, but error regardless
            setUsers([]);
            setRacers([]);
        }
    }

    useEffect(() => {
        async function retrieveRequests () {
            setIsLoading(true);
            const res = await fetch(`/api/admin/requests`);
            if (res.status === 200) {
                const data = await res.json();
                setUsers(data.users);
                setRacers(data.racers);
            } else {
                // likely status 400, but error regardless
                setUsers([]);
                setRacers([]);
            }
            setIsLoading(false);
        }
        retrieveRequests();
    }, [])

    return (
        <>
            <h3>Review Requests</h3>

            <h4>Users</h4>
            {isLoading && (
                <LoadingSpinner />
            )}
            {!isLoading && users.length === 0 && (
                <p>No user account requests.</p>
            )}
            {!isLoading && users.length > 0 && (
                <div className="pane-container">
                    {users.map((user, idx) => (
                        <UserRequest user={user} key={idx} updateRequests={updateRequests} />
                    ))}
                </div>
            )}

            <h4>Racers</h4>
            {isLoading && (
                <LoadingSpinner />
            )}
            {!isLoading && (racers.length === 0) && (
                <p>No racer acceptance requests.</p>
            )}
        </>
    )
}

export default ReviewRequests;