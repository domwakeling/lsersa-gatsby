import React from "react";

const FreeField = ({ label,
    value,
    setValue,
    disabled = false,
    limited = true,
    singleRow = false
}) => {

    const textHandler = (e) => {
        e.preventDefault();
        setValue(limited ? e.target.value.substring(0, 255) : e.target.value);
    }

    return (
        <label>
            {label} {limited && (`${value.length}/255`)}
            <textarea
                value={value}
                onChange={textHandler}
                disabled={disabled}
                className={singleRow ? "single-row" : ""}
            />
        </label>
    )
}

export default FreeField;