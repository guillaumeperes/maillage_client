import React from "react";
import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import AdminTagsPage from "../AdminTagsPage/AdminTagsPage";
import AdminUsersPage from "../AdminUsersPage/AdminUsersPage";
import PageNotFound from "../PageNotFound/PageNotFound";

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/admin/tags/" component={AdminTagsPage} />
                    <Route exact path="/admin/users/" component={AdminUsersPage} />
                    <Route component={PageNotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}
