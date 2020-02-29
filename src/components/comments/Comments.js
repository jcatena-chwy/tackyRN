import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Button } from 'native-base';
import comments from '../request/comments.json'
import Modal from "react-native-modal";
import Paso1 from "./Paso1"
import Paso2 from './Paso2.js';
import firebase from '../../config';
export default class Comments extends Component {
  constructor(props){
    super(props);
    this.state = {
        comments: [],
        isModalVisible: false,
        paso1:false,
        image:false,
        imageUrl:"",
        contieneTexto:false,
        textoPaso1:"",
        infoPaso1:{},
        idComments: this.props.navigation.state.params.idComments,
    } 
    this.toggleModal= this.toggleModal.bind(this);
    this.setPaso1=this.setPaso1.bind(this);
    this.analizarTexto=this.analizarTexto.bind(this);
    this.analizarImagen=this.analizarImagen.bind(this);
    this.validarCampos=this.validarCampos.bind(this);
    this.validarPaso2=this.validarPaso2.bind(this);
  }

  componentWillMount() {
    this.cargarLista(); 
  }

  cargarLista(){
    var jsonComments = []
    var comments = []
    const db2 = firebase.database().ref('Comments')
    db2.orderByChild('idEstablecimiento')
    .equalTo(this.state.idComments)
    .once('value')
    .then((snapshot) => { 
      var value = snapshot.val();
      i = 0; 
      if (value) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val());
          jsonComments.date = child.val().date ; 
          jsonComments.description = child.val().description ; 
          jsonComments.id = child.val().id ; 
          jsonComments.idEstablecimiento = child.val().idEstablecimiento ; 
          jsonComments.idProducto = child.val().idProducto ; 
          jsonComments.userName = child.val().userName ; 
          jsonComments.id = child.val().id ; 
          comments[i] = jsonComments
          i = i + 1
        });
      }
      this.setState({ comments: comments });
    });
  }

  validarPaso2(){
    debugger
    if(this.state.contieneTexto){
      var json = {
        text: this.state.textoPaso1,
        image: this.state.imageUrl
      }
      this.setState({ paso1: true, infoPaso1:json});
    }
  }

  analizarTexto(val, text){
    this.setState({ contieneTexto: val, textoPaso1:text});
  }

  analizarImagen(image){
    this.setState({ imageUrl:image});
  }
  
  setPaso1(val){
    this.setState({ image: val});
  }
  toggleModal(){
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  validarCampos(){ 
    if(this.state.image){
      this.setState({ paso1: true, image:false});
    }else {
      this.setState({ paso1: false, image:true});
    }
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <Header />
        <Content>
          {this.state.comments.map((comment, index) =>
            <List key={index}>
                <ListItem  avatar>
                <Left>
                    {/* <Thumbnail source={{ uri: comment.image }} /> */}
                </Left>
                <Body>
                    {/* <Text>{comment.autor.nombre}</Text> */}
                    <Text note>{comment.description}</Text>
                </Body>
                <Right>
                    <Text note>{comment.date}</Text>
                </Right>
                </ListItem>
            </List>
        )}
        <TouchableOpacity
          style={styles.SubmitButtonStyle}
          activeOpacity = { .5 }
          onPress={ this.toggleModal }
       >
        <Text style={styles.TextStyle}> Agregar un comentario </Text>
        
      </TouchableOpacity>
      <Modal style={styles.container} isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            {!this.state.paso1 ? (
              <Paso1 image = {this.state.image} sendDataText={this.analizarTexto} sendDataImage={this.analizarImagen}></Paso1>
              ) : (
              <Paso2 infoPaso1 = {this.state.infoPaso1}></Paso2>
            )}
            <View style={styles.container2}>
              <View style={styles.buttonContainer}>
                <Button style={{float: 'right', marginLeft:30}} danger onPress={this.toggleModal}>
                            <Text style={styles.TextStyle} >Cerrar</Text>
                </Button>
              </View>
              <View style={styles.buttonContainer}>
                  <Button style={{ float: 'right',marginLeft:25, marginRight:5}} success onPress={this.validarCampos}>
                    <Text style={styles.TextStyle} onPress={this.validarPaso2} >Siguiente</Text>
                  </Button>
              </View>
            </View> 
          </View> 
        </Modal>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
 
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
 
  SubmitButtonStyle: {
 
    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'#00BCD4',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
 
  TextStyle:{
      color:'#fff',
      textAlign:'center',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius:10,
    width: 350, 
    height:280
  },
  button: {
    backgroundColor: 'lightblue',
    width: 30, 
    height:20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    // padding: 22,
    borderRadius: 4,
    width:330,
    height:400,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10
  },
  buttonContainer: {
    flex: 1,
  }
 
});