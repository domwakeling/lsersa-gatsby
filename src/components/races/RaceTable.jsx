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
                        <td style={{ minWidth: "100px" }}>
                            {race.url ? (
                                <a href={race.url} target="_offsite">{race.status}</a>
                            ) : (
                                race.status
                            )}
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