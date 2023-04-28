import React from "react"
import Layout from "../components/Layout.jsx";
import HeaderComponent from "../components/head/HeaderComponent.jsx";

const ToDoPage = () => {
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <h1>To Do</h1>
                    <p>Outstanding actions</p>
                    <ul>
                        <li><b>Structural/scope</b></li>
                        <li>Sort out sponsor carousel</li>
                        <li>Is this (fairly limited) re-design what people want?!*</li>
                        <br/>
                        <li><b>Someone else's eyes</b></li>
                        <li>Someone else needs to read the copy for all the clubs ...</li>
                        <li>... and the training page (when it's written) ...</li>
                        <li>... and the homepage ...</li>
                        <li>... and the about page ...</li>
                        <br/>                        
                        <li><b>Training page</b></li>
                        <li>Add booking system!</li>
                        <li>What training is organised, other than slalom?</li>
                        <li>Any other policies or documents we should add?</li>
                        <br/>
                        <li><b>The Region</b></li>
                        <li>Add committee, meeting minutes, historical etc</li>
                        <li>Do we add slopes in the same way as clubs?</li>
                        <li>Have a page for "region"? Add more info to "about"?</li>
                        <li>Updated policies or other documents we should add?</li>
                        <br/>
                        <li><b>Races</b></li>
                        <li>Results for CN's, Tri-Regional etc (links or copies)</li>
                        <li>Kent schools? Results ... starting 2002 through 2016 (2017 onwards linking to Precise)</li>
                        <li>London schools? Results ...</li>
                        <li>Surrey schools? Results ... through 2017 (2018 onwards linking to Precise)</li>
                        <li>Confirm race rules policy is OK</li>
                    </ul>
                    <p><i>* if there's a different direction people want to go with the design,
                        I'm more than happy to have a look at it &mdash; but someone will need
                        to mock up a couple pages as a plan first!</i></p>
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