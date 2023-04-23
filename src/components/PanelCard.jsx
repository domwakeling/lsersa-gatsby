import React from "react";
import { Link } from "gatsby";

const PanelCard = ({ children, url }) => {
    return (
        <div>
            <div className="panel">
                <Link to={url}>
                    {children}
                </Link>
            </div>
        </div>
    )
}

export default PanelCard;