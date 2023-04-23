import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import raceData from '../data/races.yaml';
import RaceTable from "../components/races/RaceTable.jsx";
import RaceYearList from "../components/races/RaceYearList.jsx";
import DownloadItem from "../components/DownloadItem.jsx";

const RacesPage = () => {
    return (
        <Layout>
            <Hero
                text="RACES"
                text2={raceData[0].year}
                imageUrl="hero/trophies.png"
                imageAlt="End of year trophies"
            />
            <div className="row">

                <div className="right-column-race">
                    <h2 className="as-h3" style={{ textAlign: "center" }}>Archives</h2>
                    <div style={{ width: "150px", margin: "auto" }}>
                        <RaceYearList year={raceData[0].year} />
                    </div>
                </div>

                <h1>{raceData[0].year} Race Season</h1>

                <h2>Race Calendar</h2>
                <div>
                    <div className="table-responsive-container left-column">
                        <RaceTable data={raceData[0]} />
                    </div>
                </div>

                <br />
                <hr />
                <h2>LSERSA Summer Series</h2>
                <p>We use <a href="https://skiresults.co.uk/" offsite="_results">Ski Results</a> for
                    race entry as well as our results.</p>

                <div className="advice-box">
                    <p>Race entries close at 7pm on the Wednesday prior to race day so please ensure
                        you complete your entry before this deadline to avoid disappointment.</p>
                    <p>Race entries may stay open for a limited time after this at an additional fee
                        dependent on numbers, but this is solely at the discretion of the committee
                        and once entries are finally closed, no more racers will be accepted.</p>
                </div>

                <p>LSRESA runs a summer series each year. Race format is:</p>
                <ul>
                    <li>three individual slalom runs</li>
                    <li>three individual head-to-head dual slaloms</li>
                    <li>club- and fun-team dual slaloms</li>
                </ul>
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
                <div>
                    <DownloadItem filelink="/race_rules_2023.pdf" filename="LSERSA race rules" filetype="PDF" />
                </div>

                <br />
                <hr />
                <h2>Personal Conduct</h2>
                <p>We wish to remind all racers, coaches, parents and spectators that appropriate
                    personal conduct is expected at all LSERSA events. Whilst a competitive
                    atmosphere is to be encouraged, inappropriate or unsportsmanlike behaviour will
                    not be tolerated and can ultimately lead to sanctions, including suspension from
                    LSERSA events. Examples of such behaviour include: equipment abuse, swearing,
                    aggressive behaviour, discrimination of any form, heated arguments, disrespect
                    shown to any official or volunteer. All LSERSA events are "family friendly"
                    environments with appropriate behaviour to be demonstrated at all times.</p>

                <br />
                <hr />
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
                <div className="tablet-down">
                    <hr />
                    <h2 className="as-h3">Links to other years' results</h2>
                    <RaceYearList year={raceData[0].year} />
                </div>
            </div>
        </Layout>
    )
}

export default RacesPage

export const Head = () => <title>{raceData[0].year} Races | LSERSA</title>