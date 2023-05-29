import React from "react";

const DropDownField = ({
    possibleValues=[],
    currentValue='',
    label='LABEL',
    setValue= () => void 0,
    disabled=false
}) => {

    const changeHandler = (e) => { 
        const newValue = e.target.value;
        setValue(newValue)
    }

    return (
        <div className="dropdown">
            <label>
                {label} 
                <select value={currentValue} onChange={changeHandler} disabled={disabled}>
                    <option value=''>please select</option>
                    {possibleValues.map((item, idx) => (
                        <option value={item} key={idx}>{item}</option>
                    ))}
                </select>
            </label>
        </div>
    )
}

export default DropDownField;