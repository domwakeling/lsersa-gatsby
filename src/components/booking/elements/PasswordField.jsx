import React from "react";
import { STYLES } from "../../../lib/constants";

const PasswordField = ({ label, value, setValue, checkEnterKey, required = false }) => {

    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    return (
        <label style={(required && value === '') ? STYLES.redText : {}}>
            {label}{required ? "*" : ""}
            <input
                style={(required && value === '') ? STYLES.redText : {}}
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