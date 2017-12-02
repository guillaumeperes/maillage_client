import React from "react";
import { Component } from "react";
import { Divider } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Responsive } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import "./RegisterPage.css";

export default class RegisterModal extends Component {
    constructor(props) {
        super(props);
        document.title = "Inscription | Le château fort";
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("inscription");
    }

    render() {
        return (
            <div className="LoginPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <Segment vertical className="RegisterPage-content">
                    <Container text>
                        <Header as="h1">
                            <Icon name="sign in" />
                            <Header.Content>
                                Inscription
                                <Header.Subheader>Créez votre compte utilisateur et partagez vos fichiers de maillage</Header.Subheader>
                            </Header.Content>
                        </Header>
                        <Divider hidden />
                        <Form>
                            <Form.Field>
                                <label>Nom</label>
                                <input name="lastname" type="text"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Prénom</label>
                                <input name="firstname" type="text"/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Adresse e-mail</label>
                                <input name="email" type="email"/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Mot de passe</label>
                                <input name="password" type="password"/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Confirmez votre mot de passe</label>
                                <input name="password" type="password"/>
                            </Form.Field>
                            <Divider hidden />
                            <Responsive maxWidth={768}>
                                <Button primary fluid onClick={this.handleSubmit}>Inscription</Button>
                            </Responsive>
                            <Responsive minWidth={769}>
                                <Container textAlign="right">
                                    <Button primary onClick={this.handleSubmit}>Inscription</Button>
                                </Container>
                            </Responsive>
                        </Form>
                    </Container>
                </Segment>
            </div>
        );
    }
}
