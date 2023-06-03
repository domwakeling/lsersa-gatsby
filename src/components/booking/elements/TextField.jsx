import React from "react";
import { STYLES } from "../../../lib/constants";

const TextField = ({
    label,
    placeholder,
    value,
    setValue,
    checkEnterKey,
    disabled,
    required = false
}) => {

    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    return (
        <label style={(required && value === '') ? STYLES.redText : {}}>
            {label}{required ? "*" : ""}
            <input
                style={(required && value === '') ? STYLES.redText : {}}
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