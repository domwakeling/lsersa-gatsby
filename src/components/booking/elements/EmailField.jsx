import React from "react";
import { STYLES } from "../../../lib/constants";

const EmailField = ({
    label,
    placeholder,
    value,
    setValue,
    emailValid,
    setEmailValid,
    checkEnterKey,
    emptyOk = false,
    disabled = false,
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
        <label style={((!emptyOk && value === '') || !emailValid) ? STYLES.redText : {}}>
            {label}{!emptyOk ? "*" : ""}
            <input
                style={((!emptyOk && value === '') || !emailValid) ? STYLES.redText : {}}
                type="email"
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