import React from "react";
import DropDownFieldForIds from "./DropDownFieldForIds";
import { genders } from "../../../lib/db_refs";

const GenderSelection = ({ genderId, setGenderId, disabled }) => {

    const genderValues = ['female', 'male'];
    const genderIds = [genders.FEMALE, genders.MALE];

    return (
        <div className="gender-selection">
            <DropDownFieldForIds
                values={genderValues}
                ids={genderIds}
                currentId={genderId}
                label='gender'
                setId={setGenderId}
                disabled={disabled}
            />
        </div>
    )
}

export default GenderSelection;