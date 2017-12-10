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
import { Table } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Accordion } from "semantic-ui-react";
import BarreDuHautAvecLaBareDeRecherche from "../BarreDuHautAvecLaBareDeRecherche/BarreDuHautAvecLaBareDeRecherche";
import CategoryModal from "../CategoryModal/CategoryModal";
import axios from "axios";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { baseApiUrl } from "../../conf";
import { connect } from "react-redux";
import "./AdminCategoriesPage.css";

class AdminCategoriesPage extends Component {
    constructor(props) {
        super(props);
        document.title = "Gestion des catégories | Le château fort";
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
        this.handleDeleteTag = this.handleDeleteTag.bind(this);
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
        const route = baseApiUrl + "/categories/allTags/";
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
                    if (error.response !== null) {
                        self.throwSweetError(error.response.data.error);
                    } else {
                        self.throwSweetError("Une erreur s'est produite. Merci de réessayer.");
                    }
                });
            }
        });
    }

    handleNewTag() {
        console.log("new tag");
        // TODO
    }

    handleEditTag() {
        console.log("edit tag");
        // TODO
    }

    handleDeleteTag() {
        console.log("delete tag");
        // TODO
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
                let tagsList = <p>Aucun tag n'a été créé pour cette catégorie.</p>;
                if (category.tags.length > 0) {
                    const tags = category.tags.map(function(tag, i) {
                        return (
                            <Table.Row key={i}>
                                <Table.Cell><Label style={{ backgroundColor: category.color }}>{tag.title}</Label></Table.Cell>
                                <Table.Cell>Actions</Table.Cell>
                            </Table.Row>
                        );
                    });
                    tagsList = (
                        <div>
                            <p>Tags associés à cette catégorie :</p>
                            <Table selectable stackable size="small">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Nom</Table.HeaderCell>
                                        <Table.HeaderCell>Actions</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>{tags}</Table.Body>
                            </Table>
                        </div>
                    );
                }

                return (
                    <div key={i}>
                        <Accordion.Title index={category.id} active={self.state.activeCategory === category.id} onClick={self.handleOpenCategory}>
                            <Grid columns={2}>
                                <Grid.Row>
                                    <Grid.Column width={12} textAlign="left">
                                        <Icon name="dropdown" /> {category.title}
                                    </Grid.Column>
                                    <Grid.Column width={4} textAlign="right">
                                        {!category.protected ? <CategoryModal onSave={self.handleEditCategory} categoryId={category.id}><span data-tooltip="Modifier cette catégorie"><Icon name="pencil" size="large" link /></span></CategoryModal> : null }
                                        {!category.protected ? <span data-tooltip="Supprimer cette catégorie"><Icon name="trash" size="large" link onClick={self.handleDeleteCategory.bind(self, category.id)} /></span> : null }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Accordion.Title>
                        <Accordion.Content active={self.state.activeCategory === category.id}>
                            {tagsList}
                            <Divider hidden />
                            <Responsive maxWidth={768}>
                                <Button primary fluid icon="plus" content="Ajouter un tag" labelPosition="left" onClick={self.handleNewTag} />
                            </Responsive>
                            <Responsive minWidth={769}>
                                <Button primary icon="plus" content="Ajouter un tag" labelPosition="left" onClick={self.handleNewTag} />
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
                            <Responsive maxWidth={768}>
                                <Button primary fluid icon="plus" content="Ajouter une catégorie" labelPosition="left" />
                            </Responsive>
                            <Responsive minWidth={769}>
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
