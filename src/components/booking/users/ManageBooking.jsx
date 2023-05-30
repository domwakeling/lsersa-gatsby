import React, { useState, useMemo, useEffect } from "react";
import LoadingSpinner from "../elements/LoadingSpinner";
import RacerLozenge from "./RacerLozenge";
import { MONTHS, WEEKDAYS } from "../../../lib/constants";

const ManageBookings = ({ user, racers, displayMessage}) => {
    const [session, setSession] = useState(null);
    const [available, setAvailable] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    const nextSat =  useMemo(() => {
        let t = new Date();
        t.setDate(t.getDate() + (13 - t.getDay()) % 7);
        return t;
    }, []);

    const displayDate = (date) => `${WEEKDAYS[date.getDay()]} ${date.getDay()} ${MONTHS[date.getMonth()]}`

    const systemDate = (date) => date.toISOString().split("T")[0];

    const updateBookings = async () => {
        const res = await fetch(`/api/admin/sessions/${systemDate(nextSat)}`);
        if (res.status === 200) {
            const data = await res.json();
            setSession(data.session);
            setBookings(data.bookings);
            setAvailable(data.session.max_count - data.bookings.length);
            if (data.session.message) {
                setMessage(data.session.message);
            }
        } else if (res.status === 204) {
            setSession(null);
            setBookings([]);
            setAvailable(0);
            setMessage('No booking session available at the moment');
        } else {
            // likely status 400, but error regardless
            setSession(null);
            setBookings([]);
            setAvailable(0);
            setMessage('');
        }
    }

    useEffect(() => {
        async function retrieveSessionInfo() {
            setIsLoading(true);
            const res = await fetch(`/api/admin/sessions/${systemDate(nextSat)}`);
            if (res.status === 200) {
                const data = await res.json();
                setSession(data.session);
                setBookings(data.bookings);
                setAvailable(data.session.max_count - data.bookings.length);
                if (data.session.message) {
                    setMessage(data.session.message);
                }
            } else if (res.status === 204) {
                setSession(null);
                setBookings([]);
                setAvailable(0);
                setMessage('No booking session available at the moment');
            } else {
                // likely status 400, but error regardless
                setSession(null);
                setBookings([]);
                setAvailable(0);
                setMessage('');
            }
            setIsLoading(false);
        }

        retrieveSessionInfo();
    }, [nextSat]);


    return (
        <>
            <h3>Manage Bookings</h3>
            {isLoading && <LoadingSpinner />}
            <h4>{displayDate(nextSat)}</h4>            
            {message !== '' && (
                <div className='advice-box'>
                    <p>{message}</p>
                </div>
            )}
            {session && (
                <>
                    <p><b>Spaces available: {available} / {session.max_count}</b></p>
                    { racers.map((racer, idx) => (
                        <RacerLozenge
                            racer={racer}
                            key={idx}
                            available={available}
                            displayMessage={displayMessage}
                            bookings={bookings}
                            updatePane={updateBookings}
                            date={nextSat}
                        />
                    ))}
                </>
            )}
        </>
    )   
}

export default ManageBookings;