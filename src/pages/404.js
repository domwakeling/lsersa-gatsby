import * as React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import HeaderComponent from "../components/head/HeaderComponent.jsx";

const NotFoundPage = () => {
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1>Page not found</h1>
                    <p>Sorry 😔, we couldn’t find what you were looking for.</p>
                    <p>
                        <Link to="/">Go home</Link>.
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default NotFoundPage

export const Head = () => (
    <HeaderComponent>
        <title>Not found</title>
    </HeaderComponent>
);