import React from "react";
import { Component } from "react";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import { Checkbox } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { addFilter } from "../../actions.js";
import { removeFilter } from "../../actions.js";
import "./TagsSidebar.css";

class TagsSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "categories": []
        };
        this.checkboxTagChange = this.checkboxTagChange.bind(this);
    }

    componentDidMount() {
        let self = this;
        let route = baseApiUrl + "/categories/list/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "categories": response.data
            });
        }).catch(function(error) {
            console.log(error); // Todo : rediriger vers une page d'erreur
        });
    }

    renderTags(tags) {
        let self = this;
        let out = tags.map(function(tag, i) {
            let index = self.props.selectedFilters.findIndex(function(filter) {
                return filter.id === tag.id;
            });
            return (
                <div key={i}>
                    <Checkbox label={tag.title} defaultChecked={index !== -1} id={tag.id} title={tag.title} onChange={self.checkboxTagChange} />
                </div>
            );
        });
        return out;
    }

    checkboxTagChange(e, data) {
        let selectedFilter = {};
        this.state.categories.forEach(function(category) {
            category.tags.forEach(function(tag) {
                if (tag.id === data.id) {
                    selectedFilter = tag;
                }
            });
        });
        if (typeof selectedFilter.id !== "undefined") {
            if (data.checked === true) {
                this.props.addFilterOnStore(selectedFilter);
            } else if (data.checked === false) {
                this.props.removeFilterOnStore(selectedFilter);
            }
        }
    }

    renderCategories(categories) {
        let self = this;
        let out = categories.map(function(category, i) {
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
        return (
            <div className="TagsSidebar">
                <div className="TagsSidebar-title"><Icon name="filter" />Filtrer par</div>
                <Scrollbars autoHide style={{ width: "100%", height: "calc(100% - 100px)" }}>
                    <div className="TagsSidebar-list">
                        { this.renderCategories(this.state.categories) }
                    </div>
                </Scrollbars>
            </div>
        );
    }
}

const mapStoreToProps = function(store) {
    return {
        "selectedFilters": store.filters.selectedFilters
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        "addFilterOnStore": function(filter) {
            dispatch(addFilter(filter));
        },
        "removeFilterOnStore": function(filter) {
            dispatch(removeFilter(filter));
        }
    };
};

TagsSidebar = connect(mapStoreToProps, mapDispatchToProps)(TagsSidebar);
export default TagsSidebar;
