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
import { Message } from "semantic-ui-react";
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
        window.scrollTo(0, 0);
        document.title = "Connexion | Le château fort";
        this.state = {
            "data": {},
            "errors": {}
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
        const data = this.state.data;

        // Validation des données

        let errors = {};
        if (data.email == null || !data.email.length || !validator.validate(data.email)) {
            errors.email = "Merci de renseigner votre adresse e-mail.";
        }
        if (data.password == null || !data.password.length) {
            errors.password = "Merci de renseigner votre mot de passe.";
        }
        this.setState(Object.assign({}, this.state, {
            "errors": errors
        }));
        if (Object.keys(errors).length > 0) {
            return;
        }

        // Envoi des données à l'API pour authentification

        const self = this;
        const route = baseApiUrl + "/login";
        axios.post(route, data).then(function(tokenResult) {
            // User roles
            const rolesRoutes = baseApiUrl + "/user/roles/?token=" + tokenResult.data.data.token;
            axios.get(rolesRoutes).then(function(rolesResult) {
                // User token va dans le store
                self.props.setUserTokenOnStore(tokenResult.data.data.token);
                // User token va aussi dans un cookie
                let expire = new Date();
                expire.setTime(tokenResult.data.data.expiresAt * 1000); // on prend la date d'expiration du token fournie par l'api
                self.props.cookies.set("maillage_userToken", tokenResult.data.data.token, {
                    "path": "/",
                    "expires": expire
                });
                // Format des rôles
                const roles = rolesResult.data.map(function(role) {
                    return role.name;
                });
                self.props.setUserRolesOnStore(roles);
                toast.success(rolesResult.data.message); 
                self.props.history.push("/");
            }).catch(function(error) {
                self.props.removeUserTokenOnStore();
                self.props.removeUserRolesOnStore();
                if (error.response !== null) {
                    errors.general = error.response.data.error;
                    self.setState(Object.assign({}, self.state, {
                        "errors": errors
                    }));
                    return;
                } else {
                    self.throwSweetError("Une erreur s'est produite.");
                    return;
                }
            });
        }).catch(function(error) {
            self.props.removeUserTokenOnStore();
            self.props.removeUserRolesOnStore();
            if (error.response !== null) {
                errors.general = error.response.data.error;
                self.setState(Object.assign({}, self.state, {
                    "errors": errors
                }));
                return;
            } else {
                self.throwSweetError("Une erreur s'est produite.");
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
        this.props.history.push("/register");
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
                            <Form error={Object.keys(this.state.errors).length > 0}>
                                {this.state.errors.general != null ? <Message error header="Erreur" content={this.state.errors.general} /> : <Message error header="Erreur" content="Il y a des erreurs dans le formulaire !" />}
                                <Form.Field required error={this.state.errors.email != null || this.state.errors.general != null}>
                                    <label>Adresse e-mail</label>
                                    <Input name="email" type="email" placeholder="Votre adresse e-mail" onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
                                    {this.state.errors.email != null ? <Message error size="tiny" content={this.state.errors.email} /> : null}
                                </Form.Field>
                                <Form.Field required error={this.state.errors.password != null || this.state.errors.general != null}>
                                    <label>Mot de passe</label>
                                    <Input name="password" type="password" placeholder="Votre mot de passe" onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
                                    {this.state.errors.password != null ? <Message error size="tiny" content={this.state.errors.password} /> : null}
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
