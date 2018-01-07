import React from "react";
import { Component } from "react";
import { Dropdown, Icon, Menu } from "semantic-ui-react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { removeUserToken } from "../../actions.js";
import { removeUserRoles } from "../../actions.js";
import { withCookies } from "react-cookie";
import { toast } from "react-toastify";
import "./BarreDuHautAvecLaBareDeRecherche.css";

class BarreDuHautAvecLaBareDeRecherche extends Component {
    static propTypes = {
        "match": PropTypes.object.isRequired,
        "location": PropTypes.object.isRequired,
        "history": PropTypes.object.isRequired,
        "cookies": PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.clicHome = this.clicHome.bind(this);
        this.clicGestUser = this.clicGestUser.bind(this);
        this.clicGestCategories = this.clicGestCategories.bind(this);
        this.clicLogin = this.clicLogin.bind(this);
        this.clicLogout = this.clicLogout.bind(this);
        this.clicSettings = this.clicSettings.bind(this);
    }

    render() {
        let rightMenu = <Menu.Item link onClick={this.clicLogin}><Icon size="large" name="user" /> Se connecter</Menu.Item>;
        if (this.props.userToken != null) {
            // Menu utilisateur
            rightMenu = (
                <Dropdown item text="Mon compte">
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.clicSettings}><Icon name="setting" /> Paramètres</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.clicLogout}><Icon name="log out" /> Se déconnecter</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            );
        }
        let adminMenu = null;
        if (this.props.userRoles.indexOf("administrator") !== -1) {
            // Menu d'administration
            adminMenu = (
                 <Dropdown item icon={<Icon link name="settings" size="large" />}>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.clicGestCategories}><Icon name="tags" /> Gestion des catégories</Dropdown.Item>
                        <Dropdown.Item onClick={this.clicGestUser}><Icon name="users" /> Gestion des utilisateurs</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            );
        }
        return (
            <Menu fixed="top" size="small" borderless fluid color="grey" inverted className="BarreDuHautAvecLaBareDeRecherche">
                <Menu.Item header link onClick={this.clicHome}>
                    <Icon name="fort awesome" size="big" />Le Château Fort
                </Menu.Item>
                { adminMenu }      
                <Menu.Menu position="right">
                    {rightMenu}
                </Menu.Menu>
            </Menu>
        );
    }

    clicLogout(e) {
        e.preventDefault();
        if (this.props.userToken !== null) {
            this.props.cookies.remove("maillage_userToken");
            this.props.removeUserTokenOnStore();
            this.props.removeUserRolesOnStore();
            toast.success("Vous avez été déconnecté.");
            if (this.props.location.pathname !== "/") {
                this.props.history.push("/");
            }
        }
    }

    clicLogin(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/login") {
            this.props.history.push("/login");
        }
    }

    clicGestUser(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/admin/users") {
            this.props.history.push("/admin/users");
        }
    }

    clicGestCategories(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/admin/categories") {
            this.props.history.push("/admin/categories");
        }
    }

    clicHome(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/") {
            this.props.history.push("/");
        }
    }

    clicSettings(e) {
        e.preventDefault();
        if (this.props.location.pathname !== "/settings") {
            this.props.history.push("/settings");
        }
    }
}

const mapStoreToProps = function(store) {
    return {
        "userToken": store.users.userToken,
        "userRoles": store.users.userRoles
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        "removeUserTokenOnStore": function() {
            dispatch(removeUserToken());
        },
        "removeUserRolesOnStore": function() {
            dispatch(removeUserRoles());
        }
    };
};

BarreDuHautAvecLaBareDeRecherche = connect(mapStoreToProps, mapDispatchToProps)(BarreDuHautAvecLaBareDeRecherche);
BarreDuHautAvecLaBareDeRecherche = withRouter(BarreDuHautAvecLaBareDeRecherche);
BarreDuHautAvecLaBareDeRecherche = withCookies(BarreDuHautAvecLaBareDeRecherche);
export default BarreDuHautAvecLaBareDeRecherche;
