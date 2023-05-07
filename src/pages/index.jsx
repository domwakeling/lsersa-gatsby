import React from "react"
import Hero from "../components/Hero.jsx";
import Layout from "../components/Layout.jsx";
import sponsordata from '../data/sponsors.yaml';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import PanelCard from "../components/PanelCard.jsx";
import { useSponsorImages } from "../lib/hooks/use-sponsor-images.js";
import DownloadItem from "../components/DownloadItem.jsx";

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
                        <h2 className="as-h3">Concussion Guidance 2023 &mdash; Please Read</h2>
                        <p className="larger">Recently, updated guidance has been published by the UK
                            Government on concussion with the title “if in doubt, sit them out”. LSERSA
                            has adopted this guidance.</p>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <p>The safety and well being of racers is a priority for racers participating in
                        LSERSA races, so please take the time to read the publication but more
                        importantly adhere to the minimum 21 day exclusion period recommended. The
                        severity of a concussion injury should not be underestimated and it is
                        important individuals, parents, schools and clubs work together to ensure
                        guidance is followed.</p>
                    <p>Key points</p>
                    <ul>
                        <li>Most people with concussion recover fully with time.</li>
                        <li>A concussion is a brain injury.</li>
                        <li>All concussions are serious.</li>
                        <li>Head injury can be fatal.</li>
                        <li>Most concussions occur without loss of consciousness (being "knocked out").</li>
                    </ul>
                    <p>Anyone with one or more visible clues, or symptoms of a head injury must be
                        immediately removed from playing or training and must not take part in any
                        further physical sport or work activity, even if symptoms resolve, until
                        assessment by an appropriate Healthcare Professional or by accessing the NHS
                        by calling 111, which should be sought within 24 hours. Return to education/
                        work takes priority over return to sport.</p>
                    <p>Individuals with concussion should only return to training or playing sport
                        which risks head injury after having followed a graduated return to activity
                        (education/work) and sport programme.</p>
                    <p>All concussions should be managed individually, but there should be no return
                        to training or competition before 21 days from injury.</p>
                    <p>Anyone with symptoms after 28 days should seek medical advice from their GP
                        (which may in turn require specialist referral and review).</p>
                    <p>Kind regards</p>
                    <p>LSERSA Executive Committee</p>
                    <p><b>Downloads</b></p>
                    <div style={{ marginBottom: "1.0rem" }}>
                        <DownloadItem
                            filelink="/resources/guidance/if_in_doubt_sit_them_out.pdf"
                            filename="concussion guide"
                            filetype="PDF"
                        />
                    </div>
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