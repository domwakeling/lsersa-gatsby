import React from "react"
import Hero from "../components/Hero.jsx";
import Layout from "../components/Layout.jsx";
import sponsorData from '../data/sponsors.yaml';
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

    const today = new Date();
    const meetingDate = new Date('2023-11-20');
    
    return (
        <Layout>
            <div className="container">
                <Hero text="WELCOME" text2="TO LSERSA" />
                <div className="row">
                    <h1 className="underlined">London &amp; South East Regional Snowsports Association</h1>
                    <p>Welcome to the London &amp; South East Regional Snowsports Association, LSERSA. We
                        are a regional association affiliated with Snowsport England, the national
                        governing body.</p>
                    <p>In addition to providing Regional Race Training and organising the LSERSA
                        Summer Race Series, our aim is to encourage participation in all snowsports.</p>
                </div>
                { (today <= meetingDate ) && (
                    <>
                        <div className="advice-box">
                            <h2 className="as-h3">Notice of AGM.</h2>
                            <p>The LSERSA AGM is being held on Monday 20th November at 7.00pm at
                                Chatham Ski Centre.</p>
                            <p>There are several committee members who have stepped down this year
                                and we encourage members of affiliated clubs to stand for one of the
                                vacant positions, listed below. The committee meet approx 4 times a
                                year. Some of the positions require attendance and help at the
                                LSERSA Regional races throughout the year.</p>
                            <p>Those interested should contact Lindsay Ayton directly if they wish
                                to be nominated for a committee position; all nominations to be
                                received by midnight on 4th November 2023.  We do hope that some of
                                our members will be happy to volunteer to be part of the team
                                helping our racers in the region.</p>
                            <p>Open positions:</p>
                            <ul>
                                <li>Regional Secretary</li>
                                <li>Marketing and Sponsorship</li>
                                <li>Regional Welfare Officer</li>
                                <li>Chief of Calcs/Timing</li>
                                <li>Equipment Officer</li>
                                <li>Assistant Equipment Office</li>
                            </ul>
                            <p>If anyone has any proposals they wish to have raised at the AGM can
                                they please submit these to Lindsay Ayton in writing by 5th November.</p>
                            <p>LSERSA meetings are open to all members.</p>
                        </div>
                        <br />
                    </>
                )}
            </div>

            <div className="banner col-p900 bg-p300">
                <div className="container">
                    <div className="row">
                        <h2>More about ...</h2>
                        <div className="panel-container">
                            <PanelCard url="/booking/">
                                <h3>Booking</h3>
                                <p>Regional Training session</p>
                            </PanelCard>
                            <PanelCard url="/clubs/">
                                <h3>Clubs</h3>
                                <p>Affiliated clubs</p>
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
                        {sponsorData.map((item, idx) => (
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
