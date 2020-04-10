import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Icon, Left, Body, Right, Header, Spinner } from 'native-base';
import firebase from '../../../config';
const { width: WIDTH } = Dimensions.get('window')
export default class Ingrediente extends Component {
  constructor(props) {
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
  validarReceta() {
    if (!this.props.imagenGaleria) {
      this.props.sendData("Por favor, elija una imagen de la galeria", true)
      return
    }
    if (this.props.tituloReceta == null || this.props.tituloReceta == "") {
      this.props.sendData("Por favor, escriba un titulo para la receta", true)
      return
    }
    if (!this.props.isIngredientes) {
      this.props.sendData("Por favor, escriba al menos un ingrediente", true)
      return
    }
    if (!this.props.isPasos) {
      this.props.sendData("Por favor, escriba al menos una descripcion en el paso o cargue una imagen, en un paso", true)
      return
    }
    this.props.goBackToDetalleReceta();
  }

  guardarReceta() {
    debugger
    this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
    const db = firebase.database()
    var idMainImage = this.guidGenerator()
    db.ref("Recipes/").push({
      id: idMainImage,
      mainImage: this.props.nameMainImage,
      title: this.props.tituloReceta,
      ingredients: this.props.listaIngredientes,
      steps: this.props.listaPasos,
      time: this.props.time
    }).then(() => {
      this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
      this.props.goBackToDetalleReceta();
      console.log("Inserted")
    }).catch((error) => {
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
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  handleLangChange = () => {
    var lang = this.dropdown.value;
    this.props.onSelectLanguage(lang);
  }

  goBack() {
    this.props.goBackToDetalleReceta();
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={{ left: 120 }}>
        <TouchableOpacity onPress={this.validarReceta} style={styles.btnLogin}>
          <Text style={styles.text}>Guardar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnLogin: {
    width: 75,
    height: 35,
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: 20,
    marginRight: 10,
    marginBottom: 10,
    borderColor: 'white',
    borderWidth: 1
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center'
  },
});