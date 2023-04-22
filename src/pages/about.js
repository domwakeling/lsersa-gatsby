import React from "react"
import Layout from "../components/Layout.jsx";


const AboutPage = () => {
    return (
        <Layout>
            <div className="row">
                <h1>About</h1>
                <p>A page</p>
            </div>
        </Layout>
    )
}

export default AboutPage

export const Head = () => <title>About | LSERSA</title>