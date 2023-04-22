import React from 'react';
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const Footer = () => {
    // query to get social images with their relative path
    const imgQueryData = useStaticQuery(graphql`
        query FindSocialImages {
            allFile(
                filter: {sourceInstanceName: {eq: "images"}, relativePath: {regex: "/social/"}}
            ) {
                nodes {
                    relativePath
                    childImageSharp {
                        gatsbyImageData(width: 100, formats: [WEBP, PNG])
                    }
                }
            }
        }`
    );

    // map each image so we have the relative path and gatsby image data
    const imgData = imgQueryData.allFile.nodes.map(node => ({
        path: node.relativePath,
        image: getImage(node)
    }));

    const year = new Date().getFullYear();

    return (
        <div className="row footer-row">
            <hr className="bg-c500" style={{ clear: "both" }} />
            <footer>
                <div className="container footer-container">
                    <p className="smaller">&copy;1998-{year} LSERSA, all rights reserved</p>
                    <div id="social-media">
                    </div>
                    <a href="https://www.facebook.com/LSERSA/" style={{ textDecoration: "none", marginRight: "10px" }} target="_fb">
                        <GatsbyImage
                            image={imgData.filter(node => /fb/.test(node.path))[0].image}
                            alt="Facebook"
                            style={{ width: "50px", height: "auto" }}
                        />
                    </a>
                    <a href="https://www.instagram.com/lsersa_uk/" style={{ textDecoration: "none" }} target="_insta">
                        <GatsbyImage
                            image={imgData.filter(node => /inst/.test(node.path))[0].image}
                            alt="Instagram"
                            style={{ width: "50px", height: "auto" }}
                        />
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default Footer;



