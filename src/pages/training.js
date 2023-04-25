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
                    imageUrl="hero/trophies.png"
                    imageAlt="End of year trophies"
                />
                <div className="row">
                    <h1>Training</h1>
                    <p>A page</p>
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