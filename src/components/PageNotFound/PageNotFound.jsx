import React from "react";
import { Component } from "react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import PropTypes from "prop-types";
import { Container } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import "./PageNotFound.css";

export default class PageNotFound extends Component {
    static propTypes = {
        "match": PropTypes.object.isRequired,
        "location": PropTypes.object.isRequired,
        "history": PropTypes.object.isRequired
    };
    
    constructor(props) {
        super(props);
        this.handleHome = this.handleHome.bind(this);
    }

    handleHome(e) {
        e.preventDefault();
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="PageNotFound">
                <BarreDuHautAvecLaBareDeRecherche />
                <Container text textAlign="center" className="PageNotFound-content">
                    <Icon name="map outline" size="huge"></Icon>
                    <Header as="h2">Erreur, cette page est introuvable</Header>
                    <Divider horizontal></Divider>
                    <Button primary size="large" onClick={this.handleHome}><Icon name="home"></Icon> Revenir à la page d'accueil</Button>
                </Container>
                <Segment inverted vertical color="grey" className="PageNotFound-footer">
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
