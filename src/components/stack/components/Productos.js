import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import bgImage from '../../../assets/fondoDePantalla.jpg'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Button, Icon, Container, Content } from 'native-base';
import Modal from "react-native-modal";
import ModalProducto from './ModalProducto';
import ModalDetalleProducto from './ModalDetalleProducto';
export default class Productos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.navigation.state.params.products,
      isModalVisible: false,
      isModalVisibleSpinner: false,
      isModalAddProducto: false,
      isModalDetalleProducto: false,
      image: null,
      imageText: false,
      textProduct: '',
      isTextProduct: false,
      loading: true,
      name: this.props.navigation.state.params.name,
      idImagen: '',
      isModalActivityIndicator: false,
      idEstablecimiento: this.props.navigation.state.params.idEstablecimiento,
      navigation: this.props.navigation.state.params.navigation,
      productoSeleccionado: null,
    }
    this.selectModal = this.selectModal.bind(this);
    this.showModalAddProducto = this.showModalAddProducto.bind(this);
    this.toggleModalAddProducto = this.toggleModalAddProducto.bind(this);
    this.showModalDetalleProducto = this.showModalDetalleProducto.bind(this);
    this.toggleModalDetalleProducto = this.toggleModalDetalleProducto.bind(this);
    this.goToComentarios = this.goToComentarios.bind(this);
  }

  selectModal(value, product) {
    if (value === 'addProducto') {
      this.showModalAddProducto()
    } else {
      this.setState({
        productoSeleccionado: product
      }, () => {
        this.showModalDetalleProducto(product);
      });
    }
  }

  showModalAddProducto() {
    this.setState({ isModalAddProducto: !this.state.isModalAddProducto });
  }
  showModalDetalleProducto(product) {
    this.props.navigation.navigate('Paso1', { product })
    // this.setState({ isModalDetalleProducto: !this.state.isModalDetalleProducto });
  }

  toggleModalAddProducto(value) {
    if (value === 'loading') {
      this.setState({ isModalActivityIndicator: !this.state.isModalActivityIndicator });
    }
    if (value === 'completed') {
      this.setState({ isModalActivityIndicator: !this.state.isModalActivityIndicator });
      var updateProductos = 'updateProductos';
      this.state.navigation.navigate('Place', {updateProductos});
      
    }
    if (value === 'cerrar') {
      console.log("ejecuto el cerrar")
      this.setState({ isModalAddProducto: !this.state.isModalAddProducto });
    }
  }
  toggleModalDetalleProducto(value) {
    if (value === 'loading') {
      this.setState({ isModalDetalleProducto: !this.state.isModalDetalleProducto });
    }
    if (value === 'completed') {
      this.setState({ isModalDetalleProducto: !this.state.isModalDetalleProducto });
    }
    if (value === 'cerrar') {
      console.log("ejecuto el cerrar")
      this.setState({ isModalDetalleProducto: !this.state.isModalDetalleProducto });
    }
  }

  goToComentarios(product) {
    var productoSeleccionado = product;
    var idEstablecimiento = this.state.idEstablecimiento;
    var name = this.state.name;
    var navigation = this.state.navigation;
    this.props.navigation.navigate('ProductoComentario', {productoSeleccionado, idEstablecimiento, name, navigation})
  }

  render() {
    return (
      <ImageBackground source={bgImage} style={styles.containerMain}>
        <View style={styles.containerMain}>
          <View>
              {this.state.products.length === 0 ?
              <Text style={{color: 'white', fontSize: 15}}>No existen productos vinculados al establecimiento</Text>
              : (
              <Text></Text>
            )}
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {this.state.products.map((product) =>
              <View showsHorizontalScrollIndicator={false} key={product.id} style={styles.containerSecundary}>
                <ImageBackground source={bgImage} style={styles.containerThrid}>
                  <Image source={{ uri: product.image }} style={styles.image} />
                </ImageBackground>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', textAlign: 'center', color: 'white' }}>{product.name}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Rating
                      ratingCount={5}
                      fractions={2}
                      startingValue={product.score}
                      imageSize={13}
                      ratingBackgroundColor={'#e54b4d'}
                      onFinishRating={this.ratingCompleted}
                      style={{ marginBottom: 1 }}
                      readonly={true}
                      showReadOnlyText={true}
                    />
                  </View>
                  <ImageBackground onPress={() => this.goToComentarios(product)} source={bgImage} style={styles.containerVer}>
                    <View onPress={() => this.goToComentarios(product)} style={{ width: 50, overflow: "hidden",borderRadius: 20, }}>
                      <Text onPress={() => this.goToComentarios(product)} style={{ color: 'white', left: 15 }}>Ver</Text>
                    </View>
                  </ImageBackground>
                </View>
              </View>
            )}
          </ScrollView>
          <View style={styles.containerSection2}>
            <View style={styles.containerAddRecetaDetalle}>
              <Icon style={{ color: 'white', bottom:3 }} onPress={() => this.selectModal('addProducto')} active name="ios-add" />
              <Text style={styles.textAddReceta} onPress={() => this.selectModal('addProducto')} >Agregar un Producto</Text>
            </View>
          </View>
          <Modal style={styles.containerModal} isVisible={this.state.isModalAddProducto}>
            <View style={styles.content}>
              <ModalProducto idEstablecimiento={this.state.idEstablecimiento} name={this.state.name} cerrarModal={this.toggleModalAddProducto} ></ModalProducto>
            </View>
          </Modal>
          <Modal style={styles.containerModal} isVisible={this.state.isModalDetalleProducto}>
            <View style={styles.content}>
              <ModalDetalleProducto productoSeleccionado={this.state.productoSeleccionado} cerrarModal={this.toggleModalDetalleProducto}  ></ModalDetalleProducto>
            </View>
          </Modal>
          <Modal style={styles.containerModal} isVisible={this.state.isModalActivityIndicator}>
            <View style={styles.content}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </Modal>
        </View>
      </ImageBackground>
    );
  } 
}

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    width: 350,
    height: 280
  },
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSecundary: {
    backgroundColor: '#ea8073',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 250,
    height: 280,
  },
  containerThrid: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 30,
    width: 180,
    height: 180,
    overflow: "hidden",
  },
  containerText: {
    backgroundColor: 'red',
    width: 130,
    height: 40,
  },
  containerVer: {
    borderRadius: 20,
    overflow: "hidden",
    borderColor: 'white',
    borderWidth: 3
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
    alignItems: "center"
  },
  btnVer: {
    width: 50,
    overflow: "hidden",
    borderRadius: 20,
  },
  containerSection1: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    width: 350,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  containerSection2: {
    backgroundColor: '#a1998e',
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    width: 250,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  containerAddRecetaDetalle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSearchReceta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
  },
  textAddReceta: {
    marginLeft: 5,
    color: 'white',
    top:1
  },
  titleText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  }
});