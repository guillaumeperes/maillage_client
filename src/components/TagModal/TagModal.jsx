import React from "react";
import { Component } from "react";
import { Modal } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import axios from "axios";
import { baseApiUrl } from "../../conf";
import { connect } from "react-redux";
import swal from "sweetalert";

class TagModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isOpened": false,
            "category": null,
            "tag": null,
            "data": {}
        };
        this.openModal = this.openModal.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
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

        if (!this.props.categoryId) {
            this.throwSweetError("Une erreur s'est produite.");
            return;
        }
        const self = this;
        const categoryRoute = baseApiUrl + "/categories/" + this.props.categoryId + "/detail/?token=" + this.props.userToken;
        axios.get(categoryRoute).then(function(response) {
            if (response.data.data.category) {
                const state = Object.assign({}, self.state, {
                    "category": response.data.data.category
                });
                self.setState(state);
            }
            if (self.props.tagId == null || (self.props.tagId != null && self.state.tag != null)) {
                const state = Object.assign({}, self.state, {
                    "isOpened": true
                });
                self.setState(state);
            }
        }).catch(function(error) {
            self.throwSweetError("Une erreur s'est produite.");
        });
        if (this.props.tagId) {
            const tagRoute = baseApiUrl + "/tags/" + this.props.tagId + "/detail/?token=" + this.props.userToken;
            axios.get(tagRoute).then(function(response) {
                if (response.data.data.tag != null) {
                    const state = Object.assign({}, self.state, {
                        "tag": response.data.data.tag,
                        "data": {
                            "title": response.data.data.tag.title
                        }
                    });
                    self.setState(state);
                }
                if (self.state.category != null) {
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

        // Envoi des données à l'api pour enregistrement
        const self = this;
        if (this.state.tag != null) {
            // Maj d'un tag
            const route = baseApiUrl + "/tags/" + this.state.tag.id + "/edit/?token=" + this.props.userToken;
            axios.post(route, data).then(function(response) {
                if (typeof self.props.onSave === "function") {
                    self.props.onSave(self.state.category, response.data.data.tag);
                }
                self.closeModal();
            }).catch(function(error) {
                if (error.response != null) {
                    self.throwSweetError(error.response.data.error);
                } else {
                    self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                }
                return;
            });
        } else {
            // Nouveau tag
            const route = baseApiUrl + "/categories/" + this.state.category.id + "/tags/new/?token=" + this.props.userToken;
            axios.put(route, data).then(function(response) {
                if (typeof self.props.onSave === "function") {
                    self.props.onSave(self.state.category, response.data.data.tag);
                }
                self.closeModal();
            }).catch(function(error) {
                if (error.response != null) {
                    self.throwSweetError(error.response.data.error);
                } else {
                    self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                }
                return;
            });
        }
    }

    closeModal() {
        this.setState({
            "isOpened": false,
            "category": null,
            "tag": null,
            "data": {}
        });
    }

    render() {
        let modalTitle = "Ajouter un tag";
        if (this.state.tag != null && this.state.tag.title != null) {
            modalTitle = "Modifier \"" + this.state.tag.title + "\"";
        }
        let titleValue = "";
        if (this.state.data.title != null) {
            titleValue = this.state.data.title;
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

TagModal = connect(mapStoreToProps)(TagModal);
export default TagModal;
