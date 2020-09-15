import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet, ImageBackground } from 'react-native';
import { Card, Spinner, Button, Body } from 'native-base';
import { Rating } from 'react-native-ratings';
import Detalle from './components/Detalle.js';
import Comentarios from './components/Comentarios.js';
import Productos from './components/Productos.js';
import Modal from "react-native-modal";
import firebase from '../../config';
import bgImage from '../../assets/fondoDePantalla.jpg'
import { Ionicons } from '@expo/vector-icons';

export default class Place extends Component {
    constructor(props) {
        super(props);
        this.state = {
            place: this.props.navigation.state.params.establecimiento,
            navigation: this.props.navigation,
            rows: [
                {
                    "id": 1,
                    start: [
                        { "id": 1, color: 'black', name: 'md-star-outline', isclickStart: false },
                        { "id": 2, color: 'black', name: 'md-star-outline', isclickStart: false },
                        { "id": 3, color: 'black', name: 'md-star-outline', isclickStart: false },
                        { "id": 4, color: 'black', name: 'md-star-outline', isclickStart: false },
                        { "id": 5, color: 'black', name: 'md-star-outline', isclickStart: false },
                    ]
                }
            ],
            widthStyle: 360,
            contenido: false,
            isModalVisibleSpinner: false,
            isModalDetalle: false,
            isModalProducto: false,
            cantCall: 0
        }
        this.getProducts = this.getProducts.bind(this);
        this.getImagenesProductos = this.getImagenesProductos.bind(this);
        this.uploadImageProductos = this.uploadImageProductos.bind(this);
        this.toggleModalDetalle = this.toggleModalDetalle.bind(this);
        this.toggleModalProducto = this.toggleModalProducto.bind(this);
    }
    componentWillMount() {
        require('../../assets/fondoDePantalla.jpg');
        setTimeout(() => {
            this.setState({
                isModalVisibleSpinner: !this.state.isModalVisibleSpinner
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isModalVisibleSpinner: !this.state.isModalVisibleSpinner
                    }, () => {
                    });
                }, 1000)
            });
        }, 1000)
    }
    componentWillReceiveProps(nextProps) {
        var copyState = this.state.place;
        this.setState({
            cantCall: 0
        }, () => {
        });
        if (nextProps.navigation.state.params.json != undefined) {
            copyState.score.averageScore = nextProps.navigation.state.params.json.averageScore;
            copyState.cantidadComentarios = copyState.cantidadComentarios + 1;
            this.setState({
                place: copyState
            }, () => {
            });
        }
        if (nextProps.navigation.state.params.updateProductos != undefined) {
            this.getProducts();
        }
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

    toggleModalDetalle() {
        this.setState({
            isModalDetalle: !this.state.isModalDetalle
        }, () => {
        });
    }
    toggleModalProducto() {
        var navigation = this.state.navigation
        var idEstablecimiento = this.state.place.id
        var name = this.state.place.name
        var products = this.state.place.products
        this.props.navigation.navigate('Productos', { navigation, idEstablecimiento, name, products })
    }

    render() {
        const navigation = this.props.navigation.state.params.navigation;
        var idComments = this.state.place.id
        var name = this.state.place.name
        var score = this.state.place.score.id
        var cantComentarios = this.state.place.cantidadComentarios
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                        <Text style={{ fontSize: 22, fontWeight: '800', textAlign: 'center', color: 'white' }}>{this.state.place.name}</Text>
                        <View showsHorizontalScrollIndicator={false} style={styles.containerSecundary}>
                            <ImageBackground source={bgImage} style={styles.containerThrid}>
                                <Image source={{ uri: this.state.place.imageUri }} style={styles.image} />
                            </ImageBackground>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, top: 5, right: 5, color: 'white' }}>{this.state.place.score.averageScore}  </Text>
                                <Rating
                                    ratingCount={5}
                                    fractions={2}
                                    startingValue={this.state.place.score.averageScore}
                                    imageSize={20}
                                    ratingBackgroundColor={'#ea8073'}
                                    onFinishRating={this.ratingCompleted}
                                    style={{ top: 5, right: 5 }}
                                    readonly={true}
                                    showReadOnlyText={true}
                                />
                                <Text style={{ fontSize: 18, top: 5, right: 5, color: 'white' }} >{"  (" + this.state.place.cantidadComentarios + ")"}</Text>
                            </View>
                        </View>
                        <Card style={{ width: 250, height: 100, borderRadius: 20, backgroundColor: '#e97463', borderWidth: 1, overflow: 'hidden', borderColor: 'white', marginBottom: 18, marginTop: 18 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                                <Image onPress={() => this.toggleModalDetalle()} style={{ width: 80, height: 80 }} source={require('../../assets/medalla.png')}></Image>
                                <Text onPress={() => this.toggleModalDetalle()}>{"Medallas" + '\n' + "y mas información"}</Text>
                                <Ionicons style={{ fontSize: 28, marginBottom: 40, color: 'white' }} name="ios-information-circle-outline"></Ionicons>
                            </View>
                        </Card>
                        <Card style={{ width: 150, height: 30, borderRadius: 20, backgroundColor: '#e97463', borderWidth: 1, overflow: 'hidden', borderColor: 'white' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                                <Text onPress={() => this.props.navigation.navigate('Comments', { idComments, name, score, cantComentarios })} style={{ color: 'white' }}>{"+ " + this.state.place.cantidadComentarios}</Text>
                                <Text onPress={() => this.props.navigation.navigate('Comments', { idComments, name, score, cantComentarios })} style={{ color: 'white' }}>{this.props.comentarios} Comentarios</Text>
                            </View>
                        </Card>
                        <Card style={{ width: 150, height: 30, borderRadius: 20, backgroundColor: '#e97463', borderWidth: 1, overflow: 'hidden', borderColor: 'white' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                                <Text onPress={() => this.toggleModalProducto()} style={{ color: 'white' }}> + Productos</Text>
                            </View>
                        </Card>
                        <Modal style={styles.containerSpinner} isVisible={this.state.isModalVisibleSpinner}>
                            <View style={styles.contentSpinner}>
                                <Spinner color='red' />
                            </View>
                        </Modal>
                        <Modal style={styles.containerDetalle} isVisible={this.state.isModalDetalle}>
                            <Detalle score={this.state.place.score} schedule={this.state.place.schedule} phone={this.state.place.phone}></Detalle>
                            <Body>
                                <Button onPress={() => this.toggleModalDetalle()} danger style={{width: 100, justifyContent: 'center', alignContent: 'center'}}>
                                    <Text style={{ fontSize: 20, color: "white"}}>Cerrar</Text>
                                </Button>
                            </Body>
                        </Modal>
                        <Modal style={styles.containerProducto} isVisible={this.state.isModalProducto}>
                            <Productos navigation={this.state.navigation} idEstablecimiento={this.state.place.id} name={this.state.place.name} products={this.state.place.products} getProducts={this.getProducts}></Productos>
                            <Text onPress={() => this.toggleModalProducto()} style={{ fontSize: 20, color: "black", left: 8, bottom: 50 }}>Cerrar</Text>
                        </Modal>
                    </View>
                </ScrollView>


            </ImageBackground >
        );
    }
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    containerSpinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 10,
        width: 350,
        height: 280
    },
    containerDetalle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        shadowRadius: 10,
        width: 340,
        height: 280,
        backgroundColor: '#e97463',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 20
    },
    containerProducto: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 10,
        width: 350,
        height: 280,
        backgroundColor: '#e97463',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 20
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
        height: 250,
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
    image: {
        width: 150,
        height: 150,
        borderRadius: 20,
        alignItems: "center"
    },
});
