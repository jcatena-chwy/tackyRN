import React, { Component } from 'react';
import { Text, TouchableOpacity, ImageBackground, StyleSheet, View, Image, ScrollView } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Button, Spinner, Icon } from 'native-base';
import comments from '../request/comments.json'
import Modal from "react-native-modal";
import Paso1 from "./Paso1"
import Paso2 from './Paso2.js';
import firebase from '../../config';
import bgImage from '../../assets/fondoDePantalla.jpg'

export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            isModalVisible: false,
            paso1: true,
            image: false,
            imageUrl: "",
            contieneTexto: false,
            textoPaso1: "",
            infoPaso1: {},
            image: null,
            isModalVisibleSpinner: false,
            visual: true,
            idComments: this.props.navigation.state.params.idComments,
            name: this.props.navigation.state.params.name,
            score: this.props.navigation.state.params.score,
            cantCall: 0,
            posicion: 0,
            textComentario: false,
            averageScore: null,
            contenido: false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.setPaso1 = this.setPaso1.bind(this);
        this.analizarTexto = this.analizarTexto.bind(this);
        this.analizarImagen = this.analizarImagen.bind(this);
        this.validarCampos = this.validarCampos.bind(this);
        this.validarPaso2 = this.validarPaso2.bind(this);
        this.setearValorPaso1 = this.setearValorPaso1.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.toggleModalandReloadList = this.toggleModalandReloadList.bind(this);
    }

    componentWillMount() {
        this.cargarLista();
    }

    cargarLista() {
        this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
        var comments = []
        const db2 = firebase.database().ref('Comments')
        db2.orderByChild('idEstablecimiento')
            .equalTo(this.state.idComments)
            .once('value')
            .then((snapshot) => {
                var value = snapshot.val();
                i = 0;
                if (value) {
                    snapshot.forEach((child) => {
                        comments[i] = child.val()
                        i++
                    });
                }
                this.setState({
                    comments: comments,
                    contenido: true
                }, () => {
                    this.cargarFotos(this.state.comments)
                });
            });
    }

    cargarFotos() {
        var cantCall = 0;
        for (f = 0; f < this.state.comments.length; f++) {
            var obj = this.state.comments[f]
            if ('idImagen' in obj) {
                if (obj.idImagen != '') {
                    soloTexto = true
                    cantCall = cantCall + 1;
                    // this.uploadImage(obj.idImagen, this.state.name)
                }
            }
        }
        this.setState({
            cantCall: cantCall
        }, () => {
            if (cantCall > 0) {
                for (f = 0; f < this.state.comments.length; f++) {
                    var obj = this.state.comments[f]
                    if ('idImagen' in obj) {
                        if (obj.idImagen != '') {
                            this.uploadImage(obj.idImagen, this.state.name, cantCall)
                        }
                    }
                }
            } else {
                this.setState({
                    isModalVisibleSpinner: !this.state.isModalVisibleSpinner
                }, () => {
                });
            }
        });
    }

    uploadImage = async (imageName, nameEstablecimiento, cantCall) => {
        var ref = firebase.storage().ref("images/ImageEstablecimiento/" + nameEstablecimiento + "/Comentarios/" + imageName).getDownloadURL()
            .then(resolve => {
                let newArray = [...this.state.comments]
                for (f = 0; f < newArray.length; f++) {
                    var obj = this.state.comments[f]
                    if ('idImagen' in obj) {
                        if (obj.idImagen === imageName) {
                            obj.urlImage = resolve
                        }
                    }
                }
                posicion = this.state.posicion + 1
                this.setState({
                    comments: newArray,
                    posicion: posicion
                }, () => {
                    if (this.state.posicion === this.state.cantCall) {
                        this.setState({
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

    validarPaso2() {
        if (this.state.contieneTexto) {
            var json = {
                text: this.state.textoPaso1,
                image: this.state.imageUrl,
                idEstablecimiento: this.state.idComments,
                name: this.state.name,
                score: this.state.score,
            }
            this.setState({ paso1: false, infoPaso1: json });
        } else {
            this.setState({ textComentario: true });
        }
    }

    analizarTexto(val, text) {
        this.setState({ contieneTexto: val, textoPaso1: text });
    }

    analizarImagen(image) {
        this.setState({ imageUrl: image });
    }

    setearValorPaso1() {
        this.setState({ paso1: true })
    }

    setPaso1(val) {
        this.setState({ image: val });
    }

    toggleModal() {
        var json = {
            text: '',
            image: '',
            idEstablecimiento: this.state.idComments,
            name: this.state.name,
            score: this.state.score,
        }
        this.setState({ isModalVisible: !this.state.isModalVisible, infoPaso1: json });
    }
    toggleModalandReloadList(averageScore, value, fotoCargada) {
        debugger;
        if (value) {
            if (fotoCargada) {
                this.setState({
                    averageScore: averageScore,
                    paso1: true, contieneTexto: false, textComentario: false, posicion: 0,
                    visual: false
                }, () => {
                    var json = {}
                    json.averageScore = averageScore
                    if (value != undefined && json.averageScore != null) {
                        this.setState({
                            isModalVisibleSpinner: !this.state.isModalVisibleSpinner,
                        }, () => {
                            this.props.navigation.navigate('Place', { json })
                        });
                    }
                });
            } else {
                debugger
                this.setState({
                    isModalVisible: !this.state.isModalVisible,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            isModalVisibleSpinner: !this.state.isModalVisibleSpinner,
                        }, () => {

                        });
                    }, 1000)
                });
            }
        } else {
            this.setState({
                isModalVisible: !this.state.isModalVisible,
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isModalVisibleSpinner: !this.state.isModalVisibleSpinner,
                    }, () => {
                        var json = {}
                        json.averageScore = averageScore
                        if (value != undefined && json.averageScore != null) {
                            this.setState({
                                isModalVisibleSpinner: !this.state.isModalVisibleSpinner,
                            }, () => {
                                this.props.navigation.navigate('Place', { json })
                            });
                        }
                    });
                }, 1000)
            });
        }

    }
    validarCampos() {
        if (this.state.image) {
            this.setState({ paso1: true, image: false });
        } else {
            this.setState({ paso1: false, image: true });
        }
    }
    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={bgImage} style={styles.containerMain}>
                {this.state.contenido ?
                    <View style={styles.containerMain2}>
                        <View>
                            {this.state.comments.length === 0 ?
                                <View style={styles.containerMain2} >
                                    <Text style={{ color: 'white', fontSize: 14 }}>No existen comentarios vinculados al establecimiento</Text>
                                    <View style={styles.bottomView}>
                                        <View style={styles.containerAddRecetaDetalle}>
                                            <Icon style={{ color: 'white' }} onPress={this.toggleModal} active name="ios-add" />
                                            <Text style={{ color: 'white' }} onPress={this.toggleModal} >Agregar un comentario  </Text>
                                        </View>
                                    </View>
                                </View>
                                : (
                                    <View style={styles.containerMain2} >
                                        <ScrollView
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {this.state.comments.map((comment, index) =>
                                                <List key={index}>
                                                    <ListItem avatar>
                                                        <Left>
                                                        </Left>
                                                        {comment.urlImage === "" ? (
                                                            <Body>
                                                                <Text style={{ color: 'white' }} note>{comment.description}</Text>
                                                            </Body>
                                                        ) : (
                                                                <Body>
                                                                    <Image source={{ uri: comment.urlImage }} style={{ width: 200, height: 180 }} />
                                                                    <Text style={{ color: 'white' }} note>{comment.description}</Text>
                                                                </Body>
                                                            )}
                                                        <Right>
                                                        </Right>
                                                    </ListItem>
                                                </List>
                                            )}
                                        </ScrollView>
                                        <View style={styles.containerSection2}>
                                            <View style={styles.containerAddRecetaDetalle}>
                                                <Icon style={{ color: 'white' }} onPress={this.toggleModal} active name="ios-add" />
                                                <Text style={{ color: 'white', marginLeft: 3, marginRight: 3 }} onPress={this.toggleModal} >Agregar un comentario  </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                        </View>
                        <Modal style={styles.container} isVisible={this.state.isModalVisible}>
                            <View style={styles.content2}>
                                {this.state.paso1 ? (
                                    <Content>
                                        <Paso1 image={this.state.image} sendDataText={this.analizarTexto}
                                            sendDataImage={this.analizarImagen}
                                            cerrarModal={this.toggleModal}
                                            validarCampos={this.validarPaso2}
                                            textComentario={this.state.textComentario}
                                            infoPaso1={this.state.infoPaso1}
                                        ></Paso1>
                                    </Content>
                                ) : (
                                        <Paso2 infoPaso1={this.state.infoPaso1}
                                            regresarPaso1={this.setearValorPaso1}
                                            cerrarModal={this.toggleModalandReloadList}
                                        ></Paso2>
                                    )}
                            </View>
                        </Modal>
                        <Modal style={styles.container} isVisible={this.state.isModalVisibleSpinner}>
                            <View style={styles.contentSpinner}>
                                <Spinner color='red' />
                            </View>
                        </Modal>
                    </View>
                    : (
                        <Text></Text>
                    )}
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
    containerMain2: {
        flex: 1,
    },
    containerSection2: {
        backgroundColor: '#a1998e',
        borderColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        width: 250,
        height: 30,
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 10,
        width: 350,
        height: 280,
    },
    content: {
        backgroundColor: 'white',
        // padding: 22,
        borderRadius: 4,
        width: 330,
        height: 400,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    content2: {
        backgroundColor: 'white',
        // padding: 22,
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
    bottomView: {
        backgroundColor: '#a1998e',
        borderColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        width: 250,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        marginLeft: 20,
        marginBottom: 5,
    },
});