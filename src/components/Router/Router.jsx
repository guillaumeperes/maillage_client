import React from "react";
import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import AdminCategoriesPage from "../AdminCategoriesPage/AdminCategoriesPage";
import AdminUsersPage from "../AdminUsersPage/AdminUsersPage";
import PageNotFound from "../PageNotFound/PageNotFound";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import UserSettingsPage from "../UserSettingsPage/UserSettingsPage";
import { connect } from "react-redux";

class Router extends Component {
    render() {
        const p = this.props;
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    {p.userToken == null ? <Route exact path="/login" component={LoginPage} /> : null}
                    {p.userToken == null ? <Route exact path="/register" component={RegisterPage} /> : null}
                    {p.userToken !== null ? <Route exact path="/settings" component={UserSettingsPage} /> : null}
                    {p.userToken !== null ? <Route exact path="/settings/edit" component={UserSettingsPage} /> : null}
                    {p.userToken !== null && p.userRoles.indexOf("administrator") !== -1 ? <Route exact path="/admin/categories/" component={AdminCategoriesPage} /> : null}
                    {p.userToken !== null && p.userRoles.indexOf("administrator") !== -1 ? <Route exact path="/admin/users/" component={AdminUsersPage} /> : null}
                    <Route component={PageNotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStoreToProps = function(store) {
    return {
        "userToken": store.users.userToken,
        "userRoles": store.users.userRoles
    };
};

Router = connect(mapStoreToProps)(Router);
export default Router;
