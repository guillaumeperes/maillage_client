import React from "react";
import { Component } from "react";
import { Divider } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Responsive } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import swal from "sweetalert";
import validator from "email-validator";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "./RegisterPage.css";

class RegisterPage extends Component {
    static propTypes = {
        "match": PropTypes.object.isRequired,
        "location": PropTypes.object.isRequired,
        "history": PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            "data": {}
        };
        document.title = "Inscription | Le château fort";
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormData = this.handleFormData.bind(this);
    }

    throwSweetError(message) {
        swal({
            "title": "Erreur",
            "text": message,
            "dangerMode": true,
            "icon": "error",
            "button": "Fermer"
        }).catch(swal.noop);
    }

    handleSubmit(e) {
        const self = this;
        const data = self.state.data;

        // Vérification des champs
        if (data.email == null || !data.email.length || !validator.validate(data.email)) {
            self.throwSweetError("Merci de renseigner une adresse e-mail valide.");
            return;
        }
        if (data.password == null || !data.password.length) {
            self.throwSweetError("Merci de renseigner votre mot de passe.");
            return;
        }
        if (data.password.length < 5) {
            self.throwSweetError("Votre mot de passe doit comporter au moins 5 caractères.");
            return;
        }
        if (data.password2 == null || !data.password2.length) {
            self.throwSweetError("Merci de confirmer votre mot de passe.");
            return;
        }
        if (data.password !== data.password2) {
            self.throwSweetError("Votre mot de passe et sa confirmation doivent être identiques.");
            return;
        }

        // Envoi des données au serveur
        const route = baseApiUrl + "/register";
        axios.post(route, data).then(function(result) {
            swal({
                "title": "Bravo !",
                "text": "Votre compte a été enregistré avec succès. Vous pourrez vous connecter lorsque ce dernier aura été validé par un administrateur du site.",
                "icon": "success",
                "button": "Fermer"
            }).then(function() {
                self.props.history.push("/");
                return;
            });
        }).catch(function(error) {
            if (typeof error.response.data.error === "string") {
                self.throwSweetError(error.response.data.error);
            } else {
                self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
            }
        });
    }

    handleFormData(e, data) {
        let o = {};
        o[data.name] = data.value;
        const state = Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, o)
        });
        this.setState(state);
    }

    render() {
        return (
            <div className="RegisterPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <Container className="RegisterPage-content">
                    <Header as="h1">
                        <Icon name="sign in" />
                        <Header.Content>
                            Inscription
                            <Header.Subheader>Créez votre compte utilisateur et partagez vos fichiers de maillage</Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Divider hidden />
                    <Grid stackable>
                        <Grid.Column width={10}>
                            <Header dividing size="small" as="h2">Vos informations</Header>
                            <p>Merci de compléter le formulaire suivant pour demander la création de votre compte.</p>
                            <Divider hidden />
                            <Form>
                                <Form.Field>
                                    <label>Nom</label>
                                    <Input name="lastname" type="text" onChange={this.handleFormData} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Prénom</label>
                                    <Input name="firstname" type="text" onChange={this.handleFormData} />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Adresse e-mail</label>
                                    <Input name="email" type="email" onChange={this.handleFormData} />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Mot de passe</label>
                                    <Input name="password" type="password" onChange={this.handleFormData} />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Confirmez votre mot de passe</label>
                                    <Input name="password2" type="password" onChange={this.handleFormData} />
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
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header dividing size="small" as="h2">Votre adresse e-mail</Header>
                            <p>Les notifications et autres informations importantes seront envoyées à cette adresse e-mail. Veillez à faire en sorte que cette adresse soit valide et fonctionnelle.</p>
                            <Divider hidden />
                            <Header dividing size="small" as="h2">Votre mot de passe</Header>
                            <p>Votre mot de passe doit comporter au moins 5 caractères. Vous aurez ensuite la possibilité de le modifier dans les paramètres de votre compte.</p>
                            <Divider hidden />
                            <Header dividing size="small" as="h2">Votre compte</Header>
                            <p>Une fois votre inscription terminée, votre compte devra être validé par un administrateur du site.</p>
                            <p>Votre compte vous permettra alors de partager de nouveaux fichiers de maillage sur le site et de modifier les contenus déjà existants.</p>
                        </Grid.Column>
                    </Grid>
                </Container>
                <Segment inverted vertical color="grey" className="RegisterPage-footer">
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

RegisterPage = withRouter(RegisterPage);
export default RegisterPage;
