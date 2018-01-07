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
import { Progress } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import "./NouveauMaillage.css";

class NouveauMaillage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            "isOpened": false,
            "step": 1,
            "categories": null,
            "mesh": null,
            "data": {},
            "errors": {},
            "uploadProgress": 0,
            "uploadTotal": 100,
            "uploadError": false
        };
        this.meshResult = null;
        this.axiosSource = axios.CancelToken.source();
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleImageDrop = this.handleImageDrop.bind(this);
        this.handleMeshDrop = this.handleMeshDrop.bind(this);
        this.handleSubmitStep1 = this.handleSubmitStep1.bind(this);
        this.handleSubmitStep2 = this.handleSubmitStep2.bind(this);
        this.handleSubmitStep3 = this.handleSubmitStep3.bind(this);
        this.handleSubmitStep4 = this.handleSubmitStep4.bind(this);
        this.handlePreviousStep = this.handlePreviousStep.bind(this);
        this.handleDeleteNewMesh = this.handleDeleteNewMesh.bind(this);
        this.handleUploadProgress = this.handleUploadProgress.bind(this);
        this.handleCancelUpload = this.handleCancelUpload.bind(this);
        this.handleDeleteExistingMesh = this.handleDeleteExistingMesh.bind(this);
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
        let promises = [];

        // Recherche des catégories disponibles avec leurs tags
        const categoriesRoute = baseApiUrl + "/categories/alltags/";
        promises[0] = axios.get(categoriesRoute).then(function(response) {
            self.setState(Object.assign({}, self.state, {
                "categories": response.data
            }));
        });
        // Si édition : recherche des données du fichier de maillage
        if (this.props.meshId) {
            const meshRoute = baseApiUrl + "/mesh/" + this.props.meshId + "/view/";
            promises[1] = axios.get(meshRoute).then(function(response) {
                let data = {
                    "title": response.data.title,
                    "cells": response.data.cells,
                    "vertices": response.data.vertices,
                    "description": response.data.description,
                    "mesh": response.data.filename,
                    "tags": {},
                    "images": response.data.images
                };
                response.data.tagsCategories.forEach(function(tagCategory) {
                    data.tags["category_" + tagCategory.id] = tagCategory.tags.map(function(tag) {
                        return tag.id;
                    });
                });
                self.setState(Object.assign({}, self.state, {
                    "mesh": response.data,
                    "data": Object.assign({}, self.state.data, data)
                }));
            });
        }

        // Ouverture du modal une fois que les requêtes http sont terminées
        Promise.all(promises).then(function() {
            self.setState(Object.assign({}, self.state, {
                "isOpened": true
            }));
        }).catch(function() {
            self.throwSweetError("Une erreur s'est produite.");
        });
    }

    handleTextInputChange(e, data) {
        let o = {};
        o[data.name] = data.value;
        this.setState(Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, o)
        }));
    }

    handleDropdownChange(e, data) {
        let tags = this.state.data.tags || [];
        if (data.value.length > 0) {
            tags["category_" + data.category] = data.value;
        } else {
            delete tags["category_" + data.category];
        }
        this.setState(Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, {
                "tags": tags
            })
        }));
    }

    handleImageDrop(files) {
        let newImages = this.state.data.newImages || [];
        files.forEach(function(file) {
            newImages.push(file);
        });
        this.setState(Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, {
                "newImages": newImages
            })
        }));
    }

    handleDeleteNewImage(index, e) {
        e.preventDefault();
        let newImages = this.state.data.newImages;
        newImages.splice(index, 1);
        this.setState(Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, {
                "newImages": newImages
            })
        }));
    }

    handleDeleteExistingImage(index, e) {
        e.preventDefault();
        const self = this;
        swal({
            "title": "Attention",
            "text": "Souhaitez-vous vraiment supprimer cette image ?",
            "icon": "warning",
            "dangerMode": true,
            "closeOnClickOutside": false,
            "buttons": {
                "cancel": "Non",
                "delete": "Oui"
            }
        }).then(function(value) {
            if (value === "delete") {
                let images = self.state.data.images;
                images.splice(index, 1);
                self.setState(Object.assign({}, self.state, {
                    "data": Object.assign({}, self.state.data, {
                        "images": images
                    })
                }));
            }
        });
    }

    handleDeleteExistingMesh(e) {
        e.preventDefault();
        const self = this;
        swal({
            "title": "Attention",
            "text": "Souhaitez-vous vraiment supprimer ce fichier ?",
            "icon": "warning",
            "dangerMode": true,
            "closeOnClickOutside": false,
            "buttons": {
                "cancel": "Non",
                "delete": "Oui"
            }
        }).then(function(value) {
            if (value === "delete") {
                self.setState(Object.assign({}, self.state, {
                    "data": Object.assign({}, self.state.data, {
                        "mesh": null
                    })
                }));
            }
        });
    }

    handleMeshDrop(files) {
        this.setState(Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, {
                "mesh": null,
                "newMesh": files[0]
            })
        }));
    }

    handleDeleteNewMesh(e) {
        e.preventDefault();
        this.setState(Object.assign({}, this.state, {
            "data": Object.assign({}, this.state.data, {
                "newMesh": null
            })
        }));
    }

    handlePreviousStep() {
        if (this.state.step > 1) {
            this.setState(Object.assign({}, this.state, {
                "step": this.state.step - 1
            }));
        }
    }

    handleSubmitStep1(e) {
        if (e.type === "keypress" && e.key !== "Enter") {
            return;
        }
        const data = this.state.data;

        let errors = {};
        if (data.title == null || !data.title.length) {
            errors.title = "Merci de renseigner un titre";
        }
        if (data.cells == null || !data.cells.length || /^(0|[1-9]\d*)$/.test(data.cells) === false) {
            errors.cells = "Merci de renseigner un nombre de cellules valide.";
        }
        if (data.vertices == null || !data.vertices.length || /^(0|[1-9]\d*)$/.test(data.vertices) === false) {
            errors.vertices = "Merci de renseigner un nombre de sommets valide.";
        }
        if (Object.keys(errors).length > 0) {
            this.setState(Object.assign({}, this.state, {
                "errors": {
                    "step1": errors
                }
            }));
        } else {
            this.setState(Object.assign({}, this.state, {
                "errors": {},
                "step": 2
            }));
        }
    }

    handleSubmitStep2(e) {
        this.setState(Object.assign({}, this.state, {
            "step": 3
        }));
    }

    handleSubmitStep3(e) {
        this.setState(Object.assign({}, this.state, {
            "step": 4
        }));
    }

    handleSubmitStep4(e) {
        const data = this.state.data;

        let errors = {};
        if (data.mesh == null && data.newMesh == null) {
            errors.mesh = "Merci d'ajouter un fichier de maillage.";
        }
        if (Object.keys(errors).length > 0) {
            this.setState(Object.assign({}, this.state, {
                "errors": {
                    "step4": errors
                }
            }));
        } else {
            this.setState(Object.assign({}, this.state, {
                "errors": {}
            }));
            this.handleSave();
        }
    }

    handleSave() {
        const data = Object.assign({}, this.state.data);
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("cells", data.cells);
        formData.append("vertices", data.vertices);
        if (data.description != null && data.description.length) {
            formData.append("description", data.description);
        }
        if (data.tags != null && Object.keys(data.tags).length > 0) {
            data.tags = Object.values(data.tags).reduce(function(acc, next) {
                return acc.concat(next);
            });
            data.tags.forEach(function(tag) {
                formData.append("tags", tag);
            });
        }
        if (data.images != null && data.images.length > 0) {
            data.images.forEach(function(image) {
                formData.append("images", image.id);
            });
        }
        if (data.newImages != null && data.newImages.length > 0) {
            data.newImages.forEach(function(image) {
                formData.append("newImage", image);
            });
        }
        if (data.newMesh != null) {
            formData.append("newMesh", data.newMesh);
        }

        // Envoi des données au serveur pour enregistrement

        const self = this;
        const config = {
            "onUploadProgress": this.handleUploadProgress,
            "cancelToken": this.axiosSource.token,
            "headers": {
                "Content-Type": "multipart/form-data"
            }
        };
        if (this.state.mesh != null) {
            const route = baseApiUrl + "/mesh/" + this.state.mesh.id + "/edit/?token=" + this.props.userToken;
            axios.post(route, formData, config).then(function(result) {
                self.meshResult = result.data.data.mesh;
            }).catch(function(error) {
                self.setState(Object.assign({}, self.state, {
                    "uploadError": true
                }));
                self.throwSweetError("Une erreur s'est produite.");
            });
        } else {
            const route = baseApiUrl + "/mesh/new/?token=" + this.props.userToken;
            axios.put(route, formData, config).then(function(result) {
                self.meshResult = result.data.data.mesh;
            }).catch(function(error) {
                self.setState(Object.assign({}, self.state, {
                    "uploadError": true
                }));
                self.throwSweetError("Une erreur s'est produite."); 
            });
        }
        this.setState(Object.assign({}, this.state, {
            "step": 5
        }));
    }

    handleUploadProgress(progressEvent) {
        this.setState(Object.assign({}, this.state, {
            "uploadProgress": progressEvent.loaded,
            "uploadTotal": progressEvent.loaded
        }));
    }

    handleCancelUpload() {
        this.axiosSource.cancel();
        this.setState({
            "isOpened": false,
            "step": 1,
            "categories": null,
            "mesh": null,
            "data": {},
            "errors": {},
            "uploadProgress": 0,
            "uploadTotal": 100,
            "uploadError": false
        });
        toast.success("L'envoi du fichier de maillage a été annulé");
    }

    closeModal() {
        if (this.state.uploadProgress === this.state.uploadTotal) {
            if (this.props.meshUploadSuccess != null && this.meshResult != null) {
                this.props.meshUploadSuccess(this.meshResult); // Exécuté seulement quand l'upload a réussi
            }
            this.setState({
                "isOpened": false,
                "step": 1,
                "categories": null,
                "mesh": null,
                "data": {},
                "errors": {},
                "uploadProgress": 0,
                "uploadTotal": 100,
                "uploadError": false
            });
        } else {
            const self = this;
            swal({
                "title": "Attention",
                "text": "Si vous quittez dans sauvegarder, vos modifications seront perdues. Êtes-vous certain de vouloir quitter ?",
                "icon": "warning",
                "dangerMode": true,
                "closeOnClickOutside": false,
                "buttons": {
                    "cancel": "Rester sur cette page",
                    "exit": "Quitter"
                }
            }).then(function(value) {
                if (value === "exit") {
                    self.setState({
                        "isOpened": false,
                        "step": 1,
                        "categories": null,
                        "mesh": null,
                        "data": {},
                        "errors": {},
                        "uploadProgress": 0,
                        "uploadTotal": 100,
                        "uploadError": false
                    });
                }
            });
        }
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
        return out;
    }

    render(){
        // Données du formulaire
        let modalTitle = <span><Icon name="file" /> Partager un nouveau maillage</span>;
        if (this.state.mesh != null && this.state.mesh.title != null) {
            modalTitle = <span><Icon name="file" /> Modifier "{this.state.mesh.title}"</span>;
        }
        let titleValue = this.state.data.title || "";
        let cellsValue = this.state.data.cells || "";
        let verticesValue = this.state.data.vertices || "";
        let descriptionValue = this.state.data.description || "";

        let modalContent = null;
        let modalActions = null;

        if (this.state.step === 1) {
            // Saisie des informations générales
            modalContent = (
                <Form error={this.state.errors.step1 != null}>
                    <Container fluid>
                        <Header dividing size="small"><Icon name="file text outline" />Informations générales</Header>
                        {this.state.errors.step1 != null ? <Message error header="Erreur" content="Il y a des erreurs dans le formulaire !" /> : null}
                        <Form.Field required error={this.state.errors.step1 != null && this.state.errors.step1.title != null}>
                            <label>Titre</label>
                            <Input type="text" name="title" placeholder='Titre' value={titleValue} onChange={this.handleTextInputChange} onKeyPress={this.handleSubmitStep1} />
                            {this.state.errors.step1 != null && this.state.errors.step1.title != null ? <Message error size="tiny" content={this.state.errors.step1.title} /> : null}
                        </Form.Field>
                        <Form.Group widths="equal">
                            <Form.Field required error={this.state.errors.step1 != null && this.state.errors.step1.cells != null}>
                                <label>Nombre de cellules</label>
                                <Input type="number" name="cells" placeholder='Nombre de cellules' value={cellsValue} onChange={this.handleTextInputChange} onKeyPress={this.handleSubmitStep1} />
                                {this.state.errors.step1 != null && this.state.errors.step1.cells != null ? <Message error size="tiny" content={this.state.errors.step1.cells} /> : null}
                            </Form.Field>
                            <Form.Field required error={this.state.errors.step1 != null && this.state.errors.step1.vertices != null}>
                                <label>Nombre de sommets</label>
                                <Input type="number" name="vertices" placeholder='Nombre de sommets' value={verticesValue} onChange={this.handleTextInputChange} onKeyPress={this.handleSubmitStep1} />
                                {this.state.errors.step1 != null && this.state.errors.step1.vertices != null ? <Message error size="tiny" content={this.state.errors.step1.vertices} /> : null}
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <label>Description</label>
                            <TextArea placeholder='Description' name="description" autoHeight value={descriptionValue} onChange={this.handleTextInputChange} onKeyPress={this.handleSubmitStep1} />
                        </Form.Field>
                    </Container>
                </Form>
            );
            modalActions = (
                <span>
                    <Button content="Annuler" onClick={this.closeModal} />
                    <Button primary icon="arrow right" content="Suivant" labelPosition="right" onClick={this.handleSubmitStep1} />
                </span>
            );
        } else if (this.state.step === 2) {
            // Saisie des tags
            modalContent = (
                <Form>
                    <Container fluid>
                        <Header dividing size="small"><Icon name="tags" />Tags</Header>
                        {this.renderCategories()}
                    </Container>
                </Form>
            );
            modalActions = (
                <span>
                    <Button content="Annuler" onClick={this.closeModal} />
                    <Button primary icon="arrow left" content="Précédent" labelPosition="left" onClick={this.handlePreviousStep} />
                    <Button primary icon="arrow right" content="Suivant" labelPosition="right" onClick={this.handleSubmitStep2} />
                </span>
            );
        } else if (this.state.step === 3) {
            // Saisie des illustrations
            let existingImages = [];
            if (this.state.data.images != null && this.state.data.images.length > 0) {
                const self = this;
                existingImages = this.state.data.images.map(function(image, i) {
                    return (
                        <div className="NouveauMaillage-file" key={i}>
                            <Image src={baseApiUrl + image.thumbUri} spaced rounded size="mini" floated="left" />
                            <div><strong>Image {i + 1}</strong></div>
                            <div><a href="" title="Supprimer" onClick={self.handleDeleteExistingImage.bind(self, i)}><Icon name="trash outline" />Supprimer</a></div>
                        </div>
                    );
                });
            }
            let imagesList = [];
            if (this.state.data.newImages != null) {
                const self = this;
                imagesList = this.state.data.newImages.map(function(newImage, i) {
                    return (
                        <div className="NouveauMaillage-file" key={i}>
                            <Image src={newImage.preview} spaced rounded size="mini" floated="left" />
                            <div><strong>{newImage.name}</strong></div>
                            <div><a href="" title="Supprimer" onClick={self.handleDeleteNewImage.bind(self, i)}><Icon name="trash outline" />Supprimer</a></div>
                        </div>
                    );
                });
            }
            modalContent = (
                <Container fluid>
                    <Header dividing size="small"><Icon name="image" />Images</Header>
                    <p>Vous pouvez illustrer votre fichier de maillage par une ou plusieurs images.</p>
                    <Dropzone accept="image/jpeg, image/gif, image/png" maxSize={10485760} onDrop={this.handleImageDrop} style={{"width": "100%", "height": "80px", "borderWidth": "2px", "borderWolor": "rgb(102, 102, 102)", "borderStyle": "dashed", "borderRadius": "5px", "textAlign": "center", "padding": "20px 0 15px 0", "fontSize": "13px", "cursor": "pointer"}}>
                        <div><Icon name="file image outline" size="large" /></div>
                        <p><strong>Cliquez</strong> sur cette zone ou faites-y <strong>glisser</strong> des images.</p>
                    </Dropzone>
                    {existingImages.length > 0 ? (
                        <span>
                            <Divider hidden />
                            <Header size="tiny">Images existantes</Header>
                            {existingImages}
                        </span>
                    ) : null}
                    {imagesList.length > 0 ? (
                        <span>
                            <Divider hidden />
                            <Header size="tiny">Nouvelles images</Header>
                            {imagesList}
                        </span>
                    ) : null}
                </Container>
            );
            modalActions = (
                <span>
                    <Button content="Annuler" onClick={this.closeModal} />
                    <Button primary icon="arrow left" content="Précédent" labelPosition="left" onClick={this.handlePreviousStep} />
                    <Button primary icon="arrow right" content="Suivant" labelPosition="right" onClick={this.handleSubmitStep3} />
                </span>
            );
        } else if (this.state.step === 4) {
            // Saisie du fichier de maillage
            modalContent = (
                <Container fluid>
                    <Header dividing size="small"><Icon name="file outline" />Fichier de maillage</Header>
                    {this.state.errors.step4 != null ? <Message error header="Erreur" content="Il y a des erreurs dans le formulaire !" /> : null}
                    <Dropzone maxSize={104857600} onDrop={this.handleMeshDrop} style={{"width": "100%", "height": "80px", "borderWidth": "2px", "borderWolor": "rgb(102, 102, 102)", "borderStyle": "dashed", "borderRadius": "5px", "textAlign": "center", "padding": "20px 0 15px 0", "fontSize": "13px", "cursor": "pointer"}}>
                        <div><Icon name="file image outline" size="large" /></div>
                        <p><strong>Cliquez</strong> sur cette zone ou faites-y <strong>glisser</strong> un fichier.</p>
                    </Dropzone>
                    {this.state.errors.step4 != null && this.state.errors.step4.mesh != null ? <Message error size="tiny" content={this.state.errors.step4.mesh} /> : null}
                    {this.state.data.mesh != null && this.state.data.newMesh == null ? (
                        <span>
                            <Divider hidden />
                            <Header size="tiny">Fichier de maillage existant</Header>
                            <div className="NouveauMaillage-file">
                                <div style={{float: "left"}}><Icon name="file outline" /></div>
                                <div><strong>{this.state.data.mesh}</strong></div>
                                <div><a href="" title="Supprimer" onClick={this.handleDeleteExistingMesh}><Icon name="trash outline" />Supprimer</a></div>
                            </div>
                        </span>
                    ) : null}
                    {this.state.data.mesh == null && this.state.data.newMesh != null ? (
                        <span>
                            <Divider hidden />
                            <Header size="tiny">Nouveau fichier de maillage</Header>
                            <div className="NouveauMaillage-file">
                                <div style={{float: "left"}}><Icon name="file outline" /></div>
                                <div><strong>{this.state.data.newMesh.name}</strong></div>
                                <div><a href="" title="Supprimer" onClick={this.handleDeleteNewMesh}><Icon name="trash outline" />Supprimer</a></div>
                            </div>
                        </span>
                    ) : null}
                </Container>
            );
            modalActions = (
                <span>
                    <Button content="Annuler" onClick={this.closeModal} />
                    <Button primary icon="arrow left" content="Précédent" labelPosition="left" onClick={this.handlePreviousStep} />
                    <Button primary icon="save" content="Enregistrer" labelPosition="left" onClick={this.handleSubmitStep4} />
                </span>
            );
        } else if (this.state.step === 5) {
            // Barre de progression
            const uploadComplete = this.state.uploadProgress === this.state.uploadTotal;
            modalContent = (
                <Container fluid>
                    <Header dividing size="small"><Icon name="upload" />Enregistrement en cours</Header>
                    <p>L'envoi de votre fichier de maillage est en cours. Merci de patentier.</p>
                    {uploadComplete ? <Message icon positive><Icon name="checkmark" />Envoi du fichier de maillage effectué avec succès</Message> : null}
                    <Progress value={this.state.uploadProgress} total={this.state.uploadTotal} color="blue" active={!uploadComplete} success={uploadComplete && !this.state.uploadError} error={this.state.uploadError} progress="percent" />
                </Container>
            );
            modalActions = (
                <span>
                    <Button disabled={uploadComplete} content="Annuler" onClick={this.handleCancelUpload} />
                    <Button primary disabled={!uploadComplete} content="Fermer" onClick={this.closeModal} />
                </span>
            );
        }

        return (
            <Modal onOpen={this.openModal} open={this.state.isOpened} trigger={this.props.children} closeIcon onClose={this.closeModal}>
                <Modal.Header>{modalTitle}</Modal.Header>
                <Modal.Content>{modalContent}</Modal.Content>
                <Modal.Actions>{modalActions}</Modal.Actions>
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
