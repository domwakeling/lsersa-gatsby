import React from "react";
import DropDownFieldForIds from './DropDownFieldForIds';

const ClubSelection = ({ clubId, setClubId, clubs, disabled }) => {

    const clubValues = clubs.sort((a, b) => a.name < b.name ? -1 : 1).map(club => club.name);
    const clubIds = clubs.sort((a, b) => a.name < b.name ? -1 : 1).map(club => club.id);

    return (
        <div className="club-selection">
            <DropDownFieldForIds
                values={clubValues}
                ids={clubIds}
                currentId={clubId}
                label='club'
                setId={setClubId}
                disabled={disabled}
            />
        </div>
    )
}

export default ClubSelection;