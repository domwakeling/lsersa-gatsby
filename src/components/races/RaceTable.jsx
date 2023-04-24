import React from "react";

const RaceElement = ({ item }) => {
    return (
        <>
            <tr>
                <td className="subtitle" colSpan="4"><b>{item.series}</b></td>
            </tr>
            {
                item.races.map((race, idx) => (
                    <tr key={idx}>
                        <td style={{ minWidth: "160px" }}>{race.name}</td>
                        <td style={{ minWidth: "160px" }}>{race.venue}</td>
                        <td style={{ minWidth: "200px" }}>{race.date}</td>
                        { (race.mens === undefined) && (
                            <td colSpan="2" style={{ minWidth: "100px" }}>
                                {race.url ? (
                                    <a className="race-link" href={race.url} target="_offsite">
                                        {race.status}
                                    </a>
                                ) : (
                                    race.status
                                )}
                            </td>
                        )}
                        { (race.mens !== undefined) && (
                            <>
                                <td>
                                    <a className="race-link" href={race.ladies} style={{ marginRight: "1.0rem"}}>
                                        Ladies
                                    </a>
                                    <a className="race-link" href={race.mens}>
                                        Mens
                                    </a>
                                </td>
                            </>
                        )}
                    </tr>
                ))
            }
            {
                item.overall && item.overall.map((overallItem, idx) => (
                    <tr key={idx}>
                        <td colSpan="3">{overallItem.name}</td>
                        <td colSpan="2">
                            <a className="race-link" href={overallItem.url} target="_offsite">
                                Results
                            </a>
                        </td>
                    </tr>
                ))
            }
        </>
    )
}

const RaceTable = ({ data }) => {
    return (
        <table>
            <tbody>
                {
                    data.events.map((item, idx_i) => (
                        <RaceElement key={idx_i} item={item} />
                    ))
                }
            </tbody>
        </table>
    )
}

export default RaceTable;