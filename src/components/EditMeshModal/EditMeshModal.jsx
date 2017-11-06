import React from "react";
import { Component } from "react";
import { Modal } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import axios from "axios";
import { baseApiUrl } from "../../conf";

export default class EditMeshModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "mesh": {}
        };
        this.loadMesh = this.loadMesh.bind(this);
    }

    loadMesh() {
        let self = this;
        const route = baseApiUrl + "/meshes/search/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": true,
                "mesh": []
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Modal onOpen={this.loadMesh} defaultOpen={false} trigger={<Button secondary icon circular compact basic size="tiny" data-tooltip="Modifier"><Icon name="pencil" /></Button>}>
                    <Modal.Header>Chargement en cours</Modal.Header>
                    <Modal.Content>
                        <Container textAlign="center">
                            test
                        </Container>
                    </Modal.Content>
                </Modal>
            );
        } else {
            return (
                <Modal onOpen={this.loadMesh} defaultOpen={false} trigger={<Button secondary icon circular compact basic size="tiny" data-tooltip="Modifier"><Icon name="pencil" /></Button>}>
                    <Modal.Header>Modifier</Modal.Header>
                    <Modal.Content>test</Modal.Content>
                    <Modal.Actions>Une action mdr</Modal.Actions>
                </Modal>
            );
        }
    }
}
