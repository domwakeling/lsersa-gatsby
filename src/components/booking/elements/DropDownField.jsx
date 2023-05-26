import React, { useState } from "react";

const DropDownField = ({
    possibleValues=[],
    currentValue='',
    placeholder='select',
    label='LABEL',
    reportChange= () => void 0
}) => {
    
    const [selected, setSelected] = useState(currentValue);

    const changeHandler = (e) => { 
        const newValue = e.target.value;
        setSelected(newValue);
        reportChange(newValue)
    }

    return (
        <>
            <label>
                {label}
                <select value={selected} onChange={changeHandler}>
                    <option value=''>please select</option>
                    {possibleValues.map((item, idx) => (
                        <option value={item} key={idx}>{item}</option>
                    ))}
                </select>
            </label>
        </>
    )
}

export default DropDownField;