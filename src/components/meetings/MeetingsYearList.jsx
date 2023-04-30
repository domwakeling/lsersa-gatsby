import React from "react";
import meetingsData from '../../data/meetings.yaml';
import { Link } from "gatsby";

const MeetingsYearList = ({ year }) => {
    return (
        <>
            {
                meetingsData.map((item, idx) => (
                    <Link
                        className="year-lozenge-wrap"
                        to={`/minutes/${item.year}/`}
                        key={idx}
                    >
                        <div
                            className={item.year === year ? "year-lozenge this-year" : "year-lozenge"}
                        >
                            {item.year}
                        </div>
                    </Link>        
                ))
            }
        </>
    )
}

export default MeetingsYearList;