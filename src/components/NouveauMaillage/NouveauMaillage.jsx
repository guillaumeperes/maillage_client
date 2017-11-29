import { baseApiUrl } from "../../conf";
import React from "react";
import { Component } from "react";
import { Button, Modal, Icon, Form, Container, TextArea, Dropdown, Header, Divider } from 'semantic-ui-react';
import axios from "axios";

export default class NouveauMaillage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "error": false,
            "categories": []
        };
    }
        
    componentDidMount() {
        const self = this;
        const route = baseApiUrl + "/categories/alltags/";
        axios.get(route).then(function(response) {
            self.setState({
                "isLoading": false,
                "error": false,
                "categories": response.data
            });
        }).catch(function(error) {
            self.setState({
                "isLoading": false,
                "error": true,
                "categories": []
            });
        });
    }
    
    renderCategories(categories) {
        if (categories.length > 0) {
            const out = categories.map(function(category, i) {
                const tags = category.tags.map(function(tag) {
                    return { key:tag.id, value: tag.id, text: tag.title };
                });
                return (
                    <Form.Field key={i}> 
                        <label>{category.title}</label>
                        <Dropdown placeholder={category.title} fluid multiple selection options={tags} />
                    </Form.Field>  
                );
            });
            return (
                <Container fluid>
                    <Header dividing size="small"><Icon name="tags" />Tags</Header>
                    {out}
                </Container>
            );
        }
        return null;
    }

    render(){
        return (
            <Modal trigger={this.props.children} closeIcon>
                <Modal.Header><Icon name="file" /> Partager un nouveau maillage</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Container fluid>
                            <Header dividing size="small">Informations générales</Header>
                            <Form.Field required>
                                <label>Titre</label>
                                <input type="text" placeholder='Titre' />
                            </Form.Field>
                            <Form.Field>
                                <label>Description</label>
                                <TextArea placeholder='Description' autoHeight />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field required>
                                    <label>Nombre de cellules</label>
                                    <input type="number" placeholder='Nombre de cellules' />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Nombre de sommets</label>
                                    <input type="number" placeholder='Nombre de sommets' />
                                </Form.Field>
                            </Form.Group>
                        </Container>
                        <Divider hidden />
                        {this.renderCategories(this.state.categories)}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary type='submit'><Icon name='save'/>Enregistrer</Button>
                </Modal.Actions>
            </Modal>
        );
    }    
}
