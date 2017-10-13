import React from "react";
import { Component } from "react";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        document.title = "Le château fort - Gestion de fichiers de maillage";
    }

    render() {
        return (
            <p>Hello World!</p>
        );
    }
}
