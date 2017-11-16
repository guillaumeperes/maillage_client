import React from "react";
import { Component } from "react";

export default class AdminUsersPage extends Component {
  constructor(props) {
        super(props);
        document.title = "Gestion des utilisateurs | Le château fort";
    }

    render() {
        return "users";
    }
}
