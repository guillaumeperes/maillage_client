import React from "react";
import { Component } from "react";
import { ToastContainer } from "react-toastify";
import Router from "../Router/Router";

export default class App extends Component {
    render() {
        return (
            <div>
                <ToastContainer autoClose={4000} hideProgressBar={true} />
                <Router />
            </div>
        );
    }
}
