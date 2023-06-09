import React from "react"
import Layout from "../components/Layout.jsx";
import sponsorData from '../data/sponsors.yaml';
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import SponsorParser from "../components/utility/SponsorParser.jsx";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import { useSponsorImages } from "../lib/hooks/use-sponsor-images.js";

const SponsorsPage = () => {
    const imgQueryData = useSponsorImages();

    // map each image so we have the relative path and gatsby image data
    const imgData = imgQueryData.allFile.nodes.map(node => ({
        path: node.relativePath,
        image: getImage(node)
    }));

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className="header-no-hero underlined">Our Sponsors</h1>
                    <p>Many thanks to our sponsors, who help us to run the Summer Race Series.</p>
                    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2 }}>
                        <Masonry gutter="20px">
                            {
                                sponsorData.map((item, idx) => (
                                    <div className="sponsor-card" key={`sponsor-page-${idx}`}>
                                        <div className="sponsor-logo-grid-item">
                                            <a href={item.url} target={item.target }>
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
                    <br />
                </div>
            </div>
        </Layout>
    )
}

export default SponsorsPage

export const Head = () => (
    <HeaderComponent>
        <title>Sponsors | LSERSA</title>
    </HeaderComponent>
);