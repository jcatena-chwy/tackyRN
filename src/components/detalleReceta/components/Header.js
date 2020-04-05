import React, { Component } from 'react';
import { Text, StyleSheet, View} from 'react-native';
import { Button, Icon, Left,Body, Right, Header,Spinner} from 'native-base';
import firebase from '../../../config';
import Modal from 'react-native-modal';
export default class Ingrediente extends Component {
  constructor(props){
    super(props);
    this.state = {
      isModalVisibleSpinner: false
    }
    tituloReceta = this.props.tituloReceta;
    this.validarReceta = this.validarReceta.bind(this)
    this.guardarReceta = this.guardarReceta.bind(this)
    this.guidGenerator = this.guidGenerator.bind(this)
    this.goBack = this.goBack.bind(this)
  }  
  validarReceta(){
      if(!this.props.imagenGaleria) {
        this.props.sendData("Por favor, elija una imagen de la galeria", true)
        return
      }
      if(this.props.tituloReceta == null || this.props.tituloReceta == "" ){
        this.props.sendData("Por favor, escriba un titulo para la receta", true)
        return
      } 
      if(!this.props.isIngredientes ){
         this.props.sendData("Por favor, escriba al menos un ingrediente", true)
         return
       }
       if(!this.props.isPasos ){
         this.props.sendData("Por favor, escriba al menos una descripcion en el paso o cargue una imagen, en un paso", true)
         return
       }
       this.props.goBackToDetalleReceta();
  }
 
  guardarReceta(){
    debugger
    this.setState({isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
    const db = firebase.database()
    var idMainImage = this.guidGenerator()
    db.ref("Recipes/").push({
      id: idMainImage,
      mainImage:this.props.nameMainImage,
      title: this.props.tituloReceta,
      ingredients: this.props.listaIngredientes,
      steps: this.props.listaPasos,
      time: this.props.time
    }).then(() =>{
      this.setState({isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
      this.props.goBackToDetalleReceta();
      console.log("Inserted")
    }).catch((error) =>{
      console.log("error")
    })
  }

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    //Ejemplo para guardar una imagen
    var ref = firebase.storage().ref().child("images/ImageRecipe/" + imageName);
    return ref.put(blob)

    //Ejemplo para recuperar una imagen
    var ref = firebase.storage().ref("images/ImageRecetas/imagePrueba5").getDownloadURL()
        .then(resolve => {
          console.log(resolve)
        })
        .catch(error => {
          console.log(error)
        })
    //
  }

  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  handleLangChange = () => {
    var lang = this.dropdown.value;
    this.props.onSelectLanguage(lang);            
  }

  goBack () {
    this.props.goBackToDetalleReceta();
  }
  
  render() {
    const navigation = this.props.navigation;
    return (
        <Header>
        <Left>
          <Button transparent>
            <Icon name='close' onPress={this.goBack} />
          </Button>
        </Left>
        <Body>
        </Body>
        <Right>
        <Button style={{backgroundColor:"white", width:80, height:40}} onPress={this.validarReceta}>
          <Text style={{fontSize:18}} >Guardar</Text>
        </Button>
        </Right>
        <Modal style={styles.container} isVisible={this.state.isModalVisibleSpinner}>
          <View style={styles.contentSpinner}> 
            <Spinner color='red' />
          </View>
        </Modal>
      </Header>
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
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width:330,
    height:400,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentSpinner: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width:200,
    height:200,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  }
});