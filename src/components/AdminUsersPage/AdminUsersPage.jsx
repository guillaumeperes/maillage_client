import React from "react";
import { Component } from "react";
import { Container } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Icon, Table } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Button } from 'semantic-ui-react';
import { Scrollbars } from "react-custom-scrollbars";
import { Label } from 'semantic-ui-react';
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import swal from "sweetalert";
import "./AdminUsersPage.css";


import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import { baseApiUrl } from "../../conf";
import axios from "axios";


export class AdminUsersPage extends Component {
    constructor(props) {
        super(props);
        document.title = "Gestion des utilisateurs | Le château fort";
        this.state = {
            "isLoading": true,
            "error": false,
            "utilisateurs": []
        };
    }
    
    componentDidMount() {
        const self = this;
        const route = baseApiUrl + "/users/list/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "error": false,
                "utilisateurs": response.data
            });
        }).catch(function(error) {
            self.setState({
                "isLoading": false,
                "error": true,
                "utilisateurs": []
            });
        });
    }
    
    handleDeleteUser(userId, e) {
        const self = this;
        swal({
            "title": "Attention",
            "text": "Êtes-vous certain de supprimer cet utilisateur ?",
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
                    let utilisateurs = self.state.utilisateurs;
                    const index = utilisateurs.findIndex(function(c) {
                        return c.id === userId;
                    });
                    utilisateurs.splice(index, 1);
                    const state = Object.assign({}, self.state, {
                        "utilisateurs": utilisateurs
                    });
                    self.setState(state);
                    toast.success("L'utilisateur a été supprimée avec succès.");
                }).catch(function(error) {
                    if (error.response !== null) {
                        self.throwSweetError(error.response.data.error);
                    } else {
                        self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                    }
                });
            }
        });
    } 
    
    renderUtilisateur(utilisateurs) {
        const self = this;
        const out = utilisateurs.map(function(user, i) {
            return (
                <Table.Row>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.firstname}</Table.Cell>
                    <Table.Cell>{user.lastname}</Table.Cell>
                    <Table.Cell>{user.confirmed != null ? <Label color='green'>confirmé</Label> : <Label color='red'>non confirmé</Label> } </Table.Cell>
                    <Table.Cell> <Icon name='trash' link onClick={self.handleDeleteUser.bind(self, user.id)}/><Button> <Icon name='checkmark'/></Button><Button><Icon name='write' /></Button></Table.Cell>
                </Table.Row> 
            );
        });
        return out;
    }
    
    renderContent(){
        let content = '';
        if (this.state.isLoading) {
            content = (
                <Dimmer.Dimmable as="div" className="AdminCategoriesPage-loader">
                    <Dimmer active inverted>
                        <Loader size="medium" inverted>Chargement en cours</Loader>
                    </Dimmer>
                </Dimmer.Dimmable>
            );
        } else if (this.state.utilisateurs.length === 0) {
            content = (
                <Container fluid textAlign="center">
                    <Icon name="search" size="huge" color="grey" />
                    <div>Ok ta mer.</div>
                </Container>
            );
        } else {
            const utilisateurs = this.renderUtilisateur(this.state.utilisateurs)
            content =(
                    <Table className="AdminUsersPage-table">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>E-mail</Table.HeaderCell>
                            <Table.HeaderCell>Nom</Table.HeaderCell>
                            <Table.HeaderCell>Prénom</Table.HeaderCell>
                            <Table.HeaderCell>Statut</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {utilisateurs}
                    </Table.Body>
                </Table>
            );     
        }
        return content; 
    }
    
    
    
    render() {
        return (
            <div className="AdminUsersPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <Container className="AdminUserPage-content">
                    <Header as="h1">
                        <Icon name="users" />
                        <Header.Content>
                            Gestion des utilisateurs
                            <Header.Subheader>Administration des accès utilisateur</Header.Subheader>
                        </Header.Content>
                    </Header>
                    {this.renderContent()}
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
