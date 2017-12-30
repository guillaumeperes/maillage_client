import React from "react";
import { Component } from "react";
import { Header } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Dropdown } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Responsive } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Scrollbars } from "react-custom-scrollbars";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import NouveauMaillage from "../NouveauMaillage/NouveauMaillage";
import ViewMeshModal from "../ViewMeshModal/ViewMeshModal";
import { connect } from "react-redux";
import swal from "sweetalert";
import { toast } from "react-toastify";
import tinycolor from "tinycolor2";
import { setSelectedSort } from "../../actions.js";
import "./MeshesList.css";

class MeshesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "meshes": [],
            "count": 0,
            "sorts": [],
            "page": 1,
            "pageSize": 20,
            "loadMore": true
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    componentWillMount() {
        const self = this;
        let promises = [];

        // Chargement des fichiers de maillage
        const searchRoute = baseApiUrl + "/meshes/search/";
        const params = {
            "page": this.state.page,
            "pageSize": this.state.pageSize
        };
        promises[0] = axios.get(searchRoute, {"params": params}).then(function(response) {
            self.setState(Object.assign({}, self.state, {
                "meshes": response.data.results,
                "count": response.data.count,
                "loadMore": response.data.count < self.state.pageSize ? false : true
            }));
        });
        // Chargement des options de tri disponibles
        const sortsRoute = baseApiUrl + "/meshes/sorts/";
        promises[1] = axios.get(sortsRoute).then(function(response) {
            const defaultSort = response.data.find(function(sort) {
                return sort.default;
            });
            self.props.setSelectedSortOnStore(defaultSort.name);
            self.setState(Object.assign({}, self.state, {
                "sorts": response.data
            }));
        });
        Promise.all(promises).then(function() {
            self.setState(Object.assign({}, self.state, {
                "isLoading": false
            }));
        }).catch(function() {
            swal({
                "title": "Erreur",
                "text": "Une erreur s'est produite.",
                "dangerMode": true,
                "icon": "error",
                "button": "Fermer"
            }).catch(swal.noop);
            self.setState(Object.assign({}, self.state, {
                "isLoading": false,
                "meshes": [],
                "count": 0,
                "sorts": [],
                "page": 1,
                "loadMore": false
            }));
        });
    }

    componentWillReceiveProps(nextProps) {
        const self = this;
        self.setState(Object.assign({}, self.state, {
            "isLoading": true,
            "meshes": [],
            "count": 0,
            "page": 1,
            "loadMore": true
        }));
        let params = {
            "page": 1,
            "pageSize": this.state.pageSize,
            "sort": nextProps.selectedSort
        };
        if (nextProps.selectedFilters.length > 0) {
            params.filters = nextProps.selectedFilters;
        }
        const route = baseApiUrl + "/meshes/search/";
        axios.get(route, {"params": params}).then(function(response) {
            self.setState(Object.assign({}, self.state, {
                "isLoading": false,
                "meshes": response.data.results,
                "count": response.data.count,
                "loadMore": response.data.results.length < self.state.pageSize ? false : true
            }));
        }).catch(function(error) {
            swal({
                "title": "Erreur",
                "text": "Une erreur s'est produite.",
                "dangerMode": true,
                "icon": "error",
                "button": "Fermer"
            }).catch(swal.noop);
            self.setState(Object.assign({}, self.state, {
                "isLoading": false,
                "meshes": [],
                "count": 0,
                "sorts": [],
                "page": 1,
                "loadMore": false
            }));
        });
    }

    downloadMesh(meshId) {
        const route = baseApiUrl + "/mesh/" + meshId + "/download/";
        axios.get(route + "?check=1").then(function(result) {
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

    deleteMesh(meshId) {
        const self = this;
        swal({
            "title": "Attention",
            "text": "Souhaitez-vous vraiment supprimer ce fichier de maillage ?",
            "icon": "warning",
            "dangerMode": true,
            "closeOnClickOutside": false,
            "buttons": {
                "cancel": "Non",
                "delete": "Oui"
            }
        }).then(function(value) {
            if (value === "delete") {
                const route = baseApiUrl + "/mesh/" + meshId + "/delete/?token=" + self.props.userToken;
                axios.delete(route).then(function(result) {
                    let meshes = self.state.meshes;
                    const index = meshes.findIndex(function(mesh) {
                        return mesh.id === meshId;
                    });
                    if (index !== -1) {
                        meshes.splice(index, 1);
                        toast.success("Le fichier de maillage a été supprimé avec succès.");
                        self.setState(Object.assign({}, self.state, {
                            "meshes": meshes,
                            "count": self.state.count - 1
                        }));
                    }
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
        });
    }

    handleScroll(values) {
        if (values.top * 100 > 80 && this.state.loadMore) {
            const self = this;
            const params = {
                "page": this.state.page + 1,
                "pageSize": this.state.pageSize,
                "sort": this.props.selectedSort
            };
            if (this.props.selectedFilters.length > 0) {
                params.filters = this.props.selectedFilters;
            }
            const searchRoute = baseApiUrl + "/meshes/search/";
            axios.get(searchRoute, {"params": params}).then(function(response) {
                let meshes = self.state.meshes;
                response.data.results.forEach(function(result) {
                    meshes.push(result);
                });
                self.setState(Object.assign({}, self.state, {
                    "meshes": meshes,
                    "page": self.state.page + 1,
                    "loadMore": response.data.results.length < self.state.pageSize ? false : true
                }));
            }).catch(function() {
                swal({
                    "title": "Erreur",
                    "text": "Une erreur s'est produite.",
                    "dangerMode": true,
                    "icon": "error",
                    "button": "Fermer"
                }).catch(swal.noop);
                self.setState(Object.assign({}, self.state, {
                    "isLoading": false,
                    "meshes": [],
                    "count": 0,
                    "sorts": [],
                    "currentSort": null,
                    "page": 1,
                    "loadMore": false
                }));
            });
        }
    }

    handleSortChange(e, data) {
        this.props.setSelectedSortOnStore(data.value);
    }

    renderMeshes() {
        const self = this;
        const out = this.state.meshes.map(function(mesh, i) {
            // Miniature
            let thumb = null;
            if (typeof mesh.images[0].thumbUri === "string") {
                thumb = <Image width="70px" height="70px" verticalAlign="middle" alt={mesh.title} shape="rounded" floated="left" src={baseApiUrl + mesh.images[0].thumbUri} />;
            }
            // Date de création
            const d = new Date(mesh.created);
            const created = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            // Tags
            let meshTags = [];
            if (mesh.tags.length > 0) {
                meshTags = mesh.tags.map(function(tag, i) {
                    if (tinycolor(tag.category.color).isLight()) {
                        return <Label key={i} as="span" style={{ backgroundColor: tag.category.color }} size="small">{tag.title}</Label>
                    } else {
                        return <Label key={i} as="span" style={{ backgroundColor: tag.category.color, color: "white" }} size="small">{tag.title}</Label>
                    }
                });
            }
            return (
                <Segment key={i} raised size="small">
                    <Grid stackable columns={3}>
                        <Grid.Row>
                            <Grid.Column width={9} verticalAlign="middle">
                                {thumb}
                                <div>
                                    <Header as="h2" size="small">{mesh.title}</Header>
                                    <div className="MeshesList-small">#{mesh.id}</div>
                                    <div className="MeshesList-small">{created}</div>
                                    { meshTags.length > 0 ? <div className="MeshesList-tags">{meshTags}</div> : null }
                                </div>
                            </Grid.Column>
                            <Grid.Column width={4} textAlign="center" verticalAlign="middle">
                                <div><strong>{parseInt(mesh.cells, 10).toLocaleString()}</strong> cellules</div>
                                <div><strong>{parseInt(mesh.vertices, 10).toLocaleString()}</strong> sommets</div>
                            </Grid.Column>
                            <Grid.Column width={3} textAlign="right" verticalAlign="middle">
                                <Dropdown icon={<Icon title="Actions" link name="setting" size="large" />}>
                                    <Dropdown.Menu className="left">
                                        <ViewMeshModal meshId={mesh.id}><Dropdown.Item><Icon name="eye" />Ouvrir</Dropdown.Item></ViewMeshModal>
                                        {self.props.userToken !== null && self.props.userRoles.indexOf("contributor") !== -1 ? <NouveauMaillage meshId={mesh.id}><Dropdown.Item><Icon name="pencil" />Modifier</Dropdown.Item></NouveauMaillage> : null}
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={self.downloadMesh.bind(self, mesh.id)}><Icon name="download" />Télécharger</Dropdown.Item>
                                        {self.props.userToken !== null && self.props.userRoles.indexOf("contributor") !== -1 ? <Dropdown.Divider /> : null}
                                        {self.props.userToken !== null && self.props.userRoles.indexOf("contributor") !== -1 ? <Dropdown.Item onClick={self.deleteMesh.bind(self, mesh.id)}><Icon name="trash" color="red" /><span style={{ color: "rgb(219, 40, 40)" }}>Supprimer</span></Dropdown.Item> : null}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            );
        });
        return out;
    }

    renderSortDropdown() {
        const options = this.state.sorts.map(function(sort, i) {
            return {
                "key": i,
                "value": sort.name,
                "text": sort.label
            };
        });
        if (this.state.isLoading) {
            return <Dropdown loading disabled text="En cours de chargement" />;
        } else {
            return <Dropdown value={this.props.selectedSort} options={options} onChange={this.handleSortChange} placeholder="Choisir un critère de tri" />;
        }
    }

    render() {
        let mainContent = null; // contenu principal (icône de chargement en cours, liste de fichiers de maillage, etc.)

        if (this.state.isLoading) {
            mainContent = (
                <Dimmer.Dimmable as="div">
                    <Dimmer active inverted className="MeshesList-loader">
                        <Loader size="medium" inverted>Chargement en cours</Loader>
                    </Dimmer>
                </Dimmer.Dimmable>
            );
        } else if (this.state.meshes.length === 0) {
            mainContent = (
                <Container textAlign="center" text className="MeshesList-empty">
                    <Icon name="search" size="huge" color="grey" />
                    <div>Aucun résulat.</div>
                </Container>
            );
        } else {
            mainContent = (
                <div>
                    <Divider hidden />
                    {this.renderMeshes()}
                </div>
            );
        }

        return (
            <div className="MeshesList">
                <Scrollbars style={{ width: "100%", height: "calc(100% - 50px)" }} onScrollFrame={this.handleScroll}>
                    <div className="MeshesList-scroller">
                        <Input fluid action={<Button primary icon="search" title="Rechercher" />} />
                        <Divider hidden />
                        <Responsive maxWidth={992}>
                            <Container fluid textAlign="center">
                                <div><strong>{this.state.count}</strong> <span className="MeshesList-metaCountLabel">fichiers trouvés</span></div>
                                <div><span className="MeshesList-metaSortLabel">Trier par :</span>{this.renderSortDropdown()}</div>
                            </Container>
                        </Responsive>
                        <Responsive minWidth={993}>
                            <Grid columns={2}>
                                <Grid.Column width={8} textAlign="left">
                                    <span className="MeshesList-metaSortLabel">Trier par :</span>{this.renderSortDropdown()}
                                </Grid.Column>
                                <Grid.Column width={8} textAlign="right">
                                    <strong>{this.state.count}</strong> <span className="MeshesList-metaCountLabel">fichiers trouvés</span>
                                </Grid.Column>
                            </Grid>
                        </Responsive>
                        {mainContent}
                    </div>
                </Scrollbars>
            </div>
        );
    }
}

const mapStoreToProps = function(store) {
    const selectedFilters = store.filters.selectedFilters.slice();
    return {
        "selectedFilters": selectedFilters,
        "userToken": store.users.userToken,
        "userRoles": store.users.userRoles,
        "selectedSort": store.sorts.selectedSort
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        "setSelectedSortOnStore": function(sort) {
            dispatch(setSelectedSort(sort));
        }
    };
};

MeshesList = connect(mapStoreToProps, mapDispatchToProps)(MeshesList);
export default MeshesList;
