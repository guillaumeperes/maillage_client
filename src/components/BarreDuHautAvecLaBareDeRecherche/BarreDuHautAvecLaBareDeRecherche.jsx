import React from "react";
import {Component} from "react";
import { Dropdown, Icon, Menu } from 'semantic-ui-react'


export default class BarreDuHautAvecLaBareDeRecherche extends Component{
        render(){
            return(
                    <Menu>
                    <Menu.Item>
                        <Icon name='home' size='big' onClick={this.clicHome} />
                        <Dropdown icon={<Icon name='setting' size='big' />} classeName='link item'>  
                            <Dropdown.Menu>
                                    <Dropdown.Item onClick={this.clicGestUser}>Gestion des Utilisateurs</Dropdown.Item>
                                    <Dropdown.Item onClick={this.clicGestTag}>Gestion des Tags</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Icon name='plus' size='big' onClick={this.clicHome} />
                    </Menu.Item>
                    </Menu>);
        }
        
        clicGestUser(){
            console.log("page de gestion des parametre utilisateur/ page accessible par l'admin")
        }
        
        clicGestTag(){
            console.log("page de gestion des tag utilisable par les utilisateurs/ page accessible par l'admin")
        }
        
        clicHome(){
            console.log("page d'accueil")
        }
        
        
}


/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


