import * as React from 'react';
import Layout from '../../components/Layout.jsx';
import Hero from "../../components/Hero.jsx";
import meetingsData from '../../data/meetings.yaml';
import MeetingsTable from "../../components/meetings/MeetingsTable.jsx";
import MeetingsYearList from "../../components/meetings/MeetingsYearList.jsx";
import HeaderComponent from '../../components/head/HeaderComponent.jsx';

const RaceArchivePage = ({ pageContext }) => {
    const meetingsDataYear = meetingsData.filter(item => item.year === pageContext.year)[0];

    return (
        <Layout>
            <div className="container">
                <Hero
                    text="MEETINGS"
                    text2={pageContext.year}
                    imageUrl="hero/hero_clock.png"
                    imageAlt="Low-angle image of a clock"
                />
                <div className="row">

                    <div className="right-column-race">
                        <h2 className="as-h3" style={{ textAlign: "center" }}>Archives</h2>
                        <div style={{ width: "150px", margin: "0 auto 1.0rem" }}>
                            <MeetingsYearList year={pageContext.year} />
                        </div>
                    </div>

                    <h1>{pageContext.year} Meetings</h1>

                    <div className="table-responsive-container left-column">
                        <MeetingsTable data={meetingsDataYear} />
                    </div>

                    <div className="tablet-down">
                        <hr />
                        <h2 className="as-h3">Other years</h2>
                        <MeetingsYearList year={pageContext.year} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const Head = ({ pageContext }) => (
    <HeaderComponent>
        <title>{pageContext.year} Races | LSERSA</title>)
    </HeaderComponent>
)

export default RaceArchivePage;