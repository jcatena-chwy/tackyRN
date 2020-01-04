import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import { Constants } from 'expo';
import { Container, Header, Content, Textarea, Form, Input, Label, Icon, Item } from "native-base";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Photo from './components/Photo'
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
        <Item style={{flex: 1}}>  
          <Ingrediente></Ingrediente>
        </Item>
       
        </Content>
    </Container>
      
    );
  }
}