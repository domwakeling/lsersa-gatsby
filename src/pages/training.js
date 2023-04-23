import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";

const TrainingPage = () => {
    return (
        <Layout>
            <Hero
                text="Training"
                imageUrl="hero/trophies.png"
                imageAlt="End of year trophies"
            />
            <div className="row">
                <h1>Training</h1>
                <p>A page</p>
            </div>
        </Layout>
    )
}

export default TrainingPage

export const Head = () => <title>Training | LSERSA</title>