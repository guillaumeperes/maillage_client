import React from "react";
import { Component } from "react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche"
import NouveauMaillage from "../NouveauMaillage/NouveauMaillage"
import TagsSidebar from "../TagsSidebar/TagsSidebar";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        document.title = "Le château fort - Gestion de fichiers de maillage";
    }
    
    render() {
        return (
            <div className="HomePage">
                <BarreDuHautAvecLaBareDeRecherche />
                <TagsSidebar />
            </div>
        );
    }
}
