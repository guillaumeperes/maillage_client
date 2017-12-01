import React from "react";
import { Component } from "react";
import { Dropdown, Icon, Menu } from "semantic-ui-react";
import LoginModal from "../LoginModal/LoginModal";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "./BarreDuHautAvecLaBareDeRecherche.css";

class BarreDuHautAvecLaBareDeRecherche extends Component {
    static propTypes = {
        "match": PropTypes.object.isRequired,
        "location": PropTypes.object.isRequired,
        "history": PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.clicHome = this.clicHome.bind(this);
        this.clicGestUser = this.clicGestUser.bind(this);
        this.clicGestTag = this.clicGestTag.bind(this);
    }

    render() {
        return (
            <Menu fixed="top" size="small" borderless fluid color="grey" inverted className="BarreDuHautAvecLaBareDeRecherche">
                <Menu.Item header link onClick={this.clicHome}>
                    <Icon name="fort awesome" size="big" />Le Château Fort
                </Menu.Item>
                <Dropdown item icon={<Icon link name="settings" size="large" />}>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.clicGestUser}><Icon name="users" /> Gestion des utilisateurs</Dropdown.Item>
                        <Dropdown.Item onClick={this.clicGestTag}><Icon name="tags" /> Gestion des tags</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Menu position="right">
                    <LoginModal>
                        <Menu.Item link>
                            <Icon size="large" name="user" /> Connexion
                        </Menu.Item>
                    </LoginModal>
                </Menu.Menu>
            </Menu>
        );
    }

    clicGestUser(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/admin/users") {
            this.props.history.push("/admin/users");
        }
    }

    clicGestTag(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/admin/tags") {
            this.props.history.push("/admin/tags");
        }
    }

    clicHome(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/") {
            this.props.history.push("/");
        }
    }
}

BarreDuHautAvecLaBareDeRecherche = withRouter(BarreDuHautAvecLaBareDeRecherche);
export default BarreDuHautAvecLaBareDeRecherche;
