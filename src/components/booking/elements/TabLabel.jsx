import React from "react";

const TabLabel = ({ text, setAdminMode, mode, active }) => {

    const clickHandler = (e) => {
        e.preventDefault();
        setAdminMode(mode);
    }

    const classNames = active ? "tab-button active" : "tab-button"

    return (
        <td style={{ padding: "0" }}>
            <button
                className={classNames}
                onClick={clickHandler}
            >
                {text}
            </button>
        </td>
    )

}

export default TabLabel;