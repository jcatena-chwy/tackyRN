import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Button, Icon, Container, Content } from 'native-base';
import Modal from "react-native-modal";
import { Rating, AirbnbRating } from 'react-native-ratings';
import firebase from '../../../config';

import * as ImagePicker from 'expo-image-picker';
export default class Productos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products,
      isModalVisible: false,
      isModalVisibleSpinner: false,
      isModalAddProducto: false,
      image: null,
      imageText: false,
      textProduct: '',
      isTextProduct: false,
      loading: true,
      name: this.props.name,
      idImagen: '',
    }
    this.selectModal = this.selectModal.bind(this);
    this.showModalAddProducto = this.showModalAddProducto.bind(this);
    this.toggleModalAddProducto = this.toggleModalAddProducto.bind(this);
    this.validarCampos = this.validarCampos.bind(this);
    this._pickImage = this._pickImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.guardarProducto = this.guardarProducto.bind(this);
  }

  selectModal(value) {
    if (value === 'addProducto') {
      this.showModalAddProducto()
    } else {

    }
  }

  showModalAddProducto() {
    this.setState({ isModalAddProducto: !this.state.isModalAddProducto });
  }

  toggleModalAddProducto() {
    this.setState({ isModalAddProducto: !this.state.isModalAddProducto });
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri, imageText: false });
    }
  };

  handleChange(event = {}) {
    if (event == "" || event == null) {
      this.setState({ textProduct: '', isTextProduct: true });
    } else {
      this.setState({ textProduct: event, isTextProduct: false });
    }
  }

  validarCampos() {
    if (this.state.image === null) {
      this.setState({ imageText: true });
      return
    }
    if (this.state.textProduct === '') {
      this.setState({ isTextProduct: true });
      return
    }
    this.setState({ idImagen:Math.random().toString(36).substring(7) }).then(() => {
      this.uploadImage().then(() => {
        this.guardarProducto()
       }).catch(() => {
       })
    })
   
  }

  uploadImage = async () => {
    const response = await fetch(this.state.image);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("images/ImageEstablecimiento/" + this.state.name + "/Products/" + this.state.idImagen);
    return ref.put(blob)
  }

  guardarProducto() {
    this.setState({ loading: false });
    const db = firebase.database()
    var idMainImage = this.guidGenerator()
    db.ref("Products/").push({
      id: this.state.idImagen,
      name: this.state.textProduct,
      image: '',
      score: ''
    }).then(() => {
      this.setState({ loading: true });
      console.log("Inserted")
    }).catch((error) => {
      console.log("error")
    })
  }

  render() {
    const navigation = this.props.navigation;
    let { image } = this.state;
    let { imageText } = this.state;
    let { isTextProduct } = this.state;
    return (
      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row' }}>
            {this.state.products.map((product) =>
              <View key={product.id} style={{ height: 180, width: 200, marginLeft: 20, borderWidth: 0.5, borderColor: '#dddddd' }}>
                <View style={{ flex: 3 }}>
                  <Image source={{ uri: product.image }}
                    style={{ width: 200, height: 195, resizeMode: 'cover' }}
                  />
                </View>
                <Icon style={{ color: '#FFF' }} name='image' onPress={() => this.selectModal('producto')} style={{ fontSize: 200, left: 10, opacity: 0.000005, }} />
                <View style={{ bottom: 50, color: '#8bad00', fontSize: 10 }}>
                  <Text style={{ color: 'black', fontSize: 20 }}>{product.name}</Text>
                </View>
              </View>
            )}
            <Button onPress={() => this.selectModal('addProducto')} textStyle={{ color: '#87838B' }}>
              <Icon name="add" />
              <Text style={{ fontSize: 20 }}>Producto</Text>
            </Button>
          </View>
        </ScrollView>

        <Modal style={styles.container} isVisible={this.state.isModalAddProducto}>
          {this.state.loading ? (
            <View style={styles.content}>
              {!image && <Icon active name='image' onPress={() => this._pickImage()} style={{ fontSize: 80 }} />}
              {imageText && <Text style={{ color: 'red', fontSize: 15 }} >Publicar foto del Plato Terminado</Text>}
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="Escribir..."
                placeholderTextColor="grey"
                numberOfLines={3}
                onChangeText={this.handleChange}
                multiline={true}
              />
              {isTextProduct && <Text style={{ color: 'red', fontSize: 12 }} >Escriba un titulo</Text>}
              <View style={styles.container2}>
                <View style={styles.buttonContainer}>
                  <Button danger onPress={this.toggleModalAddProducto}>
                    <Text onPress={this.toggleModalAddProducto} style={styles.TextStyle} >Cerrar</Text>
                  </Button>
                </View>
                <View style={styles.buttonContainer}>
                  <Button success onPress={this.validarCampos}>
                    <Text onPress={this.validarCampos} style={styles.TextStyle} >Guardar</Text>
                  </Button>
                </View>
              </View>
            </View>
          ) : (
              <View style={styles.content}>
                <ActivityIndicator size="large" color="red" style={{ marginTop: 40 }} />
              </View>
            )}
        </Modal>
      </View>
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

    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#00BCD4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    // padding: 22,
    borderRadius: 4,
    width: 330,
    height: 400,
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
    marginBottom: 10
  },
  buttonContainer: {
    flex: 1,
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
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 60
  },
  buttonContainer: {
    flex: 1,
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }

});