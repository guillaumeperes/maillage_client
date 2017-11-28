import { baseApiUrl } from "../../conf";
import React from "react";
import {Component} from "react";
import { Button, Header, Image, Modal, Icon, Form, Checkbox, Container, TextArea, Dropdown } from 'semantic-ui-react';
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
        const self = this;
        const out = categories.map(function(category, i) {
            const tags=category.tags.map(function(tag){
                return { key:tag.id, value: tag.id, text: tag.title };
            })
            return (
                <Form.Field> 
                    <label>{category.title}</label>
                    <Dropdown placeholder='State' fluid multiple search selection options={tags} />
                </Form.Field>  
            );
        });
        return out;
    }
        
        
        
        render(){
            return (
                <Modal trigger={<Icon name='plus' size='big'/> } >
                <Modal.Header>Partager un nouveau maillage</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Container textAlign='justified'>
                            <Form>
                                <Form.Field>
                                    <label>Titre</label>
                                    <input placeholder='Titre' />
                                </Form.Field>
                                <Form.Field>
                                    <label>Description</label>
                                    <TextArea placeholder='Description' />
                                </Form.Field>
                                <Form.Field>
                                    <label>Nombre de cellules</label>
                                    <input placeholder='Nombre de cellule' />
                                </Form.Field>
                                <Form.Field>
                                    <label>Nombre de sommets</label>
                                    <input placeholder='Nombre de cellule' />
                                </Form.Field>
                                {this.renderCategories(this.state.categories)}
                                <Button type='submit' ><Icon name='save'/>Enregistrer </Button>
                                
                            </Form>
                        </Container>
                    </Modal.Description>
                </Modal.Content>
                  
                </Modal>
  )
        }
        
}
    
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


