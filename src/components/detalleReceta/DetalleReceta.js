import React, { Component } from 'react';
import {
  TextInput ,Text, View, StyleSheet
} from 'react-native';
import { Container, Content, Form, Input, Label, Icon, Item, Left,Body, Button,Title, Right } from "native-base";
import Photo from './components/Photo'
import Paso from './components/Paso'
import Ingrediente from './components/Ingrediente'
import Header from './components/Header'
import Modal from "react-native-modal";
import firebase from '../../config';
export default class DetalleReceta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tituloReceta:"", // "" 
      isModalVisible: false,
      visibleModal: null,
      imagenGaleria: true,
      nameMainImage: "", 
      tituloModal: "", 
      listaIngredientes:{},
      isIngredientes: false, 
      listaPasos:{},
      isPasos: false,
      time:""
    }
    this.handleChange= this.handleChange.bind(this);
    this.callModal=this.callModal.bind(this);
    this.toggleModal=this.toggleModal.bind(this);
    this.guardarImagenPrincipal=this.guardarImagenPrincipal.bind(this);
    this.guardarIngredientes=this.guardarIngredientes.bind(this);
    this.guardarPasos=this.guardarPasos.bind(this);
    this.goBackToCookBook=this.goBackToCookBook.bind(this);
  }

  goBackToCookBook(value){
    var receta = {}
    this.props.navigation.navigate('CookBook', {receta})
  }

  callModal(texto, value){
    if(value)
      this.setState({ isModalVisible: !this.state.isModalVisible, tituloModal:texto });
  }

  guardarImagenPrincipal(nameMainImage){
     
    this.setState({ imagenGaleria:true, nameMainImage: nameMainImage });
  }
  guardarIngredientes(value,ingredientes){
    this.setState({ isIngredientes:value, listaIngredientes: ingredientes });
  }
  guardarPasos(value,pasos,time){
    this.setState({ isPasos:value, listaPasos: pasos, time:time });
  }
  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Hello!</Text>
      {this._renderButton('Close', () => this.setState({ visibleModal: null }))}
    </View>
  );
  handleChange(event = {}) {
    
    this.setState({
      tituloReceta:event
    })
  }
  toggleModal () {
    // 
    // //Link documentacion
    // // https://firebase.google.com/docs/reference/js/firebase.database.Query
    // console.log(firebase)
    // const db = firebase.database()
    // // Ejemplo de Insertar un elemento.
    // db.ref("Combo/001").push({
    //       Descripcion:'Lechuga, Doble Carne, Tomate',
    //       Nombre: 'Mac Combo',
    //       Precio:100,
    //       id:2,
    //       idRestaurant:2
    // }).then(() =>{
    //   console.log("Inserted")
    // }).catch((error) =>{
    //   console.log("error")
    // })

    // // Ejemplo para leer un elemento.
    // db.ref('Combo').once('value', (data) =>{
    //   console.log(data.toJSON())
    // })

    // // El once no se queda escuchando si hubo una insercion en la bd, pero el on si actua como un listener por ejemplo
    // setTimeout(() =>{
    //   db.ref("Combo/007").push({
    //     Descripcion:'Lechuga, Doble Carne, Tomate',
    //     Nombre: 'Mac Combo',
    //     Precio:100,
    //     id:2,
    //     idRestaurant:2
    //   }).then(() =>{
    //     console.log("Inserted")
    //   }).catch((error) =>{
    //     console.log("error")
    //   })
    // },5000)
    // db.ref('Combo').on('value', (data) =>{
    //   console.log(data.toJSON())
    // })

    // // Ejemplo para hacer una actualizacion a un elemento
    // db.ref("Combo/005").update({
    //   Nombre: 'Mac Super 2'
    // }).then(() =>{
    //   console.log("Update")
    // }).catch((error) =>{
    //   console.log("error")
    // })
    // //Ejemplo de eliminar un campo del json
    // db.ref("Combo/005/Nombre").remove(
    // ).then(() =>{
    //   console.log("Delete")
    // }).catch((error) =>{
    //   console.log("error")
    // })
    // //Ejemplo de eliminar un elemento
    // db.ref("Combo/005").remove(
    // ).then(() =>{
    //   console.log("Delete")
    // }).catch((error) =>{
    //   console.log("error")
    // })
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <Header imagenGaleria = {this.state.imagenGaleria} nameMainImage = {this.state.nameMainImage}
                tituloReceta = {this.state.tituloReceta} sendData={this.callModal} 
                isIngredientes = {this.state.isIngredientes} listaIngredientes = {this.state.listaIngredientes}
                isPasos = {this.state.isPasos} listaPasos = {this.state.listaPasos} time = {this.state.time}
                goBackToDetalleReceta = {this.goBackToCookBook}
                ></Header>
        <Content>
        <Item>
          <Photo isImageToGalery={this.guardarImagenPrincipal} tituloReceta = {this.state.tituloReceta} ></Photo>
        </Item>
        <Item >  
          <TextInput name="tituloReceta" onChangeText={this.handleChange} value={this.state.tituloReceta} style={{ marginTop:'8%', marginBottom:'10%', fontSize: 20}} placeholder="Titulo de tu Receta" /> 
        </Item>
        <Item style={{ marginTop:'0%', marginBottom:'0%', fontSize: 20}}>  
          <Ingrediente isIngredientes = {this.guardarIngredientes}></Ingrediente>
        </Item> 
        <Item>
        <Paso isPasos = {this.guardarPasos} tituloReceta = {this.state.tituloReceta}></Paso>
        </Item>
        <Modal style={styles.container} isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            {/* <Text style={styles.contentTitle}>Hi 👋!</Text> */}
            <Text style={styles.contentTitle}>{this.state.tituloModal} 👋!</Text>
            <Button danger style={{ width:80, height:40}} onPress={this.toggleModal}>
              <Text style={{fontSize:18, color:"white", alignSelf : "center", left:8 }} >Cerrar</Text>
            </Button>
           
          </View>
        </Modal>
        </Content>
    </Container>

    );
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius:10,
    width: 350, 
    height:280
  },
  button: {
    // backgroundColor: 'lightblue',
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
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width:330,
    height:200,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  }
});