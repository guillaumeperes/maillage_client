import React from "react";
import { Component } from "react";
import { Header } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Responsive } from "semantic-ui-react";
import { baseApiUrl } from "../../conf";
import swal from "sweetalert";
import validator from "email-validator";
import axios from "axios";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setUserToken } from "../../actions.js";
import { removeUserToken } from "../../actions.js";
import { setUserRoles } from "../../actions.js";
import { removeUserRoles } from "../../actions.js";
import { withCookies } from "react-cookie";
import { toast } from "react-toastify";
import "./LoginPage.css";

class LoginPage extends Component {
    static propTypes = {
        "match": PropTypes.object.isRequired,
        "location": PropTypes.object.isRequired,
        "history": PropTypes.object.isRequired,
        "cookies": PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        document.title = "Connexion | Le château fort";
        this.state = {
            "data": {}
        };
        this.handleFormData = this.handleFormData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
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

    handleFormData(e, data) {
        let o = {};
        o[data.name] = data.value;
        const state = Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, o)
        });
        this.setState(state);
    }

    handleSubmit(e) {
        if (e.type === "keypress" && e.key !== "Enter") {
            return;
        }

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

        // Envoi des données à l'API pour authentification
        const route = baseApiUrl + "/login";
        axios.post(route, data).then(function(result) {
            // User token va dans le store
            self.props.setUserTokenOnStore(result.data.data.token); 
            // User token va aussi dans un cookie
            let expire = new Date();
            expire.setTime(result.data.data.expiresAt * 1000); // on prend la date d'expiration du token fournie par l'api
            self.props.cookies.set("maillage_userToken", result.data.data.token, {
                "path": "/",
                "expires": expire
            });
            
            // User roles
            const rolesRoutes = baseApiUrl + "/user/roles/?token=" + result.data.data.token;
            axios.get(rolesRoutes).then(function(result) {
                const roles = result.data.map(function(role) {
                    return role.name;
                });
                self.props.setUserRolesOnStore(roles);
                toast.success(result.data.message); 
                self.props.history.push("/");
            }).catch(function(error) {
                self.props.removeUserTokenOnStore();
                self.props.removeUserRolesOnStore();
                if (typeof error.response.data.error === "string") {
                    self.throwSweetError(error.response.data.error);
                    return;
                } else {
                    self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                    return;
                }
            });
        }).catch(function(error) {
            self.props.removeUserTokenOnStore();
            self.props.removeUserRolesOnStore();
            if (typeof error.response.data.error === "string") {
                self.throwSweetError(error.response.data.error);
                return;
            } else {
                self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                return;
            }
        });
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
                <Container className="LoginPage-content">
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
                                    <Input name="email" type="email" onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Mot de passe</label>
                                    <Input name="password" type="password" onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
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
                <Segment inverted vertical color="grey" className="LoginPage-footer">
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

const mapStoreToProps = function(store) {
    return {
        "userToken": store.users.userToken
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        "setUserTokenOnStore": function(token) {
            dispatch(setUserToken(token));
        },
        "setUserRolesOnStore": function(roles) {
            dispatch(setUserRoles(roles));
        },
        "removeUserTokenOnStore": function() {
            dispatch(removeUserToken());
        },
        "removeUserRolesOnStore": function() {
            dispatch(removeUserRoles());
        }
    };
};

LoginPage = connect(mapStoreToProps, mapDispatchToProps)(LoginPage);
LoginPage = withCookies(LoginPage);
LoginPage = withRouter(LoginPage);
export default LoginPage;
