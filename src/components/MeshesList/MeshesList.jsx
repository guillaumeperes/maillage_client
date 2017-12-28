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
import { Responsive } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Scrollbars } from "react-custom-scrollbars";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import filesize from "filesize";
import NouveauMaillage from "../NouveauMaillage/NouveauMaillage";
import ViewMeshModal from "../ViewMeshModal/ViewMeshModal";
import Recherche from "../Recherche/Recherche";
import { connect } from "react-redux";
import swal from "sweetalert";
import "./MeshesList.css";

class MeshesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "listLoading": true,
            "sortsLoading": true,
            "meshes": [],
            "sorts": []
        };
    }

    componentDidMount() {
        const self = this;
        // Chargement des fichiers de maillage depuis le serveur
        const route = baseApiUrl + "/meshes/search/";
        axios.get(route).then(function(response) {
            const state = Object.assign({}, self.state, {
                "listLoading": false,
                "meshes": response.data
            });
            self.setState(state);
        }).catch(function(error) {
            const state = Object.assign({}, self.state, {
                "listLoading": false,
                "meshes": []
            });
            self.setState(state);
        });
        // Chargement des option de tri depuis le serveur
        const routeSorts = baseApiUrl + "/meshes/sorts/";
        axios.get(routeSorts).then(function(response) {
            const state = Object.assign({}, self.state, {
                "sortsLoading": false,
                "sorts": response.data
            });
            self.setState(state);
        }).catch(function(error) {
            const state = Object.assign({}, self.state, {
                "sortsLoading": false,
                "sorts": []
            });
            self.setState(state);
        });
    }

    componentWillReceiveProps(nextProps) {
        const self = this;
        const state = Object.assign({}, self.state, {
            "listLoading": true,
            "meshes": []
        });
        self.setState(state);
        let params = {};
        if (nextProps.selectedFilters.length > 0) {
            params.filters = nextProps.selectedFilters;
        }
        const route = baseApiUrl + "/meshes/search/";
        axios.get(route, {"params": params}).then(function(response) {
            const state = Object.assign({}, self.state, {
                "listLoading": false,
                "meshes": response.data
            });
            self.setState(state);
        }).catch(function(error) {
            const state = Object.assign({}, self.state, {
                "listLoading": false,
                "meshes": []
            });
            self.setState(state);
        });
    }

    downloadMesh(meshId) {
        const route = baseApiUrl + "/mesh/" + meshId + "/download/";
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
                        <Dropdown icon={<Icon title="Actions" link name="setting" size="large" />}>
                            <Dropdown.Menu className="left">
                                <ViewMeshModal meshId={mesh.id}><Dropdown.Item><Icon name="eye" />Ouvrir</Dropdown.Item></ViewMeshModal>
                                {self.props.userToken !== null && self.props.userRoles.indexOf("contributor") !== -1 ? <NouveauMaillage meshId={mesh.id}><Dropdown.Item><Icon name="pencil" />Modifier</Dropdown.Item></NouveauMaillage> : null}
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={self.downloadMesh.bind(self, mesh.id)}><Icon name="download" />Télécharger</Dropdown.Item>
                                {self.props.userToken !== null && self.props.userRoles.indexOf("contributor") !== -1 ? <Dropdown.Divider /> : null}
                                {self.props.userToken !== null && self.props.userRoles.indexOf("contributor") !== -1 ? <Dropdown.Item><Icon name="trash" color="red" /><span style={{ color: "rgb(219, 40, 40)" }}>Supprimer</span></Dropdown.Item> : null}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Grid.Column>
                </Grid.Row>
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
        const defaultSort = this.state.sorts.find(function(sort) {
            return sort.default;
        });
        if (this.state.sortsLoading) {
            return <Dropdown loading disabled text="En cours de chargement" />;
        } else {
            return <Dropdown defaultValue={defaultSort.name} options={options} placeholder="Choisir un critère de tri" />;
        }
    }

    openMesh() {
        console.log("Open");
    }

    deleteMesh() {
        console.log("Delete");
    }

    render() {
        let mainContent = null; // contenu principal (icône de chargement en cours, liste de fichiers de maillage, etc.)

        if (this.state.listLoading) {
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
                    <Grid padded columns={4}>{ this.renderMeshes() }</Grid>
                </div>
            );
        }

        return (
            <div className="MeshesList">
                <Scrollbars style={{ width: "100%", height: "calc(100% - 50px)" }}>
                    <div className="MeshesList-scroller">
                        <Recherche />
                        <Divider hidden />
                        <Responsive maxWidth={992}>
                            <Container fluid textAlign="center">
                                <div><strong>{this.state.meshes.length}</strong> <span className="MeshesList-metaCountLabel">fichiers trouvés</span></div>
                                <div><span className="MeshesList-metaSortLabel">Trier par :</span>{ this.renderSortDropdown() }</div>
                            </Container>
                        </Responsive>
                        <Responsive minWidth={993}>
                            <Grid columns={2}>
                                <Grid.Column width={8} textAlign="left">
                                    <span className="MeshesList-metaSortLabel">Trier par :</span>{ this.renderSortDropdown() }
                                </Grid.Column>
                                <Grid.Column width={8} textAlign="right">
                                    <strong>{this.state.meshes.length}</strong> <span className="MeshesList-metaCountLabel">fichiers trouvés</span>
                                </Grid.Column>
                            </Grid>
                        </Responsive>
                        { mainContent }
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
        "userRoles": store.users.userRoles
    };
};

MeshesList = connect(mapStoreToProps)(MeshesList);
export default MeshesList;
