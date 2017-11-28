import React from "react";
import { Component } from "react";
import { Icon, Table } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Button } from 'semantic-ui-react';
import { Scrollbars } from "react-custom-scrollbars";
import { Label } from 'semantic-ui-react';
import "./AdminUsersPage.css";

import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import { baseApiUrl } from "../../conf";
import axios from "axios";


export default class AdminUsersPage extends Component {
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
    
    renderUtilisateur(utilisateurs) {
        const self = this;
        const out = utilisateurs.map(function(user, i) {
            return (
                <Table.Row>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.firstname}</Table.Cell>
                    <Table.Cell>{user.lastname}</Table.Cell>
                    <Table.Cell>{user.confirmed != null ? <Label color='green'>ok ta mer</Label> : <Label color='red'>non confirmé</Label> } </Table.Cell>
                    <Table.Cell><Button> <Icon name='trash'/></Button><Button> <Icon name='checkmark'/></Button><Button><Icon name='write' /></Button></Table.Cell>
                </Table.Row> 
            );
        });
        return out;
    }
    
    render() {
        return (
            <div className="AdminUsersPage">
                <BarreDuHautAvecLaBareDeRecherche />
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
                        {this.renderUtilisateur(this.state.utilisateurs)}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
