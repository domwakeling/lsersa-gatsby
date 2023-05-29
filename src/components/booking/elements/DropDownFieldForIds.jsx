import React from "react";
import DropDownField from "./DropDownField";

// Use DropDownField if you have (text) values; use DropDownFieldForIds if you need to STORE an
// id but SHOW text

const DropDownFieldForIds = ({ currentId, setId, ids, values, label, disabled=false }) => {

    const convertIdToValue = (n) => {
        const idx = ids.indexOf(n);
        return idx < 0 ? '' : values[idx];
    }

    const convertValueToId = (s) => {
        const idx = values.indexOf(s);
        return idx < 0 ? undefined : ids[idx];
    }

    const setIdForValue = (v) => {
        const newId = convertValueToId(v);
        setId(newId);
    }

    return (
        <DropDownField
            possibleValues={values}
            currentValue={convertIdToValue(currentId)}
            label={label}
            setValue={setIdForValue}
            disabled={disabled}
        />
    )
}

export default DropDownFieldForIds;