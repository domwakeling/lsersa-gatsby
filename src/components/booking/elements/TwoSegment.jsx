import React from "react";

const TwoSegment = ({
    label="options",
    leftLabel="left",
    rightLabel="right",
    segmentMinWidth="50px",
    activeSegment="left",
    reportClick=()=>{},
    disabled=false
}) => {

    const clickHandler = (e) => {
        e.preventDefault();
        if (!disabled) {
            reportClick(e.target.value);
        }
    }

    const leftNames = 'left' + (activeSegment === 'left' ? ' active' : '');
    const rightNames = 'right' + (activeSegment === 'right' ? ' active' : '');

    return (
        <div className="two-segment">
            <p>{label}</p>
            <div className="button-container">
                <button
                    className={leftNames}
                    onClick={clickHandler}
                    style={{ minWidth: segmentMinWidth }}
                    value={leftLabel}
                    disabled={disabled}
                >
                    {leftLabel}
                </button>
                <button
                    className={rightNames}
                    onClick={clickHandler}
                    style={{ minWidth: segmentMinWidth }}
                    value={rightLabel}
                    disabled={disabled}
                >
                    {rightLabel}
                </button>
            </div>
        </div>
    )
}

export default TwoSegment;