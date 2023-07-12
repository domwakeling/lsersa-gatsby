import * as React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import "@fontsource/hind/300.css"
import "@fontsource/hind/500.css"
import "@fontsource/roboto/400.css";
import '../styles/style.scss';

const Layout = ({ children }) => {

    return (
        <>
            <Navbar />
            <main id="main">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;