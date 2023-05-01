import React from "react";
import fav from '../../favicon.png';
import { useSiteMetadata } from '../../lib/hooks/use-site-metadata.js';

const HeaderComponent = ({ title, description, pathname, children }) => {

    const { title: defaultTitle, description: defaultDescription, siteUrl } = useSiteMetadata()

    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        url: `${siteUrl}${pathname || ``}`
    }

    return (
        <>
            <html lang="en" />
            <meta name="description" content={seo.description} />
            <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1.0' />
            <link id="favicon" rel="icon" href={fav} sizes="32x32" type="image/png" />
            {children}
        </>
    )
};

export default HeaderComponent;