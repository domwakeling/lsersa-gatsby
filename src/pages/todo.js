import React from "react"
import Layout from "../components/Layout.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";

const ToDoPage = () => {
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1>ToDo</h1>
                    <p>Outstanding actions</p>
                    <ul>
                        <li>Add booking system!</li>
                        <li>Sort out sponsor carousel</li>
                        <li>Do we add slopes in the same way as clubs?</li>
                        <li>Someone else needs to read the copy for all the clubs</li>
                        <li>Training page</li>
                        <li>What training is organised, other than slalom?</li>
                        <li>Add committee, meeting minutes, historical etc</li>
                        <li>Race results 2008 through 2014 ...</li>
                        <li>Kent schools? Results ... starting 2002, not sure when until (link to results on SkiResults?)</li>
                        <li>London schools? Results ...</li>
                        <li>Confirm race rules policy is OK</li>
                        <li>Any other policies or documents we should add?</li>
                        <li>Can the winter training competition be added? And past years?</li>
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default ToDoPage

export const Head = () => (
    <HeaderComponent>
        <title>ToDo | LSERSA</title>
    </HeaderComponent>
);