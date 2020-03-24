import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Button, Icon, Container, Content } from 'native-base';
import Modal from "react-native-modal";
import ModalProducto from './ModalProducto';
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
      isModalActivityIndicator:false,
      idEstablecimiento: this.props.idEstablecimiento
    }
    this.selectModal = this.selectModal.bind(this);
    this.showModalAddProducto = this.showModalAddProducto.bind(this);
    this.toggleModalAddProducto = this.toggleModalAddProducto.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.products.update != undefined){
      this.setState({
        products: nextProps.products
      }, () => {
        console.log('update')
      });
    }
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

  toggleModalAddProducto(value) {
      if(value === 'loading') {
        this.setState({ isModalActivityIndicator: !this.state.isModalActivityIndicator });
      } 
      if(value === 'completed') {
        this.setState({ isModalActivityIndicator: !this.state.isModalActivityIndicator });
        this.props.getProducts();
      } 
      if(value === 'cerrar') {
        this.setState({ isModalAddProducto: !this.state.isModalAddProducto });
      } 
  }



  render() {
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
          <View style={styles.content}>
            <ModalProducto idEstablecimiento = {this.state.idEstablecimiento} name={this.state.name} cerrarModal={this.toggleModalAddProducto} ></ModalProducto>
          </View>
        </Modal>
        <Modal style={styles.container} isVisible={this.state.isModalActivityIndicator}>
          <View style={styles.content}>
          <ActivityIndicator size="large" color="#0000ff" />
          </View>
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