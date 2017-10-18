import React from "react";
import {Component} from "react";
import { Button, Header, Image, Modal, Icon } from 'semantic-ui-react'



export default class NouveauMaillage extends Component{
        render(){
            return (
        <Modal trigger={<Icon name='plus' size='big'/> } >
    <Modal.Header>Partager un nouveau maillage</Modal.Header>
    <Modal.Content image>
      <Modal.Description>
        <Header>Default Profile Image</Header>
        <p>We've found the following gravatar image associated with your e-mail address.</p>
        <p>Is it okay to use this photo?</p>
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


