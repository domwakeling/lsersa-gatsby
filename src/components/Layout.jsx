import * as React from 'react';
// import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
// import { ToastContainer } from './booking/Toast.jsx';
import "@fontsource/hind/300.css"
import "@fontsource/hind/500.css"
import "@fontsource/montserrat/300.css"
import '../styles/style.scss';
// import fav from '../favicon.png';

const Layout = ({ children, location }) => {

    const data = useStaticQuery(graphql`
        query TitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
            }
    `);

    return (
        <>
            {/* <Helmet
                title={`${data.site.siteMetadata.title}`}
                meta={[
                    { name: 'description', content: 'Bowles ski racing club' },
                    { name: 'keywords', content: 'bowles, ski, skiing, racing' },
                    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
                ]}
                htmlAttributes={{
                    lang: 'en',
                }}
            >
                <link rel="icon" href={fav} sizes="32x32" type="image/png" />
                <script
                    src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign">
                </script>
            </Helmet> */}
            {/* <Header
                siteTitle={`${data.site.siteMetadata.title}`}
            /> */}
            <Navbar />
            {/* <ToastContainer align="right" position="top" /> */}
            <div className="container">
                <div id="content">
                    {children}
                    {/* <Copyright who="Bowles Ski Racing Club" /> */}
                </div>
                {/* <div id="right-column"> */}
                    {/* <MenuRight location={location} /> */}
                {/* </div> */}
            </div>
            <Footer />
        </>
    );
};

export default Layout;
