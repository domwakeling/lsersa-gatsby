import React from "react";

const EmailField = ({ label, placeholder, value, setValue, setEmailValid, checkEnterKey }) => {

    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
        setEmailValid(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(e.target.value));
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
            />
        </label>
    )
}

export default EmailField;