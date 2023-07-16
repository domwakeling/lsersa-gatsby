import React, { useState, useEffect, useCallback } from 'react';
import navbarLinks from '../data/navbar-links.yaml';
import { StaticImage } from 'gatsby-plugin-image';
import { Link } from "gatsby";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [handlerSet, setHandlerSet] = useState(false);
    const [wrapperRef, setWrapperRef] = useState(null);

    const setMenuWrapperRef = (node) => {
        setWrapperRef(node);
    };

    const burgerClickHandler = (e) => {
        e.preventDefault();
        toggleMenuHandler();
        e.target.blur();
    };

    const toggleMenuHandler = useCallback(() => {
        setMenuOpen(!menuOpen);
    }, [menuOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef && !wrapperRef.contains(e.target) && menuOpen) {
                toggleMenuHandler();
            }
        };
        if (!handlerSet) {
            document.addEventListener('mousedown', handleClickOutside);
            setHandlerSet(true);
        }
        return function cleanup() {
            if (handlerSet) {
                document.removeEventListener('mousedown', handleClickOutside);
                setHandlerSet(false);
            }
        };
    }, [handlerSet, wrapperRef, menuOpen, toggleMenuHandler]);

    return (
        <nav id="main-nav">
            <Link className="skip-link" to='#main'>Skip to content</Link>
            <div className="container" ref={setMenuWrapperRef}>
                <div className="row">
                    <button
                        aria-label="menu"
                        className="icon"
                        onClick={burgerClickHandler}
                    >
                        <div className="icon-bar"></div>
                        <div className="icon-bar"></div>
                        <div className="icon-bar"></div>
                    </button>
                    <div>
                        <Link className="brand" to="/">
                            <StaticImage
                                src="../images/logos/lsersa_white.png"
                                alt="LSERSA skier logo"
                                layout="fixed"
                                width={35}
                                className="brand-image"
                            />
                            <span className="brand-text">LSERSA</span>
                        </Link>
                        <ul className="navlink-desktop">
                            { navbarLinks.map((item, idx) => (
                                <li className="menu-wide" key={`navlink-desktop-${idx}`}>
                                    <Link to={item.link}>
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div id="menu-responsive" className={menuOpen ? "menu-show" : ""}>
                        <ul>
                            {navbarLinks.map((item, idx) => (
                                <li className="menu-wide" key={`navlink-tablet-${idx}`}>
                                    <Link to={item.link}>
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;