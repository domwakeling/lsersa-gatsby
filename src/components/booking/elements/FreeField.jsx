import React from "react";

const FreeField = ({ label, value, setValue, disabled = false }) => {

    const textHandler = (e) => {
        e.preventDefault();
        setValue(e.target.value.substring(0, 255));
    }

    return (
        <label>
            {label} {value.length}/255
            <textarea
                value={value}
                onChange={textHandler}
                disabled={disabled}
            />
        </label>
    )
}

export default FreeField;