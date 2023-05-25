import React from "react";
import DownloadItem from "../DownloadItem";

const MeetingElement = ({ item }) => {
    return (
        <>
            <tr>
                <td style={{ paddingRight: "2.0rem" }}>{item.name}</td>
                <td style={{ paddingRight: "2.0rem", minWidth: "100px" }}>{item.venue}</td>
                <td style={{ paddingRight: "2.0rem" }}>{item.date}</td>
                <td>
                    {item.docs !== null ? (
                        item.docs.map((doc, idx_d) => (
                            <DownloadItem
                                filetype="PDF"
                                filename={doc.text}
                                file_link={doc.url}
                                key={idx_d}
                                mini={true}
                            />
                        ))
                    ) : '' }
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