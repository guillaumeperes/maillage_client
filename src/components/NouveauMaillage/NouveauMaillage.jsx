import React from "react";
import {Component} from "react";
import { Button, Header, Image, Modal, Icon, Form, Checkbox, Container, TextArea } from 'semantic-ui-react'



export default class NouveauMaillage extends Component{
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
                                <Button type='submit'>Submit</Button>
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


