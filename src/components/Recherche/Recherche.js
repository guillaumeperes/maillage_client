import React from 'react'
import {Component} from "react";
import { Input} from 'semantic-ui-react'
import { Button, Header, Image, Modal, Icon, Form, Checkbox, Container, TextArea, Dropdown } from 'semantic-ui-react';


export default class Recherche extends Component{
       
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "error": false,
            "categories": []
        };
    }
    
    render(){
        return (
                <Input fluid icon={{ name: 'search', circular: true, link: true }} placeholder='Search...' > 
                </Input>
        )
    }
    
    
    
}
        
            
    


