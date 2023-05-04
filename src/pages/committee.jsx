import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";

const CommitteePage = () => {
    return (
        <Layout>
            <div className="container">
                <Hero
                    text="COMMITTEE"
                    imageUrl="hero/trophies.png"
                    imageAlt="End of year trophies"
                />
                <div className="row">
                    <h1>Committee</h1>
                    <p>A page</p>
                </div>
            </div>
        </Layout>
    )
}

export default CommitteePage

export const Head = () => (
    <HeaderComponent>
        <title>Committee | LSERSA</title>
    </HeaderComponent>
);