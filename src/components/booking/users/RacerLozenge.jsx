import React from "react";
import { MESSAGE_CLASSES } from "../../../lib/constants";

const RacerLozenge = ({ racer, available, displayMessage, bookings, updatePane, date, max_count }) => {

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

    return (
        <>
        <div className={classNames}>
            {(available > 0 && (racer.verified == true) && !booked) && (
                <button className="booking-button"
                    onClick={buttonHandler}
                >
                    {booked ? "booked" : "book"}
                </button>
            )}
            { booked && (
                <div className="lozenge-container">
                    <div className={paid ? "lozenge paid" : "lozenge unpaid"}>
                        {paid ? "paid" : "to pay"}
                    </div>
                    <div className="lozenge booked">booked</div>
                </div>
            )}
            <div className="racer-name">{racer.first_name} {racer.last_name}</div>
        </div>
        {/* {JSON.stringify(racer)} */}
        </>
    )
}

export default RacerLozenge;