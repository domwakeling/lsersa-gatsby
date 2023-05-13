import React from "react";
import Layout from "../../components/Layout";

const ValidateUser = ({params}) => {
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1 className="underlined">Complete Sign Up</h1>

                    <p><i>content to be added</i></p>
                    <p>{params.token}</p>

                </div>
            </div>
        </Layout>
    )
}

export default ValidateUser;