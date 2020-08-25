import React, { Component } from 'react';
import { StyleSheet, ImageBackground, Dimensions, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Container, Content, Form, Input, Label, Icon, Item, Left, Body, Button, Title, Right } from "native-base";
import Photo from './components/Photo'
import Ingrediente from './components/Ingrediente'
const { width: WIDTH } = Dimensions.get('window')
import bgImage from '../../assets/fondoDePantalla.jpg'
import Header from './components/Header'
import firebase from '../../config';
import Modal from "react-native-modal";
import Paso from './components/Paso'
import GuardarReceta from './components/GuardarReceta';
import { ScrollView } from 'react-native-gesture-handler';
export default class DetalleReceta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tituloReceta: "", // "" 
            isModalVisible: false,
            isModalVisibleConfirmed: false,
            visibleModal: null,
            imagenGaleria: true,
            nameMainImage: "",
            tituloModal: "",
            listaIngredientes: {},
            isIngredientes: false,
            listaPasos: {},
            isPasos: false,
            time: "",
            navigation: this.props.navigation,
            imagenesPasos: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.callModal = this.callModal.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.guardarImagenPrincipal = this.guardarImagenPrincipal.bind(this);
        this.guardarIngredientes = this.guardarIngredientes.bind(this);
        this.guardarPasos = this.guardarPasos.bind(this);
        this.goBackToCookBook = this.goBackToCookBook.bind(this);
        this.toggleModalConfirmed = this.toggleModalConfirmed.bind(this);
    }
    goBackToCookBook(value) {
        var receta = {}
        this.props.navigation.navigate('CookBook', { receta })
    }

    callModal(texto, value) {
        if (value)
            this.setState({ isModalVisible: !this.state.isModalVisible, tituloModal: texto });
    }

    guardarImagenPrincipal(nameMainImage) {

        this.setState({ imagenGaleria: true, nameMainImage: nameMainImage });
    }
    guardarIngredientes(value, ingredientes) {
        this.setState({ isIngredientes: value, listaIngredientes: ingredientes });
    }
    guardarPasos(value, pasos, time, imagenesPasos) {
        this.setState({ isPasos: value, listaPasos: pasos, time: time, imagenesPasos: imagenesPasos });
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
            tituloReceta: event
        })
    }
    toggleModal() {

        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
    toggleModalConfirmed() {

        this.setState({ isModalVisibleConfirmed: !this.state.isModalVisibleConfirmed });
    };


    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.containerMain}>
                        <Header imagenGaleria={this.state.imagenGaleria} nameMainImage={this.state.nameMainImage}
                            tituloReceta={this.state.tituloReceta} sendData={this.callModal}
                            isIngredientes={this.state.isIngredientes} listaIngredientes={this.state.listaIngredientes}
                            isPasos={this.state.isPasos} listaPasos={this.state.listaPasos} time={this.state.time}
                            goBackToDetalleReceta={this.toggleModalConfirmed}
                            navigation={this.state.navigation}
                        ></Header>
                        <Photo isImageToGalery={this.guardarImagenPrincipal} tituloReceta={this.state.tituloReceta} ></Photo>
                        <TouchableOpacity onPress={this.validarReceta} style={styles.btnLogin}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ marginTop: 4, marginLeft: 10, marginRight: 20, color: 'white', fontWeight: '400', fontSize: 15 }}>Titulo de la receta: </Text>
                                <TextInput style={{ color: '#bbb', fontSize: 12, marginTop: 1 }} name="tituloReceta" onChangeText={this.handleChange} value={this.state.tituloReceta} placeholderStyle={{ fontFamily: "italic", borderColor: 'red' }} placeholder="Chips de queso sin tacc" placeholderTextColor='#e1e1e1' />
                            </View>
                        </TouchableOpacity>

                        <Ingrediente isIngredientes={this.guardarIngredientes}></Ingrediente>

                        <Paso isPasos={this.guardarPasos} tituloReceta={this.state.tituloReceta}></Paso>

                        <Modal style={styles.container} isVisible={this.state.isModalVisible}>
                            <View style={styles.content}>
                                {/* <Text style={styles.contentTitle}>Hi 👋!</Text> */}
                                <Text style={styles.contentTitle}>{this.state.tituloModal} 👋!</Text>
                                <Button danger style={{ width: 80, height: 40 }} onPress={this.toggleModal}>
                                    <Text style={{ fontSize: 18, color: "white", alignSelf: "center", left: 8 }} >Cerrar</Text>
                                </Button>

                            </View>
                        </Modal>
                        <Modal style={styles.container} isVisible={this.state.isModalVisibleConfirmed}>
                            <View style={styles.content}>
                                <GuardarReceta
                                    imagenGaleria={this.state.imagenGaleria} nameMainImage={this.state.nameMainImage}
                                    tituloReceta={this.state.tituloReceta} sendData={this.callModal} imagenesPasos={this.state.imagenesPasos}
                                    isIngredientes={this.state.isIngredientes} listaIngredientes={this.state.listaIngredientes}
                                    isPasos={this.state.isPasos} listaPasos={this.state.listaPasos} time={this.state.time}
                                    goBackToDetalleReceta={this.goBackToCookBook}
                                    navigation={this.state.navigation} toggleModalConfirmed={this.toggleModalConfirmed}>
                                </GuardarReceta>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 10,
        width: 350,
        height: 280
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
        height: 200,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50
    },
    logo: {
        width: 120,
        height: 120
    },
    logoText: {
        color: 'white',
        fontSize: 30,
        fontWeight: '800',
        marginTop: 10,
        opacity: 0.5
    },
    input: {
        width: WIDTH - 55,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.35)',
        color: 'rgba(255,255,255,0.7)',
        marginHorizontal: 25,
        textAlign: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: 37
    },
    inputContainer: {
        marginTop: 10

    },
    btnLogin: {
        width: WIDTH - 35,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginTop: 20,
        borderColor: 'white',
        borderWidth: 1
    },
    text: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center'
    },
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