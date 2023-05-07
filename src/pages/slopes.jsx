import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import slopesData from '../data/slopes.yaml';
import { useStaticQuery, graphql } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import SponsorParser from '../components/utility/SponsorParser.jsx';

const SlopesPage = () => {
    // query to get all sponsor images with their relative path - matching the img value in yaml
    const imgQueryData = useStaticQuery(graphql`
        query FindSlopeImages {
            allFile(
                filter: {sourceInstanceName: {eq: "images"}, relativePath: {regex: "/maps/"}}
            ) {
                nodes {
                    relativePath
                    childImageSharp {
                        gatsbyImageData(width: 400, formats: [WEBP, PNG])
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
        <Layout>
            <div className="container">
                <Hero
                    text="LOCAL"
                    text2="SLOPES"
                    imageUrl="hero/hero_clubs.png"
                    imageAlt="End of year trophies"
                />
                <div className="row">
                    <h1>Slopes</h1>
                    <p className="larger">
                        We are fortunate to have a number of slopes in and around the region,
                        making snowsports accessible to everyone. The following are slopes that
                        the region uses regularly for races / DSUK / SSCD activities.</p>
                    {
                        slopesData.map((slope, idx) => (
                            <div className="slope-container" key={idx}>
                                <div className="image-container">
                                    <a href={slope.map_url} target={slope.target}>
                                        <GatsbyImage
                                            image={imgData.filter(node => node.path === slope.img)[0].image}
                                            alt={slope.name}
                                            className="slope-image"
                                            width="400"
                                            height="200"
                                        />
                                    </a>
                                </div>
                                <div className="slope-info">
                                    <h2 className="as=h3">{slope.name}</h2>
                                    {
                                        slope.copy && ( slope.copy !== null ) && (
                                            <SponsorParser rawHTML={slope.copy} />
                                        )
                                    }
                                    <a className="slope-link" href={slope.url} target={slope.target}>
                                        Visit site
                                    </a>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Layout>
    )
}

export default SlopesPage

export const Head = () => (
    <HeaderComponent>
        <title>Slopes | LSERSA</title>
    </HeaderComponent>
);