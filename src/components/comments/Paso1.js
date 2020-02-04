import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, Image } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Button, Textarea, Form, Icon } from 'native-base';
import comments from '../request/comments.json'
import Modal from "react-native-modal";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
export default class Paso1 extends Component {
  constructor(props){
    super(props);
    this.state = {
        image: null,
        imagentexto:false,
        comentario: ""
    }
    this.seleccionoFoto = this.seleccionoFoto.bind(this)
  }
  componentDidMount() {
    this.getPermissionAsync();
    console.log('hi');
  }
  seleccionoFoto(){ 
    debugger;
      if(this.state.image!= null){
        this.setState({imagentexto:this.props.image});
        this.props.sendData(true);
      }else {
        this.setState({imagentexto:this.props.image});
        this.props.sendData(false);
      }
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.seleccionoFoto()
    }
  };

  handleChange(event = {}) {
    if(event == "" || event == null){
      this.props.sendDataValueText(false);
    }else{
      this.props.sendDataValueText(true);
    }
  }
  
  render() {
    let { image } = this.state;
    return (
      <Container>
        <Content>
            <List>
            <ListItem avatar> 
              <Left>
              <Thumbnail source={{ uri: "https://img.fifa.com/image/upload/t_l4/v1568781948/gzuddxhx4evpfd5q5ean.jpg" }} />
              </Left>
              <Body>
                <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Escribir..."
                    placeholderTextColor="grey"
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={this.handleChange}
                />
                {this.props.textComentario &&<Text style={styles.textStyleAlert}> Por favor ingrese un texto </Text>}
              </Body> 
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
          </List>
          {!image && <Icon active name='image' onPress={this._pickImage} style={styles.navBarLeftButton} />}
          {!image &&<Text style={{ fontSize: 20}}>Publicar foto del Plato Terminado</Text>}
          {this.props.image &&<Text style={styles.textStyleAlert}> Por favor ingrese una imagen </Text>}
          {image &&
            <Image source={{ uri: image }}  style={{ width: 200, height: 180 ,marginLeft:30}} />}
        </Content>
      </Container>
    );
  }
}
 
const styles = StyleSheet.create({
    textAreaContainer: {
      borderWidth: 1,
      padding: 5
    },
    textArea: {
      height: 50,
      justifyContent: "flex-start"
    },
    navBarLeftButton: {
        paddingLeft: 100,
        fontSize:80
    },
    textStyleAlert: {
      color:"red"
    }
  })
