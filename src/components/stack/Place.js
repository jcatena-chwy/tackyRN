import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet } from 'react-native';
import { Container, Card, Button, Icon, Spinner } from 'native-base';
import { createStackNavigator } from 'react-navigation';
import restaurantes from '../request/restaurantes.json'
import ImageOverlay from "react-native-image-overlay";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Detalle from './components/Detalle.js';
import Comentarios from './components/Comentarios.js';
import Productos from './components/Productos.js';
import Modal from "react-native-modal";
import firebase from '../../config';
const WATER_IMAGE = require('../../assets/camera.png')
export default class Place extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: this.props.navigation.state.params.establecimiento,
      navigation: this.props.navigation,
      widthStyle: 360,
      isModalVisibleSpinner: false,
      cantCall: 0
    }
    this.getProducts = this.getProducts.bind(this);
    this.getImagenesProductos = this.getImagenesProductos.bind(this);
    this.uploadImageProductos = this.uploadImageProductos.bind(this);
  }
  componentWillMount() {
    setTimeout(() => {
      this.setState({
        isModalVisibleSpinner: !this.state.isModalVisibleSpinner
      }, () => {
        setTimeout(() => {
          this.setState({
            isModalVisibleSpinner: !this.state.isModalVisibleSpinner
          }, () => {
          });
        }, 2000)
      });
    }, 1000)
  }
  componentWillReceiveProps(nextProps) {
    var copyState = this.state.place
    copyState.score.averageScore = nextProps.navigation.state.params.json.averageScore
    copyState.cantidadComentarios = copyState.cantidadComentarios + 1
    this.setState({
      place: copyState
    }, () => {
    });
  }

  getProducts() {
    this.setState({
      isModalVisibleSpinner: !this.state.isModalVisibleSpinner
    }, () => {
      const db3 = firebase.database().ref('Products')
      db3.orderByChild('idEstablecimiento')
        .equalTo(this.state.place.id)
        .once('value')
        .then((snapshot) => {
          var value = snapshot.val();
          var productos = []
          cantidadImagenesProductos = 0;
          if (value) {
            snapshot.forEach((child) => {
              productos[cantidadImagenesProductos] = child.val()
              cantidadImagenesProductos++
            });
          }
          place = this.state.place;
          place.products = productos;
          this.setState({
            place: place
          }, () => {
            this.getImagenesProductos(productos, cantidadImagenesProductos)
          });
        });
    });
  }

  getImagenesProductos(productos, cantidadImagenesProductos) {
    for (i = 0; i < cantidadImagenesProductos; i++) {
      var producto = productos[i];
      this.uploadImageProductos(producto.image, cantidadImagenesProductos)
    }
  }

  uploadImageProductos = async (imageName, cantidadImagenesProductos) => {
    const db = firebase.database()
    var ref = firebase.storage().ref("images/ImageEstablecimiento/" + this.state.place.name + "/" + "Products/" + imageName).getDownloadURL()
      .then(resolve => {

        let newArray = [...this.state.place.products];
        for (f = 0; f < this.state.place.products.length; f++) {
          var producto = this.state.place.products[f]
          if (producto != null || producto != undefined) {
            if (producto.image == imageName) {
              newArray[f].image = resolve
            }
          }
        }
        contador = this.state.cantCall + 1;
        this.setState({
          cantCall: contador,
        }, () => {
          if (this.state.cantCall == cantidadImagenesProductos) {
            place = this.state.place;
            place.products = newArray;
            place.products.update = true
            this.setState({
              place: place,
              isModalVisibleSpinner: !this.state.isModalVisibleSpinner
            }, () => {

            });
          }
        });
      })
      .catch(error => {
        console.log(error)
      })
  }


  render() {
    const navigation = this.props.navigation.state.params.navigation;
    return (
      <Container>
        <ScrollView>
          <ImageOverlay widthStyle={this.props.widthStyle} source={{ uri: this.state.place.imageUri }} width="10%"
            contentPosition="bottom" titleStyle={{ color: 'yellow' }}>
            <View>
              <Text style={{ fontSize: 30, fontWeight: 'bold', left: 6, textAlign: 'center', color: '#97bc00' }}>{this.state.place.name}</Text>
            </View>
          </ImageOverlay>
          <Card title="CUSTOM RATING" >
            <View style={{ flexDirection: 'row', color: '#ccc9bc', left: 100 }}><Text style={{ fontSize: 20, left: 6, color: '#f1c40e', top: 20 }}>Rating: </Text><Text style={{ fontSize: 45, left: 6, top: 5, color: '#f1c40e' }}>{this.state.place.score.averageScore}</Text><Text style={{ fontSize: 20, left: 10, top: 20, color: '#f1c40e' }}>/5</Text></View>
            <Rating
              ratingCount={5}
              fractions={2}
              startingValue={this.state.place.score.averageScore}
              imageSize={40}
              onFinishRating={this.ratingCompleted}
              style={{ paddingVertical: 10 }}
              readonly={true}
              showReadOnlyText={true}
            />
          </Card>
          <Card style={{ height: 140 }} title="CUSTOM RATING" >
            <Detalle score={this.state.place.score} schedule={this.state.place.schedule} phone={this.state.place.phone}></Detalle>
          </Card>
          <Card style={{ height: 60 }} title="CUSTOM RATING" >
            <Comentarios comentarios={this.state.place.cantidadComentarios} idComentarios={this.state.place.id} name={this.state.place.name} score={this.state.place.score.id} navigation={this.state.navigation}></Comentarios>
          </Card>
          <Productos idEstablecimiento={this.state.place.id} name={this.state.place.name} products={this.state.place.products} getProducts={this.getProducts}></Productos>
        </ScrollView>

        <Modal style={styles.containerSpinner} isVisible={this.state.isModalVisibleSpinner}>
          <View style={styles.contentSpinner}>
            <Spinner color='red' />
          </View>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

  containerSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    width: 350,
    height: 280
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
  }
});
