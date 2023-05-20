import React from "react";

const TextField = ({ label, placeholder, value, setValue, checkEnterKey, disabled}) => {

    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    return (
        <label>
            {label}
            <input
                type="text"
                onChange={handleChange}
                onKeyDown={checkEnterKey}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
            />
        </label>
    )
}

export default TextField;