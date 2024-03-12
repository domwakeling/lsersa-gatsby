import React from "react"
import Layout from "../components/Layout.jsx";
import { Link } from "gatsby";
import Hero from "../components/Hero.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import pointsData from '../data/training.yaml';

const LatestTrainingSession = ({ data }) => {
    return (
        <table>
            <tbody>
                <tr>
                    <td className="subtitle" style={{ minWidth: "160px" }}>Overall</td>
                    <td style={{ minWidth: "160px" }}>
                        <a className="race-link" href={data.overall} target="_offsite">Standings</a>
                    </td>
                </tr>
                {
                    data.months && data.months.length > 0 && data.months.map(month => (
                        <tr>
                            <td style={{ minWidth: "160px" }}>{month.name}</td>
                            <td style={{ minWidth: "160px" }}>
                                <a className="race-link" href={month.link} target="_offsite">Result</a>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>

    )
}


const TrainingTableRow = ({ item, idx }) => {
    return (
        <>
            { idx > 0 ? (
                <tr>
                    <td style={{ minWidth: "160px" }}>{item.year}</td>
                    <td style={{ minWidth: "160px" }}>
                        <a className="race-link" href={item.overall} target="_offsite">Standings</a>
                    </td>
                </tr>
            ) : (
                ''
            )}
        </>
    )
}


const TrainingPage = () => {
    return (
        <Layout>
            <div className="container">
                <Hero
                    text="TRAINING"
                    imageUrl="hero/inter_regional.png"
                    imageAlt="LSERSA team at Inter-Regionals"
                />
                <div className="row">
                    <h1>Regional Slalom Training</h1>

                    <div className="advice-box">
                        <p>Regional Race Training for slalom is held at Chatham on Saturday mornings,
                            9&mdash;11am. Sessions are open to racers of all levels.</p>
                    </div>

                    <p>The sessions are run by our experienced team of coaches, led by Andrew Atkinson
                        and Jim Gibb, and are &pound;22 per racer. Training covers technique, race
                        tactics, skills and drills, and includes stubby and full gate courses.</p>
                    <p>Please join the LSERSA facebook group to get regular updates, and email <a
                        href="mailto:regionalcoach@lsersa.org">Andy Atkinson</a> (Head Coach) for
                        more information. Alternatively you can request a user account on the
                        {" "}
                        <Link to="/booking">
                            booking system
                        </Link>
                        {" "}
                        .</p>
                </div>
            </div>

            <div className="banner col-p900 bg-p300">
                <div className="container">
                    <div className="row">
                        <h2>Everyone Welcome</h2>
                        <p>The regional training sessions are open to all skiers. You will need to
                            be a member of a Snowsport England affiliated race club, but you can
                            come for some taster sessions if you haven't officially joined a club yet. 
                            We cater for a wide range of abilities, the only stipulations being:</p>
                        <ul>
                            <li>racers should wear appropriate clothing and protective equipment</li>
                            <li>racers need to be able to perform controlled rounded turns from anywhere
                                on the slope</li>
                            <li>racers need to able to use the lifts unaided</li>
                            <li>racer/parents/guardians should be aware that, although we run our
                                sessions with safety as our first priority, participants will be
                                skiing through slalom gates which does involve an additional element
                                of risk over and above free skiing</li>
                        </ul>
                        <p>So if you want to try ski racing, but are unsure of your ability level, this is
                            the perfect session to give it a go. Our coaches are very supportive of new
                            trainees and will make sure you can progress at your own pace. If you are still
                            unsure, why not come along to a session just to watch and then have a chat with
                            the coaches afterwards.</p>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <br/>
                    <h2>Winter Training Competition</h2>
                    <p>We hold a competition over the winter, with one training session each month
                        (from November to March/April) being timed. Time and cost of the training
                        session are unchanged.</p>
                    <p>On competition Saturdays there is a brief warm up period and then Stubbie and
                        Full gate courses are set; skiers can attempt up to 4 timed runs, with the
                        fastest run to count. If there is time at the end of the 4 runs, the course
                        will be left for skiers to run for fun until the end of the session. Points
                        are awarded for each session based on skier's ranking order in their age
                        group, which are Male/Female "senior" racer (U14 and above) and Male/Female
                        "junior" racer (U12 and below).</p>
                    <p>Age groups are based on age at the start of the competition &mdash; so a racer
                        moving into U14 in January will be taking part in the "junior" competition
                        for the whole season. Any such racer may make one or more of their timed
                        runs through Full gates if they wish (so long as they have appropriate
                        equipment) but their times will count towards the U12 competition only.</p>
                    <p>Overall points for the season will be determined by a racer's 4 best
                        results, and 3 sessions must be attended to post an overall score and to be
                        eligible for the overall trophies.</p>
                </div>

                <h3>{pointsData[0].year} Season</h3>
                <LatestTrainingSession data={pointsData[0]} />

                <br />

                <h3>Previous Seasons</h3>
                <table>
                    <tbody>
                        {
                            pointsData.map((item, idx_i) => (
                                <TrainingTableRow key={idx_i} item={item} idx={idx_i} />
                            ))
                        }
                    </tbody>
                </table>

            </div>

        </Layout>
    )
}

export default TrainingPage

export const Head = () => (
    <HeaderComponent>
        <title>Training | LSERSA</title>
    </HeaderComponent>
);
