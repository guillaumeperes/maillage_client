import React from "react";
import { Component } from "react";
import { Modal } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";

export default class LoginModal extends Component {
    render() {
        return (
            <Modal trigger={this.props.children} closeIcon>
                <Modal.Header>Connexion</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field required>
                            <label>Adresse e-mail</label>
                            <input type="text"/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Mot de passe</label>
                            <input type="password"/>
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row only="computer tablet">
                            <Grid.Column width={16}>
                                <Button basic>Vous n'avez pas de compte ?</Button>
                                <Button basic>Mot de passe oublié ?</Button>
                                <Button primary>Connexion</Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row only="mobile">
                            <Grid.Column width={16}>
                                <Button basic fluid>Vous n'avez pas de compte ?</Button>
                                <Divider hidden />
                                <Button basic fluid>Mot de passe oublié ?</Button>
                                <Divider hidden />
                                <Button primary fluid>Connexion</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        );
    }
}
