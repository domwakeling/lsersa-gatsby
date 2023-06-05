import React, { useState, useMemo, useEffect } from "react";
import LoadingSpinner from "../elements/LoadingSpinner";
import RacerLozenge from "./RacerLozenge";
import { MONTHS, WEEKDAYS } from "../../../lib/constants";
import addDays from 'date-fns/addDays';

const ManageBookings = ({ user, racers, displayMessage}) => {
    const [session, setSession] = useState(null);
    const [available, setAvailable] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isWaiting, setIsWaiting] = useState(false);
    const [message, setMessage] = useState('');

    const nextSat =  useMemo(() => {
        let t = new Date();
        t.setUTCHours(0, 0, 0, 0);
        t = addDays(t, (13 - t.getUTCDay()) % 7);
        return t;
    }, []);

    const nextThurs = addDays(nextSat, -2);
    const now = new Date();

    const displayDate = (date) => `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`

    const systemDate = (date) => date.toISOString().split("T")[0];

    const userRacerIds = racers.map(racer => racer.id);
    const userBookings = bookings.filter(booking => userRacerIds.indexOf(booking.racer_id) >= 0);
    const userUnpaid = userBookings.filter(booking => !booking.paid);

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

    const clickHandler = () => {
        document.forms["payment-form"].submit();
        setIsWaiting(true);
    }

    return (
        <>
            {(userUnpaid.length > 0 && !isWaiting) && (
                <div className="advice-box">
                    <p>Whilst in testing mode, use credit card number 4242 4242 4242 4242 at the
                        payment screen (with any future date and any CVC) to make a fake payment. IF
                        YOU ENTER REAL CARD DETAILS YOU <b>WILL</b> BE CHARGED</p>
                </div>
            )}
            <h3>Manage Bookings</h3>
            {isLoading && <LoadingSpinner />}
            {(userUnpaid.length > 0 && !isWaiting) && (
                <form id="payment-form" method="post" action="/api/stripe/create-checkout-session">
                    <input name="id" type="hidden" readOnly value={user.id} />
                    <input name="date" type="hidden" readOnly value={nextSat.toISOString()} />
                    <button
                        onClick={clickHandler}
                        className="club-add-button"
                    >
                        Pay for booked sessions
                    </button>
                </form>
            )}
            {isWaiting && (
                <div style={{ float: "right"}} >
                    <LoadingSpinner />
                </div>
            )}
            <h4>{displayDate(nextSat)}</h4>
            {(message !== '' || userUnpaid.length > 0 || (now > nextThurs) ) && (
                <div className='advice-box'>
                    {message !== '' && (
                        <p>{message}</p>
                    )}
                    {userUnpaid.length > 0 && (
                        <p>Please note: once paid for, a booking cannot be cancelled and refunds
                            cannot be given.</p>
                    )}
                    {(now > nextThurs && session && session.max_count > 0) && (
                        <p>Booking is now closed. Please ensure that any unpaid bookings are
                            completed as soon as possible.</p>
                    )}
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
                            max_count={session.max_count}
                            bookingAvailable={now < nextThurs}
                        />
                    ))}
                    {(racers.length === 0) && (
                        <div className="advice-box">
                            <p>There are no racers on your account at present. Please add
                                racers on the <b>"manage racers"</b> tab.</p>
                        </div>
                    )}
                </>
            )}
        </>
    )   
}

export default ManageBookings;