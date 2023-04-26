import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import clubsData from '../data/clubs.yaml';
import { useStaticQuery, graphql } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import SponsorParser from '../components/utility/SponsorParser.jsx';

const ClubsPage = () => {
    // query to get all sponsor images with their relative path - matching the img value in yaml
    const imgQueryData = useStaticQuery(graphql`
        query FindClubImages {
            allFile(
                filter: {sourceInstanceName: {eq: "images"}, relativePath: {regex: "/clubs/"}}
            ) {
                nodes {
                    relativePath
                    childImageSharp {
                        gatsbyImageData(width: 200, formats: [WEBP, PNG])
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
                    text2="CLUBS"
                    imageUrl="hero/trophies.png"
                    imageAlt="End of year trophies"
                />
                <div className="row">
                    <h1>Clubs</h1>
                    <p style={{ fontSize: "2.0rem" }}>
                        The following regional clubs are affiliated to LSERSA through Snowsports
                        England:
                    </p>
                    {
                        clubsData.map((club, idx) => (
                            <div className="club-container" key={idx}>
                                <div className="image-container">
                                    <GatsbyImage
                                        image={imgData.filter(node => node.path === club.img)[0].image}
                                        alt={club.name}
                                        className="club-image"
                                        width="200"
                                        height="150"
                                    />
                                </div>
                                <div className="club-info">
                                    <h2 className="as=h3">{club.name}</h2>
                                    <SponsorParser rawHTML={club.copy} />
                                    <a className="club-link" href={club.url} target={club.target}>
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

export default ClubsPage

export const Head = () => (
    <HeaderComponent>
        <title>Clubs | LSERSA</title>
    </HeaderComponent>
);