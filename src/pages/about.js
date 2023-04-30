import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import { Link, useStaticQuery, graphql } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import PanelCard from "../components/PanelCard.jsx";
import committeeData from '../data/committee.yaml';

const AboutPage = () => {
    // query to get all logos with their relative path
    const imgQueryData = useStaticQuery(graphql`
        query FindLogoImages {
            allFile(
                filter: {sourceInstanceName: {eq: "images"}, relativePath: {regex: "/logos/"}}
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
                <Hero text="ABOUT" text2="THE REGION" />
                <div className="row">
                    <h1 className="underlined">About LSERSA</h1>

                    <div className="column-container">
                        <div>
                            <p>The London &amp; South East Regional Ski Association (LSERSA) was first
                                set up in 1970 to represent skiers in the South Eastern counties of
                                England. LSERSA has solid relationships with many other regions as well
                                as the Home Nation Governing Bodies (HNGBs). It is one of the eight
                                regions that are currently affiliated to Snowsport England (SSE), and
                                through it to GB Snowsport.</p>

                            <p>In 2006 the region changed its name to the London &amp; South East
                                Regional Snowsports Association to reflect the expanding diversity of
                                the region and its members. Today LSERSA represents a variety of
                                snowsports clubs including alpine and freestyle skiing, snowboarding,
                                telemark and skiercross.</p>

                            <p>As well as running the <Link to="/races/">Summer Race Series</Link>,
                                LSERSA runs weekly <Link to="/training/">slalom training</Link> sessions
                                together with ad-hoc skiercross and telemark training, and supports
                                local school ski racing.</p>
                        </div>

                        <div className="right-column">
                            <div className="sponsor-logo-grid-item">
                                <a href="https://www.snowsportengland.org.uk/" target="sse">
                                    <GatsbyImage
                                        image={imgData.filter(node => /sse/.test(node.path))[0].image}
                                        alt="Snowsport England"
                                        style={{ marginTop: "1.0rem" }}
                                    />
                                </a>
                            </div>
                            <div className="sponsor-logo-grid-item">
                                <a href="https://gbsnowsport.com/" target="gbss">
                                    <GatsbyImage
                                        image={imgData.filter(node => /gbss/.test(node.path))[0].image}
                                        alt="GB Snowsport"
                                        style={{ marginTop: "2.0rem" }}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            </div>

            <div className="banner col-p900 bg-p300">
                <div className="container">
                    <div className="row">
                        <h2>More about ...</h2>
                        <div className="panel-container">
                            <PanelCard url="/clubs/">
                                <h3>Clubs</h3>
                                <p>Afiliated clubs</p>
                            </PanelCard>
                            <PanelCard url="/races/">
                                <h3>Races</h3>
                                <p>Race calendar & results</p>
                            </PanelCard>
                            <PanelCard url="#committee">
                                <h3>Region</h3>
                                <p>The committee</p>
                            </PanelCard>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <br/>
                    <h2 id="committee">The Committee</h2>
                    <p><i>Members of the Executive Committee noted with an asterisk</i></p>
                    <table className="table-responsive-container">
                        {
                            committeeData.map(item => (
                                <tr>
                                    <td>
                                        {item.executive ? <b>*</b> : ''}
                                    </td>
                                    <td style={{paddingRight: '2.0rem'}}>
                                        {item.executive ? <b>{item.role}</b> : item.role }
                                    </td>
                                    <td style={{ paddingRight: '2.0rem' }}>
                                        {item.name !== null ? item.name : <b>VACANT</b> }
                                    </td>
                                    <td>
                                        {item.email ? <a className="race-link" href={`mailto:${item.email}`}>email</a> : ''}
                                    </td>
                                </tr>
                            ))
                        }
                    </table>
                </div>
            </div>

        </Layout>
    )
}

export default AboutPage

export const Head = () => (
    <HeaderComponent>
        <title>About | LSERSA</title>
    </HeaderComponent>
);