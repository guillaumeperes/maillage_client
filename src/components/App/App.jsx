import React from "react";
import { Component } from "react";
import { ToastContainer } from "react-toastify";
import Router from "../Router/Router";
import { withCookies } from "react-cookie";
import PropTypes from "prop-types";
import axios from "axios";
import { baseApiUrl } from "../../conf";
import { connect } from "react-redux";
import { setUserToken } from "../../actions.js";

class App extends Component {
    static propTypes = {
        "cookies": PropTypes.object.isRequired,
    };

    componentWillMount() {
        const cookieToken = this.props.cookies.get("maillage_userToken");
        if (cookieToken) {
            this.props.setUserTokenOnStore(cookieToken);
        }
    }

    componentDidMount() {
        const self = this;
        if (self.props.userToken) {
            const route = baseApiUrl + "/user/revive";
            const params = {
                "token": self.props.userToken
            };
            axios.get(route, {"params": params}).then(function(result) {
                let expire = new Date();
                expire.setTime(result.data.data.expiresAt * 1000); // on prend la date d'expiration du token fournie par l'api
                self.props.cookies.set("maillage_userToken", result.data.data.token, {
                    "path": "/",
                    "expires": expire
                });
                self.props.setUserTokenOnStore(result.data.data.token);
            }).catch(function(error) {
                self.props.cookies.remove("maillage_userToken"); // on supprime le cookie parasite
            });
        }
    }

    render() {
        return (
            <div>
                <ToastContainer autoClose={4000} hideProgressBar={true} />
                <Router />
            </div>
        );
    }
}

const mapStoreToProps = function(store) {
    return {
        "userToken": store.users.userToken
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        "setUserTokenOnStore": function(token) {
            dispatch(setUserToken(token));
        }
    };
};

App = connect(mapStoreToProps, mapDispatchToProps)(App);
App = withCookies(App);
export default App;
