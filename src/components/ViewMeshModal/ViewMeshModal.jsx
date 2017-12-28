import React from "react";
import { Component } from "react";
import { Modal } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import filesize from "filesize";
import { baseApiUrl } from "../../conf";
import swal from "sweetalert";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./ViewMeshModal.css";

export default class ViewMeshModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "isOpened": false,
            "error": false,
            "mesh": null
        };
        this.loadMesh = this.loadMesh.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.downloadMesh = this.downloadMesh.bind(this);
    }

    loadMesh() {
        const self = this;
        self.setState({
            "isLoading": true,
            "isOpened": true,
            "error": false,
            "mesh": null
        });
        const route = baseApiUrl + "/mesh/" + self.props.meshId + "/view/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "isOpened": true,
                "error": false,
                "mesh": response.data
            });
        }).catch(function(error) {
            self.setState({
                "isLoading": false,
                "isOpened": true,
                "error": true,
                "mesh": null
            });
        });
    }

    closeModal() {
        this.setState({
            "isLoading": true,
            "isOpened": false,
            "error": false,
            "mesh": null
        });
    }

    downloadMesh() {
        const route = baseApiUrl + "/mesh/" + this.state.mesh.id + "/download/";
        axios.get(route).then(function(result) {
            window.location = route;
        }).catch(function() {
            swal({
                "title": "Erreur",
                "text": "Une erreur s'est produite.",
                "dangerMode": true,
                "icon": "error",
                "button": "Fermer"
            }).catch(swal.noop);
        });
    }

    renderDescription(mesh) {
        if (mesh.description != null) {
            return (
                <Segment padded color="grey">
                    <Header size="tiny" color="grey">Description</Header>
                    <div>{mesh.description}</div>
                </Segment>
            );
        }
    }

    renderTags(category) {
        const out = category.tags.map(function(tag, i) {
            return <Label key={i} as="span" size="small">{tag.title}</Label>
        });
        return out;
    }

    renderTagsCategories(mesh) {
        const self = this
        const out = mesh.tagsCategories.map(function(category, i) {
            return (
                <Segment padded color="grey" key={i}>
                    <Header size="tiny" color="grey">{category.title}</Header>
                    { self.renderTags(category) }
                </Segment>
            );
        });
        return out;
    }

    renderImages(mesh) {
        if (mesh.images.length === 0) {
            // TODO
        } else if (mesh.images.length === 1) {
            return <Image fluid rounded src={baseApiUrl + mesh.images[0].uri} alt={mesh.title} />
        } else {
            const items = mesh.images.map(function(image, i) {
                return <div key={i}><Image fluid rounded src={baseApiUrl + image.uri} alt={mesh.title} /></div>;
            });
            return <Carousel showStatus={false} showThumbs={false} infiniteLoop autoPlay transitionTime={200} dynamicHeight>{items}</Carousel>;
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Modal onOpen={this.loadMesh} open={this.state.isOpened} onClose={this.closeModal} trigger={this.props.children} closeIcon>
                    <Modal.Header>Chargement en cours</Modal.Header>
                    <Modal.Content>
                         <Segment textAlign="center" vertical padded>
                            <Dimmer.Dimmable>
                                <Dimmer active inverted>
                                    <Loader size="medium" inverted>Chargement du fichier de maillage en cours</Loader>
                                </Dimmer>
                            </Dimmer.Dimmable>
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary onClick={this.closeModal} title="Fermer">Fermer</Button>
                    </Modal.Actions>
                </Modal>
            );
        } else if (this.state.error) {
            return (
                <Modal onOpen={this.loadMesh} open={this.state.isOpened} onClose={this.closeModal} trigger={this.props.children} closeIcon>
                    <Modal.Header>Une erreur s'est produite</Modal.Header>
                    <Modal.Content>
                        <Grid padded stackable columns={2}>
                            <Grid.Row>
                                <Grid.Column width={4} textAlign="center">
                                    <Icon name="warning" size="huge" color="grey" />
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Header as="div" size="small" color="grey">Une erreur inconnue s'est produite.</Header>
                                    <Header as="div" size="small" color="grey">Merci de réitérer votre action ultérieurement.</Header>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary onClick={this.closeModal} title="Fermer">Fermer</Button>
                    </Modal.Actions>
                </Modal>
            );
        } else if (this.state.mesh != null) {
            const mesh = this.state.mesh;

            const d = new Date(mesh.created);
            const created = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " à " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            let user = mesh.user.email;
            if (mesh.user.firstname != null && mesh.user.lastname != null) {
                user = mesh.user.firstname + " " + mesh.user.lastname;
            }
            const size = filesize(mesh.filesize, {
                "base": 2,
                "output": "object"
            });

            return (
                <Modal onOpen={this.loadMesh} open={this.state.isOpened} onClose={this.closeModal} trigger={this.props.children} closeIcon>
                    <Modal.Header>
                        <Grid stackable columns={2}>
                            <Grid.Row only="mobile">
                                <Grid.Column width={16}>
                                    <Header as="h1" size="small">
                                        {mesh.title}
                                        <Header.Subheader>ajouté par <strong>{user}</strong> le <strong>{created}</strong></Header.Subheader>
                                    </Header>
                                </Grid.Column>
                                <Grid.Column width={16} textAlign="center">
                                    <Button fluid onClick={this.downloadMesh}><Icon name="download" />Télécharger</Button>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row only="computer tablet">
                                <Grid.Column width={12}>
                                    <Header as="h1" size="small">
                                        {mesh.title}
                                        <Header.Subheader>ajouté par <strong>{user}</strong> le <strong>{created}</strong></Header.Subheader>
                                    </Header>
                                </Grid.Column>
                                <Grid.Column width={4} textAlign="right">
                                    <Button data-tooltip="Télécharger ce fichier de maillage" onClick={this.downloadMesh}><Icon name="download" />Télécharger</Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Header>
                    <Modal.Content>
                        <Grid stackable columns={2}>
                            <Grid.Row>
                                <Grid.Column width={9}>
                                    { this.renderImages(mesh) }
                                </Grid.Column>
                                <Grid.Column width={7}>
                                    { this.renderDescription(mesh) }
                                    <Segment padded color="grey">
                                        <div><Header as="span" size="tiny" color="grey" className="ViewMeshModal-inlineHeader">Nombre de cellules : </Header>{ parseInt(mesh.cells, 10).toLocaleString() }</div>
                                        <div><Header as="span" size="tiny" color="grey" className="ViewMeshModal-inlineHeader">Nombre de sommets : </Header>{ parseInt(mesh.vertices, 10).toLocaleString() }</div>
                                    </Segment>
                                    { this.renderTagsCategories(mesh) }
                                    <Segment padded color="grey">
                                        <div><Header as="span" size="tiny" color="grey" className="ViewMeshModal-inlineHeader">Nom du fichier : </Header>{mesh.filename}</div>
                                        <div><Header as="span" size="tiny" color="grey" className="ViewMeshModal-inlineHeader">Type de fichier : </Header>{mesh.filetype.toUpperCase()}</div>
                                        <div><Header as="span" size="tiny" color="grey" className="ViewMeshModal-inlineHeader">Taille du fichier : </Header>{size.value} {size.suffix}</div>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary onClick={this.closeModal} title="Fermer">Fermer</Button>
                    </Modal.Actions>
                </Modal>
            );
        }
    }
}
