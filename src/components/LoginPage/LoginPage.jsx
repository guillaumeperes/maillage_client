import React from "react";
import { Component } from "react";
import { Header } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Responsive } from "semantic-ui-react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "./LoginPage.css";

class LoginPage extends Component {
    static propTypes = {
        "match": PropTypes.object.isRequired,
        "location": PropTypes.object.isRequired,
        "history": PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        document.title = "Connexion | Le château fort";
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("connetion");
    }

    handlePassword(e) {
        e.preventDefault();
        console.log("password");
    }

    handleRegister(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/register") {
            this.props.history.push("/register");
        }
    }

    render() {
        return (
            <div className="LoginPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <Segment vertical className="LoginPage-content">
                    <Container>
                        <Header as="h1">
                            <Icon name="user" />
                            <Header.Content>
                                Connexion
                                <Header.Subheader>Pour continuer, connectez-vous à votre compte utilisateur.</Header.Subheader>
                            </Header.Content>
                        </Header>
                        <Divider hidden />
                        <Grid stackable>
                            <Grid.Column width={10}>
                                <Header dividing size="small" as="h2">Vous avez un compte</Header>
                                <p>Utilisez le formulaire ci-dessous pour vous connecter.</p>
                                <Form>
                                    <Form.Field required>
                                        <label>Adresse e-mail</label>
                                        <input name="email" type="email"/>
                                    </Form.Field>
                                    <Form.Field required>
                                        <label>Mot de passe</label>
                                        <input name="password" type="password"/>
                                    </Form.Field>
                                    <Divider hidden />
                                    <Responsive maxWidth={768}>
                                        <Button primary fluid onClick={this.handleSubmit}>Connexion</Button>
                                        <Divider hidden />
                                        <Button basic fluid onClick={this.handlePassword}>Mot de passe oublié ?</Button>
                                    </Responsive>
                                    <Responsive minWidth={769}>
                                        <Container textAlign="right">
                                            <Button basic data-tooltip="Vous avez oublié votre mot de passe ?" onClick={this.handlePassword}>Mot de passe oublié ?</Button>
                                            <Button primary onClick={this.handleSubmit}>Connexion</Button>
                                        </Container>
                                    </Responsive>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <Header dividing size="small" as="h2">Vous n'avez pas de compte</Header>
                                <p>Si vous ne possédez pas encore de compte, vous avez la possibilié de vous inscrire.</p>
                                <p>Ceci vous permettra de proposer l'ajout de nouveaux fichiers de maillage et de modifier les contenus déjà existants sur le site.</p>
                                <Divider hidden />
                                <Responsive maxWidth={768}>
                                    <Button primary fluid onClick={this.handleRegister}>Créer votre compte</Button>
                                </Responsive>
                                <Responsive minWidth={769}>
                                    <Button primary onClick={this.handleRegister}>Créer votre compte</Button>
                                </Responsive>
                            </Grid.Column>
                        </Grid>
                    </Container>
                </Segment>
            </div>
        );
    }
}

LoginPage = withRouter(LoginPage);
export default LoginPage;
