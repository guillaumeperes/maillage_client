import React from "react";
import { Component } from "react";
import { Header } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import "./MeshesList.css";

export default class MeshesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "meshes": [{}, {}, {}]
        };
    }

    renderMeshes() {
        let out = this.state.meshes.map(function(mesh, i) {
            return (
                <Grid.Row key={i} className="MeshesList-mesh">
                    <Grid.Column width={10}>
                        <Image bordered={true} width="60px" height="60px" verticalAlign="middle" alt="Titre du fichier de maillage" src="/B1.png" className="MeshesList-meshImage" />
                        <div className="MeshesList-meshInfo">
                            <Header as="h2" size="small">Titre du fichier de maillage</Header>
                            <div className="MeshesList-meshDate">22/10/2017 - 20 : 50</div>
                            <div className="MeshesList-meshTags">
                                <Label as="span" size="small">3D</Label>
                                <Label as="span" size="small">3D surfacique</Label>
                                <Label as="span" size="small">3D volumique</Label>
                                <Label as="span" size="small">Hybride</Label>
                                <Label as="span" size="small">Triangulaire</Label>
                                <Label as="span" size="small">Immeuble</Label>
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="center" verticalAlign="middle">
                        <div>500 cellules</div>
                        <div>365 sommets</div>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="center" verticalAlign="middle">
                        <Button icon circular compact basic size="tiny"><Icon name="eye" /></Button>
                        <Button icon circular compact basic size="tiny"><Icon name="pencil" /></Button>
                        <Button icon circular compact basic size="tiny"><Icon name="trash" /></Button>
                    </Grid.Column>
                </Grid.Row>
            );
        });
        return out;
    }

    render() {
        return (
            <div className="MeshesList">
                <div className="MeshesList-actions"></div>
                <Grid padded={true} columns={3} className="MeshesList-list">
                    { this.renderMeshes() }
                </Grid>
            </div>
        );
    }
}
