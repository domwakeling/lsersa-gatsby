import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import policyData from '../data/safeguarding-policies.yaml';
import DownloadItem from "../components/DownloadItem.jsx";

const SafeguardingPage = () => {

    return (
        <Layout>
            <div className="container">
                <Hero
                    imageUrl="hero/hero_tent.png"
                    imageAlt="LSERSA Gazebo"
                    imageShade="rgba(0,0,0,0.15)"
                    text="SAFEGUARDING"
                />

                <div className="row">
                    <h1 className="underlined">Safeguarding</h1>

                    <p>The London &amp; South East Regional Snowsports Association is committed to
                        safeguarding the welfare of children, young people and adults who engage in
                        all Snowsports activities.</p>

                    <p>Emma Hill is the Welfare Officer for LSERSA and is available to discuss any
                        concerns or worries you may have. Contact her in-person at training and race
                        days, or <a href="mailto:cwo@lsersa.org">via email</a>.</p>

                </div>
            </div>

            <div className="banner col-p900 bg-p300">
                <div className="container">
                    <div className="row">
                        <h2>Code Of Conduct</h2>
                        <p>We wish to remind all racers, coaches, parents and spectators that
                            appropriate personal conduct is expected at all LSERSA events. Whilst a
                            competitive atmosphere is to be encouraged, inappropriate or
                            unsportsmanlike behaviour will not be tolerated and can ultimately lead
                            to sanctions, including suspension from LSERSA events.</p>
                        <p>Examples of such behaviour include: equipment abuse, swearing,
                            aggressive behaviour, discrimination of any form, heated arguments,
                            disrespect shown to any official or volunteer.</p>
                        <p>All LSERSA events are "family friendly" environments with appropriate
                            behaviour to be demonstrated at all times.</p>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <br />
                    <h2>Safeguarding & Welfare Policy</h2>
                    <p><i>Snowsports England Policy reviewed Jan 2024 next review 2027</i></p>

                    <p>All racers, coaches, volunteers and spectators are
                        expected to adhere to the following policies whilst attending either LSERSA
                        training or LSERSA race days.</p>

                    <div className="table-responsive-container">
                        <table>
                            <tbody>
                                <tr>
                                    <td className="subtitle" colSpan={2}>
                                        <b>Policies</b>
                                    </td>
                                </tr>
                                {
                                    policyData.map(item => (
                                        <tr>
                                            <td>{item.text}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <DownloadItem
                                                    file_link={item.link}
                                                    filename={item.file_text}
                                                    filetype="PDF"
                                                    mini={true}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                }

                                <tr>
                                    <td className="subtitle" colSpan={2}>
                                        <b>Guidance on reporting a concern</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        NSPCC
                                    </td>
                                    <td>
                                        <a className="race-link"
                                           href="https://thecpsu.org.uk/media/319549/safeguarding-reporting-procedure-flowcharts-watermarked.pdf"
                                           target="_offsite"
                                        >Link</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Snowsport England
                                    </td>
                                    <td>
                                        <a className="race-link"
                                           href="https://www.snowsportengland.org.uk/safeguarding/"
                                           target="_offsite"
                                        >Link</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Medway Council
                                    </td>
                                    <td>
                                        <a className="race-link"
                                           href="https://www.medway.gov.uk/info/200170/children_and_families/600/worried_about_a_child/1"
                                           target="_offsite"
                                        >Link</a>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="subtitle" colSpan={2}>
                                        <b>Supportive Links</b>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        Kent Police
                                    </td>
                                    <td>
                                        <a className="race-link"
                                           href="https://www.kent.police.uk/area/your-area/kent/medway/"
                                           target="_offsite"
                                        >Link</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Snowsport England
                                    </td>
                                    <td>
                                        <a className="race-link"
                                           href="https://www.snowsportengland.org.uk/safeguarding/"
                                           target="_offsite"
                                        >Link</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        NSPCC
                                    </td>
                                    <td>
                                        <a className="race-link"
                                           href="https://www.nspcc.org.uk"
                                           target="_offsite"
                                        >Link</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Childline
                                    </td>
                                    <td>
                                        <a className="race-link"
                                           href="https://www.childline.org.uk/"
                                           target="_offsite"
                                        >Link</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Samaritans
                                    </td>
                                    <td>
                                        <a className="race-link"
                                           href="https://www.samaritans.org/"
                                           target="_offsite"
                                        >Link</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

        </Layout>
    )
}

export default SafeguardingPage

export const Head = () => (
    <HeaderComponent>
        <title>Safeguarding | LSERSA</title>
    </HeaderComponent>
);