import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";

const RacesPage = () => {
    return (
        <Layout>
            <Hero
                text="RACES"
                text2="2023"
                imageUrl="hero/trophies.png"
                imageAlt="End of year trophies"
            />
            <div className="row">
                <h1>Races</h1>
                <p>A page</p>
            </div>
        </Layout>
    )
}

export default RacesPage

export const Head = () => <title>Races | LSERSA</title>