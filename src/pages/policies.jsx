import React from "react"
import Layout from "../components/Layout.jsx";
import Hero from "../components/Hero.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";
import policiesData from '../data/policies.yaml';
import PolicyTable from "../components/policies/PolicyTable.jsx";

const PoliciesPage = () => {

    return (
        <Layout>
            <div className="container">
                <Hero
                    text="REGIONAL"
                    text2="POLICIES"
                    imageUrl="hero/hero_clubs.png"
                    imageAlt="Regional Policies"
                />
                <div className="row">
                    <h1>Policies</h1>
                    <p>The following is a partial list of the region's policies. These are in the
                        process of being updated and will be added to as they become available.</p>
                    <div className="table-responsive-container">
                        <PolicyTable data={policiesData} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PoliciesPage

export const Head = () => (
    <HeaderComponent>
        <title>Policies | LSERSA</title>
    </HeaderComponent>
);