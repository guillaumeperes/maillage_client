import React from "react";
import { Component } from "react";
import { baseApiUrl } from "../../conf";
import axios from "axios";
import { Checkbox } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Scrollbars } from "react-custom-scrollbars";
import "./TagsSidebar.css";

export default class TagsSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "categories": []
        };
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
        let out = tags.map(function(tag, i) {
            return (
                <div key={i}>
                    <Checkbox label={tag.title} />
                </div>
            );
        });
        return out;
    }

    renderCategories(categories) {
        let self = this;
        let out = categories.map(function(category, i) {
            return (
                <Container className="TagsSidebar-category" key={i}>
                    <Header as="h4">{category.title}</Header>
                    <div>
                        { self.renderTags(category.tags) }
                    </div>
                </Container>
            );
        });
        return out;
    }

    render() {
        return (
            <Scrollbars autoHide style={{ position:"fixed", width: "250px", height: "100%" }} className="TagsSidebar">
                <div className="TagsSidebar-title">
                    Filtrer par
                </div>
                <div className="TagsSidebar-list">
                    { this.renderCategories(this.state.categories) }
                </div>
            </Scrollbars>
        );
    }
}
