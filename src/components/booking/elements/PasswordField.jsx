import React from "react";

const PasswordField = ({ label, value, setValue, checkEnterKey }) => {

    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    return (
        <label>
            {label}
            <input
                type="password"
                onChange={handleChange}
                onKeyDown={checkEnterKey}
                value={value}
                placeholder="password"
            />
        </label>
    )
}

export default PasswordField;