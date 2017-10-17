import React from "react";
import { Component } from "react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche"
import NouveauMaillage from "../NouveauMaillage/NouveauMaillage"


export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        document.title = "Le château fort - Gestion de fichiers de maillage";
    }

    render() {
        return (
            <div> 
            <NouveauMaillage></NouveauMaillage>
            <BarreDuHautAvecLaBareDeRecherche></BarreDuHautAvecLaBareDeRecherche>
            <p>Hello World!</p>
            </div>
        );
    }
}
