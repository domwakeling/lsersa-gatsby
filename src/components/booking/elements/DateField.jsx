import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import addMinutes from 'date-fns/addMinutes';
import { STYLES } from "../../../lib/constants";

const DateField = ({label, value, setValue, disabled = false, required = false}) => {

    const handleDateChange = (newDate) => {
        if (!value) {
            setValue(addMinutes(newDate, -1 * newDate.getTimezoneOffset()));
        } else {
            setValue(newDate);
        }
    }

    return (
        <div
            className="date-field"
            style={required && !value ? STYLES.redText : {}}
        >
            <p>{label}{required ? "*" : ""}</p>
            <DatePicker
                selected={value}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText='dd/mm/yyyy'
                disabled={disabled}
            />
            
        </div>
    )
}

export default DateField;