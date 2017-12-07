import React from "react";
import { Component } from "react";
import { Icon } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Responsive } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import "./AdminCategoriesPage.css";

export default class AdminCategoriesPage extends Component {
    constructor(props) {
        super(props);
        document.title = "Gestion des catégories | Le château fort";
        this.state = {
            "isLoading": true,
            "categories": []
        };
        this.handleNewCategory = this.handleNewCategory.bind(this);
    }

    componentDidMount() {
        const self = this;
        const route = baseApiUrl + "/categories/allTags/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "categories": []
            });
        }).catch(function(error) {
            self.setState({
                "isLoading": false,
                "categories": []
            });
        });
    }

    handleNewCategory(e) {
        console.log("new category");
    }

    render() {
        let content = '';
        if (this.state.isLoading) {
            content = (
                <Dimmer.Dimmable as="div" className="AdminCategoriesPage-loader">
                    <Dimmer active inverted>
                        <Loader size="medium" inverted>Chargement en cours</Loader>
                    </Dimmer>
                </Dimmer.Dimmable>
            );
        } else if (this.state.categories.length === 0) {
            content = (
                <Container fluid textAlign="center">
                    <Icon name="search" size="huge" color="grey" />
                    <div>Aucune catégorie trouvée.</div>
                </Container>
            );
        } else {

        }

        return (
            <div className="AdminCategoriesPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <Container className="AdminCategoriesPage-content">
                    <Header as="h1">
                        <Icon name="tags" />
                        <Header.Content>
                            Gestion des catégories
                            <Header.Subheader>Administration des catégories et de leurs tags associés.</Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Divider hidden />
                    <Responsive maxWidth={768}>
                        <Button primary fluid icon="plus" content="Ajouter une catégorie" labelPosition="left" onClick={this.handleNewCategory} />
                    </Responsive>
                    <Responsive minWidth={769}>
                        <Container fluid textAlign="right">
                            <Button primary icon="plus" content="Ajouter une catégorie" labelPosition="left" onClick={this.handleNewCategory} />
                        </Container>
                    </Responsive>
                    <Divider hidden />
                    {content}
                </Container>
                <Divider clearing fitted hidden />
                <Segment inverted vertical color="grey" className="AdminCategoriesPage-footer">
                    <Container>
                        <Grid stackable columns={2}>
                            <Grid.Row>
                                <Grid.Column width={6}>
                                    <Header as="h4" inverted>Le château fort</Header>
                                    <List inverted link>
                                        <List.Item as="a" href="https://github.com/guillaumeperes/maillage_client" title="Consulter le code source sur Github" target="_blank"><Icon name="code" /> Code source</List.Item>
                                        <List.Item as="a" href="https://github.com/guillaumeperes/maillage_api" title="Utiliser l'API" target="_blank"><Icon name="database" /> API</List.Item>
                                        <List.Item as="a" href="#" target="_blank" title="Contact"><Icon name="mail outline" /> Contact</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Header as="h4" inverted>À propos</Header>
                                    <p>Application développée par Sarah Pierson et Guillaume Peres</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Segment>
            </div>
        );
    }
}
