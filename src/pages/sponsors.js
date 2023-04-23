import React from "react"
import Layout from "../components/Layout.jsx";
import sponsordata from '../data/sponsors.yaml';
import { useStaticQuery, graphql } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import SponsorParser from "../components/utility/SponsorParser.jsx";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const SponsorsPage = () => {
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
            <div className="row">
                <h1 className="header-no-hero underlined">Our Sponsors</h1>
                <p>Many thanks to our sponsors, who help us to run the Summer Race Series.</p>
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2 }}>
                    <Masonry gutter={20}>
                    {
                        sponsordata.map((item, idx) => (
                            <div className="sponsor-card" key={`sponsor-page-${idx}`}>
                                <div className="sponsor-logo-grid-item">
                                    <a href="{{ item.url }}" target="{{ item.target }}">
                                        <GatsbyImage
                                            image={imgData.filter(node => node.path === item.img)[0].image}
                                            alt={item.name}
                                        />
                                    </a>
                                </div>
                                <SponsorParser rawHTML={item.copy} />
                            </div>
                        ))
                    }
                    </Masonry>
                </ResponsiveMasonry>
            </div>
        </Layout>
    )
}

export default SponsorsPage

export const Head = () => <title>Sponsors | LSERSA</title>