import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const Hero = ({
    imageAlt = "LSERSA racers at the 2018 Tri-Regional competition",
    imageShade = "rgba(0,0,0,0.2)",
    imageUrl = "hero/hero_tri_2018.png",
    text = "WELCOME",
    text2 = "",
    textColor = "#fff"
}) => {
    // query to get all hero images with their relative path
    const imgQueryData = useStaticQuery(graphql`
        query FindHeroImages {
            allFile(
                filter: {sourceInstanceName: {eq: "images"}, relativePath: {regex: "/hero/"}}
            ) {
                nodes {
                    relativePath
                    childImageSharp {
                        gatsbyImageData(width: 1000, formats: [WEBP, PNG])
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

    return (
        <div className="main-container">
            <div className="left-column">
                <div className="aspect-ratio-box">
                    <div className="aspect-ratio-box-inside">
                        <GatsbyImage
                            image={imgData.filter(node => node.path === imageUrl)[0].image}
                            alt={imageAlt}
                            className="hero_image"
                        />
                        <div className="hero-shade" style={{ backgroundColor : imageShade }} />
                        <div className="hero-text">
                            { text2 && text2 !== '' && (
                                <p className="hero-para" style={{ color: textColor }}>
                                    {text}
                                </p>
                            )}
                            <p className="hero-para" style={{ color: textColor, borderBottomColor: textColor }}>
                                { text2 && text2 !== '' ? text2 : text }
                            </p> 
                        </div>
                    </div>
                </div>
                <br />
            </div>
            <div className="right-column">
                <h2 className="as-h3" style={{ textAlign: "center" }}>our sponsors</h2>
                <div style={{ height: "150px", width: "200px", backgroundColor: "grey", margin: "1em auto 1em" }} />
            </div>
        </div>
    )
}

export default Hero;