import React from "react";
import raceData from '../../data/races.yaml';
import { Link } from "gatsby";

const RaceYearList = ({ year }) => {
    return (
        <>
            {
                raceData.map((item, idx) => (
                    <Link
                        className="year-lozenge-wrap"
                        to={ idx === 0 ? "/races/" : `/races/${item.year}/`}
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

export default RaceYearList;