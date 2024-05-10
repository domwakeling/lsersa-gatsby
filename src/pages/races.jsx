import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import raceData from '../data/races.yaml';
import RaceTable from "../components/races/RaceTable.jsx";
import RaceYearList from "../components/races/RaceYearList.jsx";
import DownloadItem from "../components/DownloadItem.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import WhatsAppLink from "../components/WhatsAppLink.jsx";

const RacesPage = () => {
    return (
        <Layout>
            <div className="container">
                <Hero
                    text="RACES"
                    text2={raceData[0].year}
                    imageUrl="hero/trophies.png"
                    imageAlt="End of year trophies"
                />
                <div className="row">

                    <WhatsAppLink />

                    <div className="right-column-race">
                        <h2 className="as-h3" style={{ textAlign: "center" }}>Archives</h2>
                        <div style={{ width: "150px", margin: "auto" }}>
                            <RaceYearList year={raceData[0].year} />
                        </div>
                    </div>

                    <h1>{raceData[0].year} Race Season</h1>

                    <a className="tablet-down years-link" href="#previous-years">
                        previous years
                    </a>

                    <h2>Race Calendar</h2>
                        <div className="table-responsive-container left-column">
                            <RaceTable data={raceData[0]} />
                        </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <br />
                    <hr />
                    <h2>LSERSA Summer Series</h2>
                    <p>We use <a href="https://skiresults.co.uk/" offsite="_results">Ski Results</a> for
                        race entry as well as our results.</p>

                    <div className="advice-box">
                        <p>Race entries close at 7pm on the Wednesday prior to race day, or when we
                            reach 115 entries, so please ensure you complete your entry early to
                            avoid disappointment.</p>
                        <p>Race entries may stay open for a limited time after this at an additional fee
                            dependent on numbers, but this is solely at the discretion of the committee
                            and once entries are finally closed, no more racers will be accepted.</p>
                    </div>

                    <p>LSERSA runs a summer series each year. Race format is:</p>
                    <ul>
                        <li>three individual slalom runs</li>
                        <li>three individual head-to-head dual slaloms</li>
                        <li>club- and fun-team dual slaloms</li>
                    </ul>
                    <p>Typical timetable for the day is</p>
                    <div className="table-responsive-container">
                        <table>
                            <tbody>
                                <tr>
                                    <td>07:45</td>
                                    <td>Car park opens</td>
                                </tr>
                                <tr>
                                    <td>08:05</td>
                                    <td>Race office opens for bib issue</td>
                                </tr>
                                <tr>
                                    <td>08:15</td>
                                    <td>Open practice U12/U10/U8</td>
                                </tr>
                                <tr>
                                    <td>08:45</td>
                                    <td>Open practice U14 and above</td>
                                </tr>
                                <tr>
                                    <td>09:00</td>
                                    <td>Team Manager's meeting</td>
                                </tr>
                                <tr>
                                    <td>09:15</td>
                                    <td>Course setting</td>
                                </tr>
                                <tr>
                                    <td>09:30</td>
                                    <td>Course inspection (U14 & above through full gates)</td>
                                </tr>
                                <tr>
                                    <td>09:50</td>
                                    <td>Course inspection (U12 & below through stubby gates)</td>
                                </tr>
                                <tr>
                                    <td>10:15</td>
                                    <td>Start first run of Individual Slalom</td>
                                </tr>
                                <tr>
                                    <td>12:15 (approx)</td>
                                    <td>Head to Heads, U12 and below</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Head to Heads, U14 and above</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Mini Club Teams, U12 and below, teams of 3, max 3 teams per club *</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Fun teams *</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Club Teams, teams of 5, max 3 teams per club *</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Prize giving</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p><em>* Racers may only compete in <strong>one</strong> team event</em></p>
                    <p>Trophies are awarded at each event for top three in age group, based on combined
                        best two times from the individual slalom runs.</p>
                    <p>There are also overall trophies for each group for the season. This is based on
                        points, which are earned based on age-group position at each individual race,
                        together with the individual head-to-heads. A racer must score points in three
                        races to be eligible for the overall, and points are taken from the best four
                        events.</p>
                    <p>Age groups for the current, previous and following year are available on{' '}
                        <a href="https://gbski.com/lists.php#ages" target="_gbski">GBSki.com</a>.</p>
                    <p><b>Downloads</b></p>
                    <div style={{ marginBottom: "2.0rem"}}>
                        <DownloadItem
                            file_link="/resources/guidance/05_race_rules.pdf"
                            filename="race rules & format"
                            filetype="PDF"
                        />
                        <DownloadItem
                            file_link="/resources/guidance/if_in_doubt_sit_them_out.pdf"
                            filename="concussion guide"
                            filetype="PDF"
                        />
                    </div>
                </div>
            </div>

            <div className="banner col-p900 bg-p300">
                <div className="container">
                    <div className="row">
                        <h2>Code Of Conduct</h2>
                        <p>We wish to remind all racers, coaches, parents and spectators that appropriate
                            personal conduct is expected at all LSERSA events. Whilst a competitive
                            atmosphere is to be encouraged, inappropriate or unsportsmanlike behaviour will
                            not be tolerated and can ultimately lead to sanctions, including suspension from
                            LSERSA events.</p>
                        <p>Examples of such behaviour include: equipment abuse, swearing,
                            aggressive behaviour, discrimination of any form, heated arguments, disrespect
                            shown to any official or volunteer.</p>
                        <p>All LSERSA events are "family friendly" environments with appropriate
                            behaviour to be demonstrated at all times.</p>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <br />
                    <h2 id="concussion_guidance">Concussion Guidance</h2>
                    <p>The safety and well being of racers is a priority for racers participating in
                        LSERSA races, so please take the time to read the <a target="_download"
                            href="/resources/guidance/if_in_doubt_sit_them_out.pdf">guidance</a> but more
                        importantly adhere to the minimum 21 day exclusion period recommended. The
                        severity of a concussion injury should not be underestimated and it is
                        important individuals, parents, schools and clubs work together to ensure
                        guidance is followed.</p>
                </div>
            
                <div className="row">
                    <br />
                    <h2>Equipment Requirements</h2>
                    <p>Please note that minimum appropriate equipment and clothing rules apply at LSERSA
                        races. You must wear suitable protection for your arms and legs including long
                        trousers, long sleeve shirt, which must cover the midriff, and gloves. Helmets
                        must be worn, and these must comply as a minimum to EN1077 (with a visible
                        marking as such) and be in good condition without signs of damage. Add-on items
                        such as camera mounts, or protruding edges, spoilers or visors are not permitted.
                        LSERSA advise the use of the manufacturers' approved chin guard when racing
                        through full gates. Ski poles with a diameter of less than 15mm must be fitted
                        with suitable tip protectors to increase the tip diameter to 15mm. These
                        requirements are compulsory for all racers in all groups.</p>
                    <p>The protective qualities of all safety helmets and face guards are affected by
                        age and use. Some older helmets and face guards that have been damaged either in
                        racing by a fall or by other impact may no longer provide sufficient protection
                        — even if there are no visible indications of damage. LSERSA neither specifies
                        nor makes warranties as to the fitness for use of any particular ski helmet or
                        face guard nor assumes any responsibilities or duties to any competitor by
                        requiring the use of a helmet or face guard. For more information see{' '}
                        <a href="http://www.gbski.com/docstore/OTHER/Helmets%20for%20Alpine%20Ski%20Racing%20V6.pdf"
                            target="_rules">The British Ski and Snowboard Guide to Helmets for Alpine Racing</a>.</p>

                    <br />
                    <div id="previous-years" className="tablet-down">
                        <hr />
                        <h2 className="as-h3">Links to other years' results</h2>
                        <RaceYearList year={raceData[0].year} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default RacesPage

export const Head = () => (
    <HeaderComponent>
        <title>{raceData[0].year} Races | LSERSA</title>)
    </HeaderComponent>
);