import * as React from 'react';
import Layout from '../../components/Layout.jsx';
import Hero from "../../components/Hero.jsx";
import raceData from '../../data/races.yaml';
import specialData from '../../data/specials.yaml';
import RaceTable from "../../components/races/RaceTable.jsx";
import RaceYearList from "../../components/races/RaceYearList.jsx";
import HeaderComponent from '../../components/head/HeaderComponent.jsx';

const RaceArchivePage = ({ pageContext }) => {
    const raceDataYear = raceData.filter(item => item.year === pageContext.year)[0];

    const specialsDataYear = specialData.filter(item => item.year === pageContext.year);

    return (
        <Layout>
            <div className="container">
                <Hero
                    text="RACES"
                    text2={pageContext.year}
                    imageUrl="hero/trophies.png"
                    imageAlt="End of year trophies"
                />
                <div className="row">

                    <div className="right-column-race">
                        <h2 className="as-h3" style={{ textAlign: "center" }}>Archives</h2>
                        <div style={{ width: "150px", margin: "0 auto 1.0rem" }}>
                            <RaceYearList year={pageContext.year} />
                        </div>
                    </div>

                    <h1>{pageContext.year} Race Season</h1>

                    { pageContext.year !== 2020 && (
                        <>
                            <h2>Race Results</h2>
                            <div>
                                <div className="table-responsive-container left-column">
                                    <RaceTable data={raceDataYear} />
                                </div>
                            </div>
                        </>
                    )}

                    { pageContext.year === 2020 && (
                        <p>There were no races held in 2020 due to Covid.</p>
                    )}

                    {
                        specialsDataYear.length > 0 && (
                            <>
                                <br />
                                <h2>Special Cups {pageContext.year}</h2>
                                <p>Winners of the end-of-year awards.</p>
                                <div className="table-responsive-container">
                                    <table>
                                        <tbody>
                                        {
                                            specialsDataYear[0].items.map((item, idx) => (
                                                <tr key={`spec-${idx}`}>
                                                    <td style={{ paddingRight: '1.0rem' }}>
                                                        {item.name}
                                                    </td>
                                                    <td style={{ paddingRight: '1.0rem' }}>
                                                        {item.winner}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )
                    }

                    <div className="tablet-down">
                        <hr />
                        <h2 className="as-h3">Links to other years' results</h2>
                        <RaceYearList year={pageContext.year} />
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