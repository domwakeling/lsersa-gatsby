import React from "react"
import Hero from "../components/Hero.jsx";
import Layout from "../components/Layout.jsx";
import sponsordata from '../data/sponsors.yaml';
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const HomePage = () => {
    // query to get all sponsor images with their relative path - matching the img value in yaml
    const imgQueryData = useStaticQuery(graphql`
        query FindSponsorImages {
            allFile(
                filter: {sourceInstanceName: {eq: "images"}, relativePath: {regex: "/sponsors/"}}
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
            <Hero text="WELCOME" text2="TO LSERSA" />
            <div className="row">
                <h1 className="underlined">London &amp; South East Regional Snowsports Association</h1>
                <p>Regional Race Training is held at Chatham on Saturday mornings (9-11am).</p>
                <p>Welcome to the London & South East Regional Snowsports Assocation, LSERSA. We are a regional
                    association affiliated with Snowsport England, the national governing body.</p>
                <p>In addition to providing Regional Race Training and organising the LSERSA Summer Race Series, our
                    aim is to encourage participation in all snowsports.</p>
                <br />
            </div>
            <div className="row">
                <hr />
                <h2>Thankyou to our sponsors</h2>
                <div className="sponsor-logo-grid">
                    {sponsordata.map((item, idx) => (
                        <div className="sponsor-logo-grid-item" key={`sponsor-body-${idx}`} >
                            <a href={item.url} target={item.target}>
                                <GatsbyImage
                                    image={imgData.filter(node => node.path === item.img)[0].image}
                                    alt={item.name}
                                />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default HomePage

export const Head = () => <title>Home | LSERSA</title>