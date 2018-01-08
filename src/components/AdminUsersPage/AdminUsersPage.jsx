import React from "react";
import { Component } from "react";
import { Container } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Table } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Popup } from 'semantic-ui-react';
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import moment from "moment";
import swal from "sweetalert";
import "./AdminUsersPage.css";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import { baseApiUrl } from "../../conf";
import axios from "axios";

class AdminUsersPage extends Component {
    constructor(props) {
        super(props);
        document.title = "Gestion des utilisateurs | Le château fort";
        window.scrollTo(0, 0);
        this.state = {
            "isLoading": true,
            "error": false,
            "pending": [],
            "utilisateurs": [],
        };
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
    
    componentWillMount() {
        const self = this;
        let promises = [];

        const pending = baseApiUrl + "/users/list/pending/?token=" + this.props.userToken;
        promises[0] = axios.get(pending).then(function(result) {
            self.setState(Object.assign({}, self.state, {
                "pending": result.data
            }));
        });
        const users = baseApiUrl + "/users/list/confirmed/?token=" + this.props.userToken;
        promises[1] = axios.get(users).then(function(result) {
            self.setState(Object.assign({}, self.state, {
                "utilisateurs": result.data
            }));
        });
        Promise.all(promises).then(function() {
            self.setState(Object.assign({}, self.state, {
                "isLoading": false,
                "error": false
            }));
        }).catch(function() {
            self.setState(Object.assign({}, self.state, {
                "isLoading": false,
                "error": true
            }));
        });
    }

    handleConfirmUser(userId, e) {
        const self = this;
        swal({
            "title": "Attention",
            "text": "Êtes-vous certain de vouloir activer le compte de cet utilisateur ?",
            "icon": "warning",
            "buttons": {
                "cancel": "Non",
                "confirm": "Oui"
            }
        }).then(function(value) {
            if (value) {
                const route = baseApiUrl + "/users/" + userId + "/confirm/?token=" + self.props.userToken;
                axios.post(route).then(function(result) {
                    self.setState(Object.assign({}, self.state, {
                        "isLoading": true
                    }));
                    let promises = [];
                    const pending = baseApiUrl + "/users/list/pending/?token=" + self.props.userToken;
                    promises[0] = axios.get(pending).then(function(result) {
                        self.setState(Object.assign({}, self.state, {
                            "pending": result.data
                        }));
                    });
                    const users = baseApiUrl + "/users/list/confirmed/?token=" + self.props.userToken;
                    promises[1] = axios.get(users).then(function(result) {
                        self.setState(Object.assign({}, self.state, {
                            "utilisateurs": result.data
                        }));
                    });
                    Promise.all(promises).then(function() {
                        self.setState(Object.assign({}, self.state, {
                            "isLoading": false,
                            "error": false
                        }));
                    });
                }).catch(function(error) {
                    console.log(error);
                    if (error.response != null) {
                        self.throwSweetError(error.response.data.error);
                        return;
                    } else {
                        self.throwSweetError("Une erreur s'est produite.");
                        return;
                    }
                });
            }
        });
    }

    handleEditUser(userId, e) {
        console.log(userId);
        // TODO
    }
    
    handleDeleteUser(userId, e) {
        const self = this;
        swal({
            "title": "Attention",
            "text": "Êtes-vous certain de vouloir effacer cet utilisateur ?",
            "icon": "warning",
            "dangerMode": true,
            "buttons": {
                "cancel": "Annuler",
                "delete": "Supprimer"
            }
        }).then(function(value) {
            if (value === "delete") {
                const route = baseApiUrl + "/users/" + userId + "/delete/?token=" + self.props.userToken;
                axios.delete(route).then(function(result) {
                    let pendings = self.state.pending;
                    let index = pendings.findIndex(function(pending) {
                        return pending.id === userId
                    });
                    if (index !== -1) {
                        pendings.splice(index, 1);
                        self.setState(Object.assign({}, self.state, {
                            "pending": pendings
                        }));
                        return;
                    }
                    let utilisateurs = self.state.utilisateurs;
                    index = utilisateurs.findIndex(function(utilisateur) {
                        return utilisateur.id === userId;
                    });
                    if (index !== -1) {
                        utilisateurs.splice(index, 1);
                        self.setState(Object.assign({}, self.state, {
                            "utilisateurs": utilisateurs
                        }));
                        return;
                    }
                    toast.success("L'utilisateur a été effacé avec succès.");
                }).catch(function(error) {
                    if (error.response !== null) {
                        self.throwSweetError(error.response.data.error);
                        return;
                    } else {
                        self.throwSweetError("Une erreur s'est produite.");
                        return;
                    }
                })
            }
        });
    }

    render() {
        const self = this;
        let content = null;
        if (this.state.isLoading) {
            content = (
                <Dimmer.Dimmable as="div" className="AdminCategoriesPage-loader">
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
            let pendingtable = null;
            if (this.state.pending.length > 0) {
                const rows = this.state.pending.map(function(row, i) {
                    return (
                        <Table.Row key={i}>
                            <Table.Cell width={6}>{row.email}</Table.Cell>
                            <Table.Cell width={4}>{row.lastname}</Table.Cell>
                            <Table.Cell width={4}>{row.firstname}</Table.Cell>
                            <Table.Cell width={2}>
                                <Popup content="Activer ce compte utilisateur" position="bottom right" size="small" hideOnScroll inverted trigger={<Icon link name="checkmark" size="large" onClick={self.handleConfirmUser.bind(self, row.id)} />} />
                                <Popup content="Effacer ce compte utilisateur" position="bottom right" size="small" hideOnScroll inverted trigger={<Icon link name="trash outline" size="large" onClick={self.handleDeleteUser.bind(self, row.id)} />} />
                            </Table.Cell>
                        </Table.Row>
                    );
                });
                pendingtable = (
                    <div>
                        <Header as="h3" dividing>Utilisateurs en attente</Header>
                        <Divider hidden />
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={6}>Adresse e-mail</Table.HeaderCell>
                                    <Table.HeaderCell width={4}>Nom</Table.HeaderCell>
                                    <Table.HeaderCell width={4}>Prénom</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {rows}
                            </Table.Body>
                        </Table>
                    </div>
                );
            }
            let confirmedtable = null;
            if (this.state.utilisateurs.length > 0) {
                const rows = this.state.utilisateurs.map(function(row, i) {
                    const roles = row.roles.map(function(role, j) {
                        return <div key={j}>{role.title}</div>;
                    });
                    return (
                        <Table.Row key={i}>
                            <Table.Cell width={4}>{row.email}</Table.Cell>
                            <Table.Cell width={3}>{row.lastname}</Table.Cell>
                            <Table.Cell width={3}>{row.firstname}</Table.Cell>
                            <Table.Cell width={2}>{roles}</Table.Cell>
                            <Table.Cell width={2}>{moment(row.confirmed).format("DD/MM/YYYY - HH:mm:ss")}</Table.Cell>
                            <Table.Cell width={2}>
                                <Popup content="Modifier ce compte utilisateur" position="bottom right" size="small" hideOnScroll inverted trigger={<Icon link name="pencil" size="large" onClick={self.handleEditUser.bind(self, row.id)} />} />
                                <Popup content="Effacer ce compte utilisateur" position="bottom right" size="small" hideOnScroll inverted trigger={<Icon link name="trash outline" size="large" onClick={self.handleDeleteUser.bind(self, row.id)} />} />
                            </Table.Cell>
                        </Table.Row>
                    );
                });
                confirmedtable = (
                    <div>
                        <Header as="h3" dividing>Utilisateurs confirmés</Header>
                        <Divider hidden />
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={4}>Adresse e-mail</Table.HeaderCell>
                                    <Table.HeaderCell width={3}>Nom</Table.HeaderCell>
                                    <Table.HeaderCell width={3}>Prénom</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Rôles</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Date de confirmation</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {rows}
                            </Table.Body>
                        </Table>
                    </div>
                );
            }
            content = (
                <div>
                    {pendingtable}
                    <Divider clearing hidden />
                    {confirmedtable}
                </div>
            );
        }

        return (
            <div className="AdminUsersPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <Container className="AdminUserPage-content">
                    <Header as="h1">
                        <Icon name="users" />
                        <Header.Content>
                            Gestion des utilisateurs
                            <Header.Subheader>Administration des utilisateurs du site</Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Divider clearing hidden />
                    {content}
                </Container>
                <Segment inverted vertical color="grey" className="AdminUsersPage-footer">
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

AdminUsersPage = connect(mapStoreToProps)(AdminUsersPage);
export default AdminUsersPage;
