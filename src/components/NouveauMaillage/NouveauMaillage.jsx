import React from "react";
import { Component } from "react";
import { Button } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { TextArea } from "semantic-ui-react";
import { Dropdown } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import swal from "sweetalert";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";

class NouveauMaillage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            "isOpened": false,
            "categories": null,
            "mesh": null,
            "data": {}
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
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

    openModal() {
        const self = this;

        // Recherche des catégories disponibles avec leurs tags
        const categoriesRoute = baseApiUrl + "/categories/alltags/";
        axios.get(categoriesRoute).then(function(response) {
            const state = Object.assign({}, self.state, {
                "categories": response.data
            });
            self.setState(state);
            if (self.props.meshId == null || (self.props.meshId != null && self.state.mesh != null)) {
                const state = Object.assign({}, self.state, {
                    "isOpened": true
                });
                self.setState(state);
            }
        }).catch(function(error) {
            self.throwSweetError("Une erreur s'est produite.");
        });
        // Si édition : recherche des données du fichier de maillage
        if (self.props.meshId) {
            const meshRoute = baseApiUrl + "/mesh/" + self.props.meshId + "/view/";
            axios.get(meshRoute).then(function(response) {
                let data = {
                    "title": response.data.title,
                    "cells": response.data.cells,
                    "vertices": response.data.vertices,
                    "description": response.data.description,
                    "tags": {}
                };
                response.data.tagsCategories.forEach(function(tagCategory) {
                    data.tags["category_" + tagCategory.id] = tagCategory.tags.map(function(tag) {
                        return tag.id;
                    });
                });
                const state = Object.assign({}, self.state, {
                    "mesh": response.data,
                    "data": Object.assign({}, self.state.data, data)
                });
                self.setState(state);
                if (self.state.categories != null) {
                    const state = Object.assign({}, self.state, {
                        "isOpened": true
                    });
                    self.setState(state);
                }
            }).catch(function(error) {
                self.throwSweetError("Une erreur s'est produite.");
            });
        }
    }

    handleTextInputChange(e, data) {
        let o = {};
        o[data.name] = data.value;
        const state = Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, o)
        });
        this.setState(state);
    }

    handleDropdownChange(e, data) {
        let tags = this.state.data.tags || [];
        if (data.value.length > 0) {
            tags["category_" + data.category] = data.value;
        } else {
            delete tags["category_" + data.category];
        }
        const state = Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, {
                "tags": tags
            })
        });
        this.setState(state);
    }

    handleSave() {
        let data = Object.assign({}, this.state.data);

        // Vérification des données
        if (data.title == null || !data.title.length) {
            this.throwSweetError("Merci de renseigner un titre");
            return;
        }
        if (data.cells == null || !data.cells.length || /^(0|[1-9]\d*)$/.test(data.cells) === false) {
            this.throwSweetError("Merci de renseigner un nombre de cellules valide.");
            return;
        }
        if (data.vertices == null || !data.vertices.length || /^(0|[1-9]\d*)$/.test(data.vertices) === false) {
            this.throwSweetError("Merci de renseigner un nombre de sommets valide.");
            return;
        }
        if (data.tags != null && Object.keys(data.tags).length > 0) {
            data.tags = Object.values(data.tags).reduce(function(acc, next) {
                return acc.concat(next);
            });
        }

        // Envoi des données au serveur
        const self = this;
        const route = baseApiUrl + "/mesh/new/?token=" + self.props.userToken;
        axios.post(route, data).then(function(response) {
            console.log(response);
            //self.closeModal();
        }).catch(function(error) {
            console.log(error);
            //self.closeModal();
        });
    }

    closeModal() {
        this.setState({
            "isOpened": false,
            "categories": null,
            "mesh": null,
            "data": {}
        });
    }
    
    renderCategories() {
        if (!this.state.categories) {
            return null;
        }
        const self = this;
        const out = self.state.categories.map(function(category, i) {
            const tags = category.tags.map(function(tag) {
                return { 
                    "key": tag.id,
                    "value": tag.id,
                    "text": tag.title
                };
            });
            let defaultValue = [];
            if (self.state.data.tags != null) {
                defaultValue = self.state.data.tags["category_" + category.id] || [];
            }
            return (
                <Form.Field key={i}> 
                    <label>{category.title}</label>
                    <Dropdown fluid multiple selection options={tags} category={category.id} defaultValue={defaultValue} onChange={self.handleDropdownChange} />
                </Form.Field>  
            );
        });
        return (
            <Container fluid>
                <Header dividing size="small"><Icon name="tags" />Tags</Header>
                {out}
            </Container>
        );
    }

    render(){
        let modalTitle = <span><Icon name="file" /> Partager un nouveau maillage</span>;
        if (this.state.mesh != null && this.state.mesh.title != null) {
            modalTitle = <span><Icon name="file" /> Modifier "{this.state.mesh.title}"</span>;
        }
        let titleValue = this.state.data.title || "";
        let cellsValue = this.state.data.cells || "";
        let verticesValue = this.state.data.vertices || "";
        let descriptionValue = this.state.data.description || "";

        return (
            <Modal onOpen={this.openModal} open={this.state.isOpened} trigger={this.props.children} closeIcon onClose={this.closeModal}>
                <Modal.Header>{modalTitle}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Container fluid>
                            <Header dividing size="small">Informations générales</Header>
                            <Form.Field required>
                                <label>Titre</label>
                                <Input type="text" name="title" placeholder='Titre' value={titleValue} onChange={this.handleTextInputChange} />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field required>
                                    <label>Nombre de cellules</label>
                                    <Input type="number" name="cells" placeholder='Nombre de cellules' value={cellsValue} onChange={this.handleTextInputChange} />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Nombre de sommets</label>
                                    <Input type="number" name="vertices" placeholder='Nombre de sommets' value={verticesValue} onChange={this.handleTextInputChange} />
                                </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <label>Description</label>
                                <TextArea placeholder='Description' name="description" autoHeight value={descriptionValue} onChange={this.handleTextInputChange} />
                            </Form.Field>
                        </Container>
                        <Divider hidden />
                        { this.renderCategories() }
                        <Container fluid>
                            <Divider hidden />
                            <Header dividing size="small"><Icon name="image" />Illustrations</Header>
                            <p>Vous pouvez illustrer votre fichier de maillage par une ou plusieurs images. Types de fichiers autorisés : .jpg, .jpeg, .png, .gif</p>
                        </Container>
                        <Divider hidden />
                        <Container fluid>
                            <Header dividing size="small"><Icon name="file outline" />Fichier de maillage</Header>
                            <p>test</p>
                        </Container>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary icon="save" content="Enregistrer" labelPosition="left" onClick={this.handleSave} />
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStoreToProps = function(store) {
    return {
        "userToken": store.users.userToken
    };
};

NouveauMaillage = connect(mapStoreToProps)(NouveauMaillage);
export default NouveauMaillage;
