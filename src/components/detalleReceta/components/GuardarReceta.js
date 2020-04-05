import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Button, Icon, Left, Body, Right, Header, Spinner, Container, Content } from 'native-base';
import firebase from '../../../config';
import Modal from 'react-native-modal';
export default class GuardarReceta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisibleSpinner: false,
            navigation: this.props.navigation,
            valueConfirmed: ''
        }
        this.toggleModalConfirmed = this.toggleModalConfirmed.bind(this);
        this.uploadImageSteps = this.uploadImageSteps.bind(this);
    }

    toggleModalConfirmed(value) {
        this.setState({
            valueConfirmed: value
        }, () => {
            this.props.toggleModalConfirmed()
        });
    }

    componentWillUnmount() {
        // Guardo la Imagen Principañ
        if (this.state.valueConfirmed === 'Confirmar') {
            var mainImage = Math.random().toString(36).substring(7);
            this.props.navigation.navigate('Cargando')
            this.uploadImage(this.props.nameMainImage, mainImage).then((responseData) => {
                console.log("Guardo en Storage la Imagen Principal")
                var mensaje = "ImagenPaso"
                var navigation = this.props.navigation;
                var cantidad = 0
                //Luego Guardo la imagen de los pasos
                for (a = 0; a < this.props.listaPasos.length; a++) {
                    var step = this.props.listaPasos[a];
                    for (j = 0; j < step.photos.length; j++) {
                        if (step.photos[j].image != null) {
                            cantidad = cantidad + 1;
                        }
                    }
                }
                if (cantidad > 0) {
                    for (i = 0; i < this.props.listaPasos.length; i++) {
                        var step = this.props.listaPasos[i];
                        for (f = 0; f < step.photos.length; f++) {
                            if (step.photos[f].image != null) {
                                var name = step.photos[f].name;
                                var uri = step.photos[f].image
                                this.uploadImageSteps(uri, name).then((responseData) => {
                                    console.log("Inserto Imagen en Pasos en el Storage")
                                    var mensaje = "ImagenPaso"
                                    var navigation = this.props.navigation;
                                    var receta = {
                                        id: Math.random().toString(36).substring(7),
                                        mainImage: mainImage,
                                        title: this.props.tituloReceta,
                                        ingredients: this.props.listaIngredientes,
                                        steps: this.props.listaPasos,
                                        time: this.props.time
                                    };
                                    cantidad--;
                                    this.props.navigation.navigate('Cargando', { navigation, mensaje, receta, cantidad })
                                })
                            }
                        }
                    }
                } else {
                    var receta = {
                        id: Math.random().toString(36).substring(7),
                        mainImage: mainImage,
                        title: this.props.tituloReceta,
                        ingredients: this.props.listaIngredientes,
                        steps: this.props.listaPasos,
                        time: this.props.time
                    };
                    this.props.navigation.navigate('Cargando', { navigation, mensaje, receta, cantidad })
                }
            })
        }

    }
    // 1 Guardo la imagen Principal
    // 2 Guardo Las imagenes de los pasos
    // 3 Despues en Cargando guardo la receta 


    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref().child("images/ImageRecipe/" + this.props.tituloReceta + "/" + imageName);
        return ref.put(blob)
    }
    uploadImageSteps = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref().child("images/ImageRecipe/" + this.props.tituloReceta + "/" + "Steps" + "/" + imageName);
        return ref.put(blob)
    }



    render() {
        const navigation = this.props.navigation;
        return (
            <Container>
                <Content>
                    <Text>¿Esta seguro que desea guardar la Receta?</Text>
                    <View style={styles.container2}>
                        <View style={styles.buttonContainer}>
                            <Button style={{ float: 'right', marginLeft: 30 }} danger onPress={() => this.toggleModalConfirmed('Cerrar')}>
                                <Text style={styles.TextStyle} >Cerrar</Text>
                            </Button>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button style={{ float: 'right', marginLeft: 25, marginRight: 5 }} success onPress={() => this.toggleModalConfirmed('Confirmar')}>
                                <Text style={styles.TextStyle}  >Confirmar</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    textAreaContainer: {
        borderWidth: 1,
        padding: 5
    },
    textArea: {
        height: 50,
        justifyContent: "flex-start"
    },
    navBarLeftButton: {
        paddingLeft: 100,
        fontSize: 80
    },
    textStyleAlert: {
        color: "red"
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
})
