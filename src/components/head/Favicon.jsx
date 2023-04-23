import React from "react";
import fav from '../../favicon.png';

const Favicon = ({ children }) => (
    <>
        <link id="favicon" rel="icon" href={fav} sizes="32x32" type="image/png" />
        {children}
    </>
);

export default Favicon;