import * as React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import Favicon from "../components/head/Favicon";

const NotFoundPage = () => {
    return (
        <Layout>
            <h1>Page not found</h1>
            <p>Sorry 😔, we couldn’t find what you were looking for.</p>
            <p>
                <Link to="/">Go home</Link>.
            </p>
        </Layout>
    )
}

export default NotFoundPage

export const Head = () => (
    <Favicon>
        <title>Not found</title>
    </Favicon>
);