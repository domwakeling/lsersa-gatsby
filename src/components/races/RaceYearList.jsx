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
                        for={ idx === 0 ? "/races/" : `/races/${item.year}/`}
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
            {/* {% for year in races %}
            {% if loop.first %}
            <a className="year-lozenge-wrap" href="/races/">
                <div className="year-lozenge">
                    {{ year.year }}
                </div>
            </a>
            {% else %}
            <a className="year-lozenge-wrap" href="/races/{{ year.year }}/">
                <div className="year-lozenge">
                    {{ year.year }}
                </div>
            </a>
            {% endif %}
            {% endfor %} */}
        </>
    )
}

export default RaceYearList;