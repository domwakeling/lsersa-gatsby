import React from "react";
import { MESSAGE_CLASSES } from "../../../lib/constants";

const RacerLozenge = ({
    racer,
    available,
    displayMessage,
    bookings,
    updatePane,
    date,
    max_count,
    bookingAvailable = true
}) => {

    const matched = bookings.filter(item => item.racer_id === racer.id) 
    const booked = matched.length > 0 ? true : false;
    const paid = booked ? ( matched[0].paid > 0 ) : false;

    let classNames = "racer-lozenge" + (booked ? " booked" : (racer.verified ? " verified" : ""));

    const buttonHandler = async (e) => {
        e.preventDefault();
        if (!booked) {
            const body = {
                user_id: racer.user_id,
                racer_id: racer.id,
                date,
                max_count
            }
            const res = await fetch(`/api/user/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status === 200) {
                displayMessage(MESSAGE_CLASSES.SUCCESS, `Booking added`);
                updatePane();
                return true;
            } else {
                const data = await res.json();
                displayMessage(MESSAGE_CLASSES.WARN, data.message);
                updatePane();
                return false;
            }
        }
    }

    const cancelHandler = async (e) => {
        e.preventDefault();
        if (booked && !paid) {
            const body = {
                user_id: racer.user_id,
                racer_id: racer.id,
                date
            }
            const res = await fetch(`/api/user/bookings`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status === 200) {
                displayMessage(MESSAGE_CLASSES.SUCCESS, `Booking cancelled`);
                updatePane();
                return true;
            } else {
                const data = await res.json();
                displayMessage(MESSAGE_CLASSES.WARN, data.message);
                updatePane();
                return false;
            }
        }
    }

    return (
        <div className={classNames}>
            {(available > 0 && (racer.verified == true) && !booked && bookingAvailable) && (
                <button className="booking-button"
                    onClick={buttonHandler}
                >
                    book
                </button>
            )}
            {(!racer.verified)&& (
                <>
                    <div className="lozenge-container">
                        <div className="lozenge unverified">
                            awaiting review
                        </div>
                    </div>
                </>
            )}
            { booked && (
                <div className="lozenge-container">
                    {paid && (
                        <>
                            <div className="lozenge paid">
                                paid
                            </div>
                            <div className="lozenge booked">booked</div>
                        </>
                    )}
                    {!paid && (
                        <>
                            <div className="lozenge unpaid">
                                to pay
                            </div>
                            {bookingAvailable && (
                                <button className="booking-cancel-button"
                                    onClick={cancelHandler}
                                >
                                    cancel
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
            <div className="racer-name">{racer.first_name} {racer.last_name}</div>
        </div>
    )
}

export default RacerLozenge;
