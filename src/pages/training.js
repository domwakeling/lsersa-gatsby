import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";

const TrainingPage = () => {
    return (
        <Layout>
            <div className="container">
                <Hero
                    text="TRAINING"
                    imageUrl="hero/inter_regional.png"
                    imageAlt="Training at Chatham"
                />
                <div className="row">
                    <h1>Regional Slalom Training</h1>

                    <div className="advice-box">
                        <p>Regional Race Training for slalom is held at Chatham on Saturday mornings,
                            9&mdash;11am. Sessions are open to racers of all levels.
                        </p>
                    </div>

                    <p>The sessions are run by our experienced team of coaches, led by Andrew Atkinson
                        and Jim Gibb, and are &pound;21 per racer. Training covers technique, race
                        tactics, skills and drills, and includes stubby and full gate courses.</p>

                    <p>Please join the LSERSA facebook group to get regular updates, and email <a
                        href="mailto:regionalcoach@lsersa.org">Andy Atkinson</a> (Head Coach) for
                        more information and to register for session invites and notifications.</p>
                </div>
            </div>

            <div className="banner col-p900 bg-p300">
                <div className="container">
                    <div className="row">
                        <h2>Everyone Welcome</h2>
                        <p>The regional training sessions are open to all skiers, no club affiliation or
                            membership is required. We cater for all skiing abilities, so if you want to
                            try ski racing, but are unsure of your ability level, this is the perfect
                            session to give it a go. Our coaches are very supportive of new trainees and
                            will make sure you can progress at your own pace. If you are still unsure,
                            why not come along to a session just to watch and then have a chat with the
                            coaches afterwards.</p>
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