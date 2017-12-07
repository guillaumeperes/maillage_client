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

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <Route exact path="/admin/categories/" component={AdminCategoriesPage} />
                    <Route exact path="/admin/users/" component={AdminUsersPage} />
                    <Route component={PageNotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}
