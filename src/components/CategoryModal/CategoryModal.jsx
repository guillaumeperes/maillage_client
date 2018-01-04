import React from "react";
import { Component } from "react";
import { Modal } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { HuePicker } from "react-color";
import axios from "axios";
import { baseApiUrl } from "../../conf";
import { connect } from "react-redux";
import swal from "sweetalert";

class CategoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isOpened": false,
            "category": null,
            "data": {}
        };
        this.openModal = this.openModal.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
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

    openModal(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.props.categoryId != null) {
            const self = this;
            const route = baseApiUrl + "/categories/" + this.props.categoryId + "/detail/?token=" + this.props.userToken;
            axios.get(route).then(function(response) {
                if (response.data.data.category != null) {
                    const category = response.data.data.category;
                    self.setState({
                        "isOpened": true,
                        "category": category,
                        "data": {
                            "title": category.title,
                            "color": category.color
                        }
                    });
                } else {
                    self.throwSweetError("La catégorie à laquelle vous tentez d'accéder n'existe pas.");
                }
            }).catch(function(error) {
                self.throwSweetError("Une erreur s'est produite.");
            });
        } else {
            this.setState({
                "isOpened": true,
                "category": null,
                "data": {}
            });
        }
    }

    closeModal() {
        this.setState({
            "isOpened": false,
            "category": null,
            "data": {}
        });
    }

    handleSave(e) {
        if (e.type === "keypress" && e.key !== "Enter") {
            return;
        }

        let data = this.state.data;

        // Vérification des données
        if (data.title == null || !data.title.length) {
            this.throwSweetError("Merci de renseigner un titre");
            return;
        }
        if (data.color == null || !data.color.length) {
            data.color = "#e8e8e8"; // Couleur par défaut : gris clair
        }

        // Envoi des données à l'api pour enregistrement
        const self = this;
        if (this.state.category != null) {
            const route = baseApiUrl + "/categories/" + this.state.category.id + "/edit/?token=" + this.props.userToken;
            axios.post(route, data).then(function(response) {
                if (typeof self.props.onSave === "function") {
                    self.props.onSave(response.data.data.category);
                }
                self.closeModal();
            }).catch(function(error) {
                if (error.response !== null) {
                    self.throwSweetError(error.response.data.error);
                } else {
                    self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                }
                return;
            });
        } else {
            const route = baseApiUrl + "/categories/new/?token=" + this.props.userToken;
            axios.put(route, data).then(function(response) {
                if (typeof self.props.onSave === "function") {
                    self.props.onSave(response.data.data.category);
                }
                self.closeModal();
            }).catch(function(error) {
                if (error.response !== null) {
                    self.throwSweetError(error.response.data.error);
                } else {
                    self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                }
                return;
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

    handleColorPickerChange(color) {
        const state = Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, {
                "color": color.hex
            })
        });
        this.setState(state);
    }

    render() {
        let modalTitle = "Ajouter une catégorie";
        if (this.state.category != null && this.state.category.title != null) {
            modalTitle = this.state.category.title;
        }
        let titleValue = "";
        if (this.state.data.title != null) {
            titleValue = this.state.data.title;
        }
        let color = "#e8e8e8";
        if (this.state.data.color != null) {
            color = this.state.data.color;
        }

        return (
            <Modal onOpen={this.openModal} open={this.state.isOpened} onClose={this.closeModal} trigger={this.props.children} closeIcon>
                <Modal.Header>{modalTitle}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Container fluid>
                            <Form.Field required>
                                <label>Titre</label>
                                <Input type="text" name="title" placeholder="Titre" value={titleValue} onChange={this.handleTextInputChange} onKeyPress={this.handleSave} />
                            </Form.Field>
                            <Form.Field>
                                <label>Couleur de la catégorie</label>
                                <HuePicker width="100%" color={color} onChangeComplete={this.handleColorPickerChange} />
                            </Form.Field>
                        </Container>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.closeModal} title="Annuler">Annuler</Button>
                    <Button primary onClick={this.handleSave} title="Fermer"><Icon name="save" />Enregistrer</Button>
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

CategoryModal = connect(mapStoreToProps)(CategoryModal);
export default CategoryModal;
