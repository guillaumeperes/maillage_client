import React from "react";
import { Component } from "react";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import { Checkbox } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { addFilter } from "../../actions.js";
import { removeFilter } from "../../actions.js";
import { triggerRefreshMeshList } from "../../actions.js";
import { triggerRefreshCategoriesList } from "../../actions.js";
import { Loader } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import NouveauMaillage from "../NouveauMaillage/NouveauMaillage";
import "./TagsSidebar.css";

class TagsSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "error": false,
            "categories": []
        };
        this.checkboxTagChange = this.checkboxTagChange.bind(this);
        this.handleMeshUploadSuccess = this.handleMeshUploadSuccess.bind(this);
    }

    componentDidMount() {
        const self = this;
        const route = baseApiUrl + "/categories/list/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "error": false,
                "categories": response.data
            });
        }).catch(function(error) {
            self.setState({
                "isLoading": false,
                "error": true,
                "categories": []
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.selectedFilters) === JSON.stringify(nextProps.selectedFilters) && 
            this.props.keyword === nextProps.keyword && 
            this.props.refreshCategoriesList === nextProps.refreshCategoriesList) {
            // Empêche la liste des catégories de se recharger inutilement
            return;
        }
        const self = this;
        let params = {};
        if (nextProps.selectedFilters.length > 0) {
            params.filters = nextProps.selectedFilters;
        }
        if (nextProps.keyword !== null && nextProps.keyword.length > 0) {
            params.keyword = nextProps.keyword;
        }
        const route = baseApiUrl + "/categories/list/";
        axios.get(route, {"params": params}).then(function(response) {
            self.setState({
                "isLoading": false,
                "error": false,
                "categories": response.data
            });
        }).catch(function(error) {
            self.setState({
                "isLoading": false,
                "error": true,
                "categories": []
            });
        });
    }

    renderTags(tags) {
        const self = this;
        const out = tags.map(function(tag, i) {
            const index = self.props.selectedFilters.indexOf(tag.id);
            const label = tag.title + " (" + tag.occurences + ")";
            return (
                <div key={i}>
                    <Checkbox label={label} checked={index !== -1} id={tag.id} title={tag.title} onChange={self.checkboxTagChange} />
                </div>
            );
        });
        return out;
    }

    checkboxTagChange(e, data) {
        let exists = false;
        this.state.categories.forEach(function(category) {
            category.tags.forEach(function(tag) {
                if (data.id === tag.id) {
                    exists = true;
                }
            });
        });
        if (exists) {
            if (data.checked === true) {
                this.props.addFilterOnStore(data.id);
            } else {
                this.props.removeFilterOnStore(data.id);
            }
        }
    }

    handleMeshUploadSuccess() {
        this.props.triggerRefreshCategoriesList();
        this.props.triggerRefreshMeshList();
    }

    renderCategories(categories) {
        const self = this;
        const out = categories.map(function(category, i) {
            return (
                <div className="TagsSidebar-category" key={i}>
                    <Header color="grey" size="tiny" as="h4">{category.title}</Header>
                    <div>
                        { self.renderTags(category.tags) }
                    </div>
                </div>
            );
        });
        return out;
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="TagsSidebar">
                    {this.props.userToken !== null && this.props.userRoles.indexOf("contributor") !== -1 ? <span><NouveauMaillage meshUploadSuccess={this.handleMeshUploadSuccess}><Button primary fluid icon="plus" content="Partager un maillage" labelPosition="left" /></NouveauMaillage><Divider hidden /></span> : null }
                    <div className="TagsSidebar-loader">
                        <Dimmer.Dimmable as="div">
                            <Dimmer active inverted>
                                <Loader size="small" inverted>Chargement en cours</Loader>
                            </Dimmer>
                        </Dimmer.Dimmable>
                    </div>
                </div>
            );
        } else {
            let nanoscrollerheight = "calc(100% - 30px)";
            if (this.props.userToken !== null && this.props.userRoles.indexOf("contributor") !== -1) {
                nanoscrollerheight = "calc(100% - 95px)";
            }
            return (
                <div className="TagsSidebar">
                    {this.props.userToken !== null && this.props.userRoles.indexOf("contributor") !== -1 ? <span><NouveauMaillage meshUploadSuccess={this.handleMeshUploadSuccess}><Button primary fluid icon="plus" content="Partager un maillage" labelPosition="left" /></NouveauMaillage><Divider hidden /></span> : null }
                    <Scrollbars style={{ width: "100%", height: nanoscrollerheight }}>
                        <div className="TagsSidebar-list">
                            { this.renderCategories(this.state.categories) }
                        </div>
                    </Scrollbars>
                </div>
            );
        }
    }
}

const mapStoreToProps = function(store) {
    const selectedFilters = store.filters.selectedFilters.slice();
    return {
        "selectedFilters": selectedFilters,
        "userToken": store.users.userToken,
        "userRoles": store.users.userRoles,
        "keyword": store.keyword.keyword,
        "refreshCategoriesList": store.refresh.refreshCategoriesList
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        "addFilterOnStore": function(filter) {
            dispatch(addFilter(filter));
        },
        "removeFilterOnStore": function(filter) {
            dispatch(removeFilter(filter));
        },
        "triggerRefreshCategoriesList": function() {
            dispatch(triggerRefreshCategoriesList());
        },
        "triggerRefreshMeshList": function() {
            dispatch(triggerRefreshMeshList());
        }
    };
};

TagsSidebar = connect(mapStoreToProps, mapDispatchToProps)(TagsSidebar);
export default TagsSidebar;
