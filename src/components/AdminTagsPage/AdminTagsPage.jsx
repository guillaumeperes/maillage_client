import React from "react";
import { Component } from "react";
import { Icon } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Scrollbars } from "react-custom-scrollbars";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import "./AdminTagsPage.css";

export default class AdminTagsPage extends Component {
    constructor(props) {
        super(props);
        document.title = "Gestion des tags | Le château fort";
        this.state = {
            "isLoading": true,
            "categories": [],
            "selectedCategory": null
        };
    }

    componentDidMount() {
        const self = this;
        const route = baseApiUrl + "/categories/allTags/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "categories": response.data,
                "selectedCategory": null
            });
        }).catch(function(error) {
            self.setState({
                "isLoading": false,
                "categories": [],
                "selectedCategory": null
            });
        });
    }

    renderCategories() {
        if (this.state.isLoading) {
            return (
                <div className="AdminTagsPage-loader">
                    <Dimmer.Dimmable as="div">
                        <Dimmer active inverted>
                            <Loader size="small" inverted>Chargement en cours</Loader>
                        </Dimmer>
                    </Dimmer.Dimmable>
                </div>
            );
        } else if (this.state.categories.length !== 0) {
            return <div className="AdminTagsPage-empty">Aucune catégorie n'est disponnible.</div>;
        } else {
            return (
                <Scrollbars style={{ width: "100%", height: "calc(100% - 100px)" }}>
                    <div className="AdminTagsPage-list">
                    
                    </div>
                </Scrollbars>
            );
        }
    }

    render() {
        return (
            <div className="AdminTagsPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <div className="AdminTagsPage-categories">
                    <div className="AdminTagsPage-title"><Icon name="tags" size="large" />Gestion des tags</div>
                    { this.renderCategories() }
                </div>
                <div className="AdminTagsPage-tags">
                    
                </div>
            </div>
        );
    }
}
