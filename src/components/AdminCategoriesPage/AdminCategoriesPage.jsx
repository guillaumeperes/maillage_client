import React from "react";
import { Component } from "react";
import { Icon } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Responsive } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Accordion } from "semantic-ui-react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import CategoryModal from "../CategoryModal/CategoryModal";
import TagModal from "../TagModal/TagModal";
import axios from "axios";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { baseApiUrl } from "../../conf";
import { connect } from "react-redux";
import tinycolor from "tinycolor2";
import "./AdminCategoriesPage.css";

class AdminCategoriesPage extends Component {
    constructor(props) {
        super(props);
        document.title = "Gestion des catégories | Le château fort";
        window.scrollTo(0, 0);
        this.state = {
            "isLoading": true,
            "categories": [],
            "activeCategory": -1
        };
        this.handleOpenCategory = this.handleOpenCategory.bind(this);
        this.handleNewCategory = this.handleNewCategory.bind(this);
        this.handleEditCategory = this.handleEditCategory.bind(this);
        this.handleNewTag = this.handleNewTag.bind(this);
        this.handleEditTag = this.handleEditTag.bind(this);
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

    componentDidMount() {
        const self = this;
        const route = baseApiUrl + "/categories/alltags/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "categories": response.data,
                "activeCategory": -1
            });
        }).catch(function(error) {
            self.setState({
                "isLoading": false,
                "categories": [],
                "activeCategory": -1
            });
        });
    }

    handleNewCategory(category) {
        let categories = this.state.categories;
        categories.push(category);
        categories.sort(function(a, b) {
            let c = a.title.localeCompare(b.title);
            if (c === 0) {
                c = a.id < b.id ? -1 : 1;
            }
            return c;
        });
        const state = Object.assign({}, this.state, {
            "categories": categories
        });
        this.setState(state);
        toast.success("La catégorie a été créée avec succès.");
    }

    handleEditCategory(category) {
        let categories = this.state.categories;
        const index = categories.findIndex(function(c) {
            return c.id === category.id;
        });
        categories.splice(index, 1, category);
        categories.sort(function(a, b) {
            let c = a.title.localeCompare(b.title);
            if (c === 0) {
                c = a.id < b.id ? -1 : 1;
            }
            return c;
        });
        const state = Object.assign({}, this.state, {
            "categories": categories
        });
        this.setState(state);
        toast.success("La catégorie a été modifiée avec succès.");
    }

    handleDeleteCategory(categoryId, e) {
        e.stopPropagation();
        const self = this;
        swal({
            "title": "Attention",
            "text": "Êtes-vous certain de vouloir supprimer cette catégorie et les tags qu'elle contient ?",
            "icon": "warning",
            "dangerMode": true,
            "buttons": {
                "cancel": "Annuler",
                "delete": "Supprimer"
            }
        }).then(function(value) {
            if (value === "delete") {
                const route = baseApiUrl + "/categories/" + categoryId + "/delete/?token=" + self.props.userToken;
                axios.delete(route).then(function(result) {
                    let categories = self.state.categories;
                    const index = categories.findIndex(function(c) {
                        return c.id === categoryId;
                    });
                    categories.splice(index, 1);
                    const state = Object.assign({}, self.state, {
                        "categories": categories
                    });
                    self.setState(state);
                    toast.success("La categorie a été supprimée avec succès.");
                }).catch(function(error) {
                    if (error.response != null) {
                        self.throwSweetError(error.response.data.error);
                    } else {
                        self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                    }
                });
            }
        });
    }

    handleNewTag(category, tag) {
        let categories = this.state.categories;
        const cindex = categories.findIndex(function(c) {
            return c.id === category.id;
        });
        categories[cindex].tags.push(tag);
        categories[cindex].tags.sort(function(a, b) {
            let c = a.title.localeCompare(b.title);
            if (c === 0) {
                c = a.id < b.id ? -1 : 1;
            }
            return c;
        });
        const state = Object.assign({}, this.state, {
            "categories": categories
        });
        this.setState(state);
        toast.success("Le tag a été créé avec succès.");
    }

    handleEditTag(category, tag) {
        let categories = this.state.categories;
        const cindex = categories.findIndex(function(c) {
            return c.id === category.id;
        });
        const tindex = categories[cindex].tags.findIndex(function(t) {
            return t.id === tag.id;
        });
        categories[cindex].tags.splice(tindex, 1, tag);
        categories[cindex].tags.sort(function(a, b) {
            let c = a.title.localeCompare(b.title);
            if (c === 0) {
                c = a.id < b.id ? -1 : 1;
            }
            return c;
        });
        const state = Object.assign({}, this.state, {
            "categories": categories
        });
        this.setState(state);
        toast.success("Le tag a été modifié avec succès.");
    }

    handleDeleteTag(categoryId, tagId, e) {
        const self = this;
        swal({
            "title": "Attention",
            "text": "Êtes-vous certain de vouloir supprimer ce tag ?",
            "icon": "warning",
            "dangerMode": true,
            "buttons": {
                "cancel": "Annuler",
                "delete": "Supprimer"
            }
        }).then(function(value) {
            if (value === "delete") {
                const route = baseApiUrl + "/tags/" + tagId + "/delete/?token=" + self.props.userToken;
                axios.delete(route).then(function(result) {
                    let categories = self.state.categories;
                    const cindex = categories.findIndex(function(c) {
                        return c.id === categoryId;
                    });
                    const tagindex = categories[cindex].tags.findIndex(function(t) {
                        return t.id === tagId;
                    });
                    categories[cindex].tags.splice(tagindex, 1);
                    const state = Object.assign({}, self.state, {
                        "categories": categories
                    });
                    self.setState(state);
                    toast.success("Le tag a été supprimé avec succès.");
                }).catch(function(error) {
                    if (error.response != null) {
                        self.throwSweetError(error.response.data.error);
                    } else {
                        self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                    }
                });
            }
        });
    }

    handleOpenCategory(e, item) {
        if (this.state.activeCategory !== item.index) {
            const state = Object.assign({}, this.state, {
                "activeCategory": item.index
            });
            this.setState(state);
        } else {
            const state = Object.assign({}, this.state, {
                "activeCategory": -1
            });
            this.setState(state);
        }
    }

    render() {
        let content = '';
        if (this.state.isLoading) {
            content = (
                <Dimmer.Dimmable as="div" className="AdminCategoriesPage-loader">
                    <Dimmer active inverted>
                        <Loader size="medium" inverted>Chargement en cours</Loader>
                    </Dimmer>
                </Dimmer.Dimmable>
            );
        } else if (this.state.categories.length === 0) {
            content = (
                <Container fluid textAlign="center">
                    <Icon name="search" size="huge" color="grey" />
                    <div>Aucune catégorie trouvée.</div>
                </Container>
            );
        } else {
            const self = this;
            const categories = this.state.categories.map(function(category, i) {
                let tagsList = <p>Aucun tag n'a été créé pour cette catégorie. Ajoutez des tags en cliquant sur le bouton <em>Ajouter un tag</em>.</p>;
                if (category.tags.length > 0) {
                    const tags = category.tags.map(function(tag, i) {
                        return (
                            <List.Item key={i}>
                                <Grid stackable columns={2} padded={false} verticalAlign="middle">
                                    <Grid.Row>
                                        <Grid.Column width={9}>
                                            { tinycolor(category.color).isLight() ? <Label style={{ backgroundColor: category.color }} size="medium">{tag.title}</Label> : <Label style={{ backgroundColor: category.color, color: "white" }} size="medium">{tag.title}</Label> }
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                            { tag.meshes.length > 0 ? tag.meshes.length + " maillages associés" : null }
                                        </Grid.Column>
                                        <Grid.Column textAlign="right" width={3}>
                                            {!tag.protected ? <TagModal categoryId={category.id} tagId={tag.id} onSave={self.handleEditTag}><span data-tooltip="Modifier ce tag"><Icon name="pencil" size="large" link /></span></TagModal> : null }
                                            {!tag.protected ? <span data-tooltip="Supprimer ce tag"><Icon name="trash outline" link size="large" onClick={self.handleDeleteTag.bind(self, category.id, tag.id)} /></span> : null }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Item>
                        );
                    });
                    tagsList = <List divided relaxed>{tags}</List>;
                }

                return (
                    <div key={i}>
                        <Accordion.Title as={Header} size="small" index={category.id} active={self.state.activeCategory === category.id} onClick={self.handleOpenCategory}>
                            <Icon name="dropdown" /> {category.title} ({category.tags.length})
                        </Accordion.Title>
                        <Accordion.Content active={self.state.activeCategory === category.id}>
                            {tagsList}
                            <Divider hidden />
                            <TagModal categoryId={category.id} onSave={self.handleNewTag}>
                                <span>
                                     <Responsive as="span" maxWidth={768}>
                                        <Button primary fluid icon="plus" content="Ajouter un tag" labelPosition="left" />
                                    </Responsive>
                                    <Responsive as="span" minWidth={769}>
                                        <Button primary icon="plus" content="Ajouter un tag" labelPosition="left" />
                                    </Responsive>
                                </span>
                            </TagModal>
                            <Responsive as="span" maxWidth={768}>
                                <span>
                                    {!category.protected ? <span><Divider hidden /><CategoryModal onSave={self.handleEditCategory} categoryId={category.id}><Button primary fluid icon="pencil" content="Modifier" labelPosition="left" /></CategoryModal></span> : null }
                                    {!category.protected ? <span><Divider hidden /><Button primary fluid icon="trash outline" content="Supprimer" labelPosition="left" onClick={self.handleDeleteCategory.bind(self, category.id)} /></span> : null }
                                </span>
                            </Responsive>
                            <Responsive as="span" minWidth={769}>
                                <span>
                                    {!category.protected ? <CategoryModal onSave={self.handleEditCategory} categoryId={category.id}><Button primary icon="pencil" content="Modifier" labelPosition="left" /></CategoryModal> : null }
                                    {!category.protected ? <Button primary icon="trash outline" content="Supprimer" labelPosition="left" onClick={self.handleDeleteCategory.bind(self, category.id)} /> : null }
                                </span>
                            </Responsive>
                        </Accordion.Content>
                    </div>
                );
            });
            content = (
                <div>
                    <p><Icon name="arrow right" />Cliquez sur une catégorie pour dérouler son contenu et administrer les tags qu'elle contient.</p>
                    <Divider hidden />
                    <Accordion fluid styled>{categories}</Accordion>
                </div>
            );
        }

        return (
            <div className="AdminCategoriesPage">
                <BarreDuHautAvecLaBareDeRecherche />
                <Container className="AdminCategoriesPage-content">
                    <Header as="h1">
                        <Icon name="tags" />
                        <Header.Content>
                            Gestion des catégories
                            <Header.Subheader>Administration des catégories et de leurs tags associés.</Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Divider clearing hidden />
                    <CategoryModal onSave={this.handleNewCategory}>
                        <span>
                            <Responsive as="span" maxWidth={768}>
                                <Button primary fluid icon="plus" content="Ajouter une catégorie" labelPosition="left" />
                            </Responsive>
                            <Responsive as="span" minWidth={769}>
                                <Segment vertical floated="right"><Button primary icon="plus" content="Ajouter une catégorie" labelPosition="left" /></Segment>
                            </Responsive>
                        </span>
                    </CategoryModal>
                    <Divider clearing hidden />
                    {content}
                </Container>
                <Divider clearing fitted hidden />
                <Segment inverted vertical color="grey" className="AdminCategoriesPage-footer">
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

AdminCategoriesPage = connect(mapStoreToProps)(AdminCategoriesPage);
export default AdminCategoriesPage;
