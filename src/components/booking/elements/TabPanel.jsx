import React from "react";

const TabPanel = ({children}) => {
    return (
        <div style={{
            overflowX: "auto",
            overflowY: "hidden",
            display: "block",
            width: "100%",
            borderBottom: "1px solid #172a95"
        }}>
            <table>
                <tbody>
                    <tr style={{ border: "0px" }}>
                        {children}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TabPanel;