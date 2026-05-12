import React from 'react';
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";

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
                    <div id="footer-left">
                        <div class="spreader tablet-down" />
                        <p className="smaller">&copy;1998-{year} LSERSA, all rights reserved</p>
                        <div class="spreader tablet-down" />
                    </div>

                    <div class="spreader" />

                    <div id="footer-mid">
                        <div class="spreader tablet-down" />
                        <div id="dolwen-stack">
                            <div id="dolwen-text">
                                website by&nbsp;
                            </div>
                            <div className="ds-img-wrapper">
                                <a href="https://www.dolwensolutions.com/" target="_dolwen" className="ds-img-wrapper-link">
                                    <StaticImage
                                        src="../images/logos/dolwen_solutions.png"
                                        alt="Dolwen Solutions logo"
                                        width={120}
                                        className="ds-img"
                                        />
                                </a>
                            </div>
                        </div>
                        <div class="spreader tablet-down" />
                    </div>

                    <div class="spreader" />

                    <div id="social-media">
                        <div class="spreader tablet-down" />
                        <a href="https://www.facebook.com/LSERSA/" className="social-link" target="_fb">
                            <GatsbyImage
                                image={imgData.filter(node => /fb/.test(node.path))[0].image}
                                alt="Facebook"
                                className="social-media-icon"
                            />
                        </a>
                        <a href="https://www.instagram.com/ski.lsersa/" className="social-link" target="_insta">
                            <GatsbyImage
                                image={imgData.filter(node => /inst/.test(node.path))[0].image}
                                alt="Instagram"
                                className="social-media-icon"
                            />
                        </a>
                        <a href="https://www.tiktok.com/@ski.lsersa?_r=1&_t=ZN-95x0BOxHr5a" className="social-link" target="_tiktok">
                            <GatsbyImage
                                image={imgData.filter(node => /tikto/.test(node.path))[0].image}
                                alt="TikTok"
                                className="social-media-icon"
                            />
                        </a>
                        <a href="https://youtube.com/@ski-lsersa?si=AK8982u63y31uuDZ" className="social-link" target="_youtube">
                            <GatsbyImage
                                image={imgData.filter(node => /youtube/.test(node.path))[0].image}
                                alt="YouTube"
                                className="social-media-icon"
                            />
                        </a>
                        <a href="https://x.com/SKI_LSERSA" className="social-link" target="_x">
                            <GatsbyImage
                                image={imgData.filter(node => /xtwitter/.test(node.path))[0].image}
                                alt="X"
                                className="social-media-icon"
                            />
                        </a>
                        <div class="spreader tablet-down" />
                    </div>
                </div>

            </footer>
        </div>
    )
}

export default Footer;



