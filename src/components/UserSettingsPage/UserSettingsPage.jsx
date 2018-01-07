import React from "react";
import { Component } from "react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import { Container } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { Responsive } from "semantic-ui-react";
import { Popup } from "semantic-ui-react";
import axios from "axios";
import { baseApiUrl } from "../../conf";
import moment from "moment";
import { connect } from "react-redux";
import swal from "sweetalert";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import validator from "email-validator";
import { removeUserToken } from "../../actions.js";
import { removeUserRoles } from "../../actions.js";
import { toast } from "react-toastify";
import "./UserSettingsPage.css";

class UserSettingsPage extends Component {
    static propTypes = {
        "match": PropTypes.object.isRequired,
        "location": PropTypes.object.isRequired,
        "history": PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "error": false,
            "user": {},
            "data": {},
            "errors": {}
        };
        this.handleSwitchForm = this.handleSwitchForm.bind(this);
        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
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

    loadData() {
        const route = baseApiUrl + "/user/infos/?token=" + this.props.userToken;
        const self = this;

        this.setState(Object.assign({}, this.state, {
            "isLoading": true
        }));
        axios.get(route).then(function(result) {
            if (self.props.location.pathname.replace(/\/$/, "") === "/settings") {
                self.setState(Object.assign({}, self.state, {
                    "isLoading": false,
                    "error": false,
                    "user": result.data,
                }));
            } else if (self.props.location.pathname.replace(/\/$/, "") === "/settings/edit") {
                self.setState(Object.assign({}, self.state, {
                    "isLoading": false,
                    "error": false,
                    "errors": {},
                    "data": {
                        "lastname": result.data.lastname,
                        "firstname": result.data.firstname,
                        "email": result.data.email,
                        "password": "",
                        "password2": ""
                    }
                }));
            }
        }).catch(function(error) {
            self.setState(Object.assign({}, self.state, {
                "isLoading": false,
                "error": true,
                "user": {},
                "data": {}
            }));
            self.throwSweetError("Une erreur s'est produite.");
        });
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        const previousLocation = this.props.location.pathname.replace(/\/$/, "");
        const nextLocation = nextProps.location.pathname.replace(/\/$/, "");
        if (previousLocation !== nextLocation) {
            this.loadData();
        }
    }

    handleSwitchForm(e) {
        if (this.props.location.pathname.replace(/\/$/, "") === "/settings") {
            this.props.history.push("/settings/edit");
        } else if (this.props.location.pathname.replace(/\/$/, "") === "/settings/edit") {
            this.props.history.push("/settings");
        }
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
            errors.email = "Merci de renseigner une adresse e-mail valide.";
        }
        if ((data.password != null && data.password.length) || (data.password2 != null && data.password2.length)) {
            if (data.password == null | !data.password.length) {
                errors.password = "Merci de renseigner votre mot de passe.";
            } else if (data.password.length < 5) {
                errors.password = "Votre mot de passe doit comporter au moins 5 caractères.";
            }
            if (data.password2 == null || !data.password2.length) {
                errors.password2 = "Merci de renseigner la confirmation de votre mot de passe.";
            } else if (data.password !== data.password2) {
                errors.password2 = "Votre mot de passe et sa confirmation doivent être identiques.";
            }
        }
        this.setState(Object.assign({}, this.state, {
            "errors": errors
        }));
        if (Object.keys(errors).length > 0) {
            return;
        }

        // Envoi des données à l'API

        const self = this;
        const route = baseApiUrl + "/user/infos/edit/?token=" + this.props.userToken;
        axios.post(route, data).then(function(result) {
            swal({
                "title": "Bravo !",
                "text": "Vos informations personnelles ont été mises à jour avec succès.",
                "icon": "success",
                "button": "Fermer"
            }).then(function() {
                self.props.history.push("/settings");
                return;
            });
        }).catch(function(error) {
            if (error.response != null) {
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

    handleDeleteAccount() {
        const self = this;
        swal({
            "title": "Attention",
            "text": "Êtes-vous sûr de vouloir effacer votre compte ? Cette action est définitive et irréversible !",
            "icon": "warning",
            "dangerMode": true,
            "buttons": {
                "cancel": "Annuler",
                "delete": "Supprimer"
            }
        }).then(function(value) {
            if (value === "delete") {
                const route = baseApiUrl + "/user/delete/?token=" + self.props.userToken;
                axios.delete(route).then(function(result) {
                    self.props.removeUserTokenOnStore();
                    self.props.removeUserRolesOnStore();
                    toast.success("Votre compte a été effacé avec succès.");
                    self.props.history.push("/");
                }).catch(function(error) {
                    if (error.response != null) {
                        self.throwSweetError(error.response.data.error);
                    } else {
                        self.throwSweetError("Une erreur s'est produite.");
                    }
                });
            }
        });
    }

    render() {
        let content = null;
        if (this.state.isLoading) {
            content = (
                <Dimmer.Dimmable as="div" className="UserSettingsPage-loader">
                    <Dimmer active inverted>
                        <Loader size="medium" inverted>Chargement en cours</Loader>
                    </Dimmer>
                </Dimmer.Dimmable>
            );
        } else if (this.state.error) {
            content = (
                <Container fluid textAlign="center">
                    <Divider hidden /> 
                    <Header icon><Icon name="warning sign" size="huge" color="grey" /> Une erreur s'est produite.</Header>
                </Container>
            );
        } else {
            if (this.props.location.pathname.replace(/\/$/, "") === "/settings") {
                content = (
                    <div>
                        <Header dividing>Vos informations personnelles</Header>
                        <Segment vertical>
                            {this.state.user.lastname != null ? <p><strong>Votre nom : </strong>{this.state.user.lastname}</p> : null }
                            {this.state.user.firstname != null ? <p><strong>Votre prénom : </strong>{this.state.user.firstname}</p> : null }
                            <p><strong>Votre adresse e-mail : </strong>{this.state.user.email}</p>
                            <p><strong>Date de création de votre compte : </strong>{moment(this.state.user.created).format("DD/MM/YYYY - HH:mm:ss")}</p>
                            {this.state.user.updated != null ? <p><strong>Date de dernière mise à jour de votre compte : </strong>{moment(this.state.user.updated).format("DD/MM/YYYY - HH:mm:ss")}</p> : null}
                            <Divider hidden />
                            <Button primary content="Modifier vos informations personnelles" onClick={this.handleSwitchForm} /> 
                            <Popup content="Attention, supprimer votre compte est une action définitive et irréversible !" position="bottom right" size="small" hideOnScroll inverted trigger={<Button negative content="Supprimer votre compte" onClick={this.handleDeleteAccount} />} />
                        </Segment>
                    </div>
                );
            } else if (this.props.location.pathname.replace(/\/$/, "") === "/settings/edit") {
                content = (
                    <Grid stackable>
                        <Grid.Column width={10}>
                            <p>Utilisez ce formulaire pour modifier vos informations personnelles</p>
                            <Divider hidden />
                            <Form error={Object.keys(this.state.errors).length > 0}>
                                {this.state.errors.general != null ? <Message error header="Erreur" content={this.state.errors.general} /> : <Message error header="Erreur" content="Il y a des erreurs dans le formulaire !" />}
                                <Form.Field>
                                    <label>Nom</label>
                                    <Input name="lastname" type="text" placeholder="Votre nom" value={this.state.data.lastname} onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Prénom</label>
                                    <Input name="firstname" type="text" placeholder="Votre prénom" value={this.state.data.firstname} onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
                                </Form.Field>
                                <Form.Field required error={this.state.errors.email != null || this.state.errors.general != null}>
                                    <label>Adresse e-mail</label>
                                    <Input name="email" type="email" placeholder="Votre adresse e-mail" value={this.state.data.email} onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
                                    {this.state.errors.email != null ? <Message error size="tiny" content={this.state.errors.email} /> : null}
                                </Form.Field>
                                <Form.Field error={this.state.errors.password != null || this.state.errors.general != null}>
                                    <label>Mot de passe</label>
                                    <Input name="password" type="password" placeholder="Votre mot de passe (inchangé si laissé vide)" value={this.state.data.password} onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
                                    {this.state.errors.password != null ? <Message error size="tiny" content={this.state.errors.password} /> : null}
                                </Form.Field>
                                <Form.Field error={this.state.errors.password2 != null || this.state.errors.general != null}>
                                    <label>Confirmation du mot de passe</label>
                                    <Input name="password2" type="password" placeholder="Confirmation de votre mot de passe" value={this.state.data.password2} onChange={this.handleFormData} onKeyPress={this.handleSubmit} />
                                    {this.state.errors.password2 != null ? <Message error size="tiny" content={this.state.errors.password2} /> : null}
                                </Form.Field>
                                <Divider hidden />
                                <Responsive maxWidth={768}>
                                    <div>
                                        <Button fluid primary onClick={this.handleSubmit}>Enregistrer</Button>
                                        <Divider hidden />
                                        <Button fluid onClick={this.handleSwitchForm}>Annuler</Button>
                                    </div>
                                </Responsive>
                                <Responsive minWidth={769}>
                                    <Container textAlign="right">
                                        <Button onClick={this.handleSwitchForm}>Annuler</Button>
                                        <Button primary onClick={this.handleSubmit}>Enregistrer</Button>
                                    </Container>
                                </Responsive>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header dividing size="small" as="h2">Votre adresse e-mail</Header>
                            <p>Les notifications et autres informations importantes seront envoyées à cette adresse e-mail. Veillez à faire en sorte que cette adresse soit valide et fonctionnelle.</p>
                            <Divider hidden />
                            <Header dividing size="small" as="h2">Votre mot de passe</Header>
                            <p>Si vous ne souhaitez pas modifier votre mot de passe, vous pouvez laisser son champ vide ainsi que celui de sa confirmation.</p>
                            <p>Votre mot de passe doit comporter au moins 5 caractères. Vous aurez ensuite la possibilité de le modifier dans les paramètres de votre compte.</p>
                        </Grid.Column>
                    </Grid>
                );
            }
        }

        return (
            <div className="UserSettingsPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <Container className="UserSettingsPage-content">
                    <Header as="h1">
                        <Icon name="user outline" />
                        <Header.Content>
                            Votre compte
                            <Header.Subheader>Visualisez et modifiez les données de votre compte.</Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Divider clearing hidden />
                    {content}
                </Container>
                <Segment inverted vertical color="grey" className="UserSettingsPage-footer">
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
        "removeUserTokenOnStore": function() {
            dispatch(removeUserToken());
        },
        "removeUserRolesOnStore": function() {
            dispatch(removeUserRoles());
        }
    }
};

UserSettingsPage = connect(mapStoreToProps, mapDispatchToProps)(UserSettingsPage);
UserSettingsPage = withRouter(UserSettingsPage);
export default UserSettingsPage;
