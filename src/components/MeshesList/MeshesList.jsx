import React from "react";
import { Component } from "react";
import { Header } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import filesize from "filesize";
import "./MeshesList.css";

export default class MeshesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "meshes": []
        };
    }

    componentDidMount() {
        const self = this;
        const route = baseApiUrl + "/meshes/search/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "meshes": response.data
            });
        }).catch(function(error) {
            console.log(error); // Todo : redirection vers une page d'erreur
        });
    }

    renderMeshTags(mesh) {
        if (mesh.tags.length > 0) {
            const tags = mesh.tags.map(function(tag, i) {
                return <Label key={i} as="span" size="small">{tag.title}</Label>
            });
            return (
                <div className="MeshesList-meshTags">{tags}</div>
            );
        }
    }

    renderMeshes() {
        const self = this;
        const out = self.state.meshes.map(function(mesh, i) {
            var thumb = (
                <div className="MeshesList-meshIcon">
                    <Icon name="image" size="large" color="grey" />
                </div>
            );
            if (typeof mesh.images[0].thumbUri === "string") {
                thumb = <Image width="70px" height="70px" verticalAlign="middle" alt={mesh.title} shape="rounded" src={baseApiUrl + mesh.images[0].thumbUri} className="MeshesList-meshImage" />;
            }
            const d = new Date(mesh.created);
            const created = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            const size = filesize(mesh.filesize, {
                "base": 2,
                "output": "object"
            });

            return (
                <Grid.Row key={i} className="MeshesList-mesh">
                    <Grid.Column width={8} verticalAlign="middle">
                        {thumb}
                        <div className="MeshesList-meshInfo">
                            <Header as="h2" size="small">{mesh.title}</Header>
                            <div className="MeshesList-meshDate">{created}</div>
                            { self.renderMeshTags(mesh) }
                        </div>
                    </Grid.Column>
                    <Grid.Column width={2} textAlign="center" verticalAlign="middle" className="MeshesList-meshMetadata">
                        <div><span className="MeshesList-meshDigit">{size.value}</span> {size.suffix}</div>
                        <div>Type : <span className="MeshesList-meshDigit">{mesh.filetype.toUpperCase()}</span></div>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="center" verticalAlign="middle" className="MeshesList-meshMetadata">
                        <div><span className="MeshesList-meshDigit">{parseInt(mesh.cells, 10).toLocaleString()}</span> cellules</div>
                        <div><span className="MeshesList-meshDigit">{parseInt(mesh.vertices, 10).toLocaleString()}</span> sommets</div>
                    </Grid.Column>
                    <Grid.Column width={3} textAlign="right" verticalAlign="middle">
                        <Button primary icon circular compact basic size="tiny" onClick={self.openMesh} data-tooltip="Voir"><Icon name="eye" /></Button>
                        <Button secondary icon circular compact basic size="tiny" onClick={self.editMesh} data-tooltip="Modifier"><Icon name="pencil" /></Button>
                        <Button negative icon circular compact basic size="tiny" onClick={self.deleteMesh} data-tooltip="Supprimer"><Icon name="trash" /></Button>
                    </Grid.Column>
                </Grid.Row>
            );
        });
        return out;
    }

    openMesh() {
        console.log("Open");
    }

    editMesh() {
        console.log("Edit");
    }

    deleteMesh() {
        console.log("Delete");
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Dimmer.Dimmable as="div" className="MeshesList">
                    <Dimmer active inverted className="MeshesList-loader">
                        <Loader size="medium" inverted>Chargement en cours</Loader>
                    </Dimmer>
                </Dimmer.Dimmable>
            );
        } else if (this.state.meshes.length === 0) {
            return (
                <div className="MeshesList">
                    <Container textAlign="center" text>
                        <Icon name="search" size="huge" color="grey" />
                        <div>Aucun résulat.</div>
                    </Container>
                </div>
            );
        } else {
            return (
                <div className="MeshesList">
                    <div className="MeshesList-actions"></div>
                    <Grid padded={true} columns={4} className="MeshesList-list">
                        { this.renderMeshes() }
                    </Grid>
                </div>
            );
        }
    }
}
