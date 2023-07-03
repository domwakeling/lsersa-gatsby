import React from "react";
import DownloadItem from "../DownloadItem";

const PolicyElement = ({ item }) => {
    return (
        <>
            <tr>
                <td style={{ paddingRight: "2.0rem" }}>{item.name}</td>
                <td>
                    <DownloadItem
                        filetype="PDF"
                        filename={item.text}
                        file_link={item.url} 
                        mini={true}
                    />
                </td>
            </tr>
        </>
    )
}

const PolicyTable = ({ data }) => {
    return (
        <table>
            <tbody>
                {
                    data.items.map((item, idx_i) => (
                        <PolicyElement key={idx_i} item={item} />
                    ))
                }
            </tbody>
        </table>
    )
}

export default PolicyTable;