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
            <link rel="icon" type="image/x-icon" href="/public/favicon.ico" />
            <link id="favicon" rel="icon" href={fav} sizes="32x32" type="image/png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon-16x16.png"/>
            {/* <link rel="manifest" href="/public/site.webmanifest"/> */}
            {children}
        </>
    )
};

export default HeaderComponent;