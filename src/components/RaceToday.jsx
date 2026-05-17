import React from "react";

const RaceToday = ({ raceInfo }) => {

    return (
        <div className="advice-box">
            <h2 className="as-h3">LSERSA Summer Series {raceInfo.name} - {raceInfo.venue}</h2>
            <p>Please see <a href={raceInfo.url} target="_race">SkiResults</a> for live timing.</p>
        </div>
    )

}

export default RaceToday;