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
                    <h1 className="header-no-hero underlined">Partner with LSERSA</h1>
                    <p>We are the London &amp; South East Regional Snowsports Association &mdash;
                        affiliated with Snowsport England. We run regional race training and the
                        Summer Race Series, supporting participation from grassroots to performance
                        skiing and snowboarding.</p>
                    <h2>Why partner with us?</h2>
                    <p>LSERSA connects brands with a passionate regional snowsports community &mdash;
                        racers, families, clubs, and coaches across London and the South East. Our
                        Summer Race Series and training programme put your organisation in front of
                        engaged participants throughout the year.</p>
                    <p>Whether you want visibility at events, alignment with youth development, or
                        association with regional excellence in snowsports, we would like to hear
                        from you.</p>
                    <div className="advice-box">
                        <p>If you would like to discuss sponsorship or commercial partnership with
                            LSERSA, please contact&nbsp;
                            <a href="mailto:marketing@lsersa.org?subject=Sponsorship enquiry">
                                Sponsorship enquiries
                            </a>.
                        </p> 
                    </div>
                    <br />
                    <h2>Partners</h2>
                    <p>Principal partners who support the Summer Race Series and regional
                        programmes.</p>
                    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 1024: 2 }}>
                        <Masonry gutter="20px">
                            {
                                sponsorData
                                    .filter(item => item.type === 'partner' )
                                    .map((item, idx) => (
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
                                            <p>
                                                <a href={item.url} target={item.target}>
                                                    Visit website
                                                </a>
                                            </p>
                                    </div>
                                ))
                            }
                        </Masonry>
                    </ResponsiveMasonry>
                    <br />
                    <h2>Supporters</h2>
                    <p>Organisations that help us deliver training, events and media across the
                        region.</p>
                    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 1050: 4 }}>
                        <Masonry gutter="20px">
                            {
                                sponsorData
                                    .filter(item => item.type === 'supporter')
                                    .map((item, idx) => (
                                        <div className="sponsor-card" key={`sponsor-page-${idx}`}>
                                            <div className="sponsor-logo-grid-item">
                                                <a href={item.url} target={item.target}>
                                                    <GatsbyImage
                                                        image={imgData.filter(node => node.path === item.img)[0].image}
                                                        alt={item.name}
                                                    />
                                                </a>
                                            </div>
                                            <p>
                                                <a href={item.url} target={item.target}>
                                                    Visit website
                                                </a>
                                            </p>
                                        </div>
                                    ))
                            }
                        </Masonry>
                    </ResponsiveMasonry>
                    <br />
                    <p>Many thanks to all our partners and supporters, who help us run the Summer
                        Race Series and encourage participation in regional snowsports.</p>
                    <br/>
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