import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button, Icon, Left, Body, Right, Header, Spinner, Container, Content } from 'native-base';
import firebase from '../../../config';
export default class Cargando extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisibleSpinner: false,
      cantCall: 0,
    }
    this.guardarReceta = this.guardarReceta.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    var informacion = nextProps.navigation.state.params
    if (informacion.mensaje === 'ImagenPaso') {
      if (informacion.cantidad === 0) {
        setTimeout(() => {
          this.guardarReceta(informacion.receta)
        }, 100)
      }
    }
  }

  guardarReceta(receta) {
    const db = firebase.database()
    console.log("Guardar Receta")
    db.ref("Recipes/").push({
      id: Math.random().toString(36).substring(7),
      mainImage: receta.mainImage,
      title: receta.title,
      ingredients: receta.ingredients,
      steps: receta.steps,
      time: receta.time
    }).then(() => {
      var receta = {}
      console.log("Inserted")
      this.props.navigation.navigate('CookBook', { receta })
    }).catch((error) => {
      console.log("error")
    })
  }


  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <Content>
          <Text>Cargando</Text>
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
    shadowRadius: 10,
    width: 350,
    height: 280
  },
  button: {
    backgroundColor: 'lightblue',
    width: 30,
    height: 20,
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
    width: 330,
    height: 400,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentSpinner: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width: 200,
    height: 200,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  }
});