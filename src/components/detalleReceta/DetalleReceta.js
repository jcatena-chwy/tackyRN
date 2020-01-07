import React, { Component } from 'react';
import {
  TextInput
} from 'react-native';
import { Container, Header, Content, Textarea, Form, Input, Label, Icon, Item } from "native-base";
import Photo from './components/Photo'
import Paso from './components/Paso'
import Ingrediente from './components/Ingrediente'
export default class DetalleReceta extends Component {
  render() {
    return (
      <Container>
        <Content>
        <Item>
          <Photo></Photo>
        </Item>
        <Item >  
          <TextInput style={{ marginTop:'8%', marginBottom:'10%', fontSize: 20}} placeholder="Titulo de tu Receta" /> 
        </Item>
        <Item style={{ marginTop:'0%', marginBottom:'0%', fontSize: 20}}>  
          <Ingrediente></Ingrediente>
        </Item>
        <Item>
        <Paso></Paso>
        </Item>
        </Content>
    </Container>

    );
  }
}