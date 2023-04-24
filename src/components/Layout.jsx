import * as React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
// import { ToastContainer } from './booking/Toast.jsx';
import "@fontsource/hind/300.css"
import "@fontsource/hind/500.css"
import "@fontsource/roboto/400.css";
import '../styles/style.scss';

const Layout = ({ children }) => {

    return (
        <>
            {/* <Helmet
                meta={[
                    { name: 'description', content: 'Bowles ski racing club' },
                    { name: 'keywords', content: 'bowles, ski, skiing, racing' },
                    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
                ]}
                htmlAttributes={{
                    lang: 'en',
                }}
            >
                <script
                    src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign">
                </script>
            </Helmet> */}
            {/* <Header
                siteTitle={`${data.site.siteMetadata.title}`}
            /> */}
            <Navbar />
            {/* <ToastContainer align="right" position="top" /> */}
            {children}
            <Footer />
        </>
    );
};

export default Layout;