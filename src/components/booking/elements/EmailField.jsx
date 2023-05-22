import React from "react";

const EmailField = ({
    label,
    placeholder,
    value,
    setValue,
    setEmailValid,
    checkEnterKey,
    emptyOk=false,
    disabled=false
}) => {

    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
        const valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(e.target.value)
        if (!emptyOk) {
            setEmailValid(valid);
        } else {
            setEmailValid(e.target.value === '' || valid);
        }
        
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

export default EmailField;