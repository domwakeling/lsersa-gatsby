import React from "react"
import Hero from "../components/Hero.jsx";
import Layout from "../components/Layout.jsx";
import sponsordata from '../data/sponsors.yaml';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import PanelCard from "../components/PanelCard.jsx";
import { useSponsorImages } from "../lib/hooks/use-sponsor-images.js";

const HomePage = () => {
    const imgQueryData = useSponsorImages();

    // map each image so we have the relative path and gatsby image data
    const imgData = imgQueryData.allFile.nodes.map(node => ({
        path: node.relativePath,
        image: getImage(node)
    }));
    
    return (
        <Layout>
            <div className="container">
                <Hero text="WELCOME" text2="TO LSERSA" />
                <div className="row">
                    <h1 className="underlined">London &amp; South East Regional Snowsports Association</h1>
                    <p>Welcome to the London & South East Regional Snowsports Assocation, LSERSA. We
                        are a regional association affiliated with Snowsport England, the national
                        governing body.</p>
                    <p>In addition to providing Regional Race Training and organising the LSERSA
                        Summer Race Series, our aim is to encourage participation in all snowsports.</p>
                </div>
            </div>

            <div className="banner col-p900 bg-p300">
                <div className="container">
                    <div className="row">
                        <h2>More about ...</h2>
                        <div className="panel-container">
                            <PanelCard url="/training/">
                                <h3>Booking</h3>
                                <p>Regional Training session</p>
                            </PanelCard>
                            <PanelCard url="/clubs/">
                                <h3>Clubs</h3>
                                <p>Afiliated clubs</p>
                            </PanelCard>
                            <PanelCard url="/races/">
                                <h3>Races</h3>
                                <p>Race calendar & results</p>
                            </PanelCard>
                            <PanelCard url="/about/#committee">
                                <h3>Region</h3>
                                <p>The committee</p>
                            </PanelCard>
                            <PanelCard url="/sponsors/">
                                <h3>Sponsors</h3>
                                <p>More about our sponsors</p>
                            </PanelCard>
                            <PanelCard url="/about/">
                                <h3>About</h3>
                                <p>More about us</p>
                            </PanelCard>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <h2>Thank you to our sponsors</h2>
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
            </div>
        </Layout>
    )
}

export default HomePage

export const Head = () => (
    <HeaderComponent> 
        <title>Home | LSERSA</title>
    </HeaderComponent>
);