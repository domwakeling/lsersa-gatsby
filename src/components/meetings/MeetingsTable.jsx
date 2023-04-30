import React from "react";

const MeetingElement = ({ item }) => {
    return (
        <>
            <tr>
                <td>
                    {item.name}
                </td>
            </tr>
        </>
    )
}

const MeetingsTable = ({ data }) => {
    return (
        <table>
            <tbody>
                {
                    data.items.map((item, idx_i) => (
                        <MeetingElement key={idx_i} item={item} />
                    ))
                }
            </tbody>
        </table>
    )
}

export default MeetingsTable;