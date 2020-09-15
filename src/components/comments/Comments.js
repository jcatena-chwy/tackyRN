import React, { Component } from 'react';
import { Text, TouchableOpacity, ImageBackground, StyleSheet, View, Image, ScrollView } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Button, Spinner, Icon } from 'native-base';
import comments from '../request/comments.json'
import Modal from "react-native-modal";
import Paso1 from "./Paso1"
import Paso2 from './Paso2.js';
import firebase from '../../config';
import bgImage from '../../assets/fondoDePantalla.jpg'
import tackyLogo from '../../assets/logoApp.png'

export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            isModalVisible: false,
            paso1: true,
            image: false,
            imageUrl: "",
            imagenSeleccionada: "",
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
            contenido: false,
            viewImage: false
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
        this.visualizarFoto = this.visualizarFoto.bind(this);
        this.toggleImageModal = this.toggleImageModal.bind(this);
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

    visualizarFoto(photo) {
        this.setState({ viewImage: true, imagenSeleccionada: photo });
    }

    toggleImageModal() {
        this.setState({ viewImage: false, imagenSeleccionada: "" });
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
                                    <Text style={{ color: 'white', fontSize: 15, textAlign: 'center', paddingTop: 20 }}>
                                        No existen comentarios vinculados {"\n"} al establecimiento {"\n"}{"\n"} ¿Querés ser el primero en dejar uno? {"\n"}{"\n"} 😉
                                    </Text>
                                    <View style={styles.bottomView}>
                                        <View style={styles.containerAddRecetaDetalle}>
                                            <Icon style={{ color: 'white' }} onPress={this.toggleModal} active name="ios-add" />
                                            <Text style={{ color: 'white', marginLeft: 3, marginRight: 3 }} onPress={this.toggleModal} >Agregar un comentario  </Text>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={{flex: 1, flexDirection: 'column', alignContent: 'center', alignItems: 'center'}}>
                                    <ScrollView
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        style={{height: 500, width: 350}}
                                    >
                                        {this.state.comments.map((comment, index) =>
                                            <List key={index}>
                                                <ListItem thumbnail onPress={() => {
                                                                comment.urlImage === "" ? this.visualizarFoto(tackyLogo) : this.visualizarFoto({ uri: comment.urlImage })}}>
                                                    <Left>
                                                        {comment.urlImage === "" ?
                                                            <Thumbnail square source={tackyLogo} />
                                                            :
                                                            <Thumbnail square source={{ uri: comment.urlImage }} />
                                                        }
                                                    </Left>
                                                    <Body>
                                                    <Text style={{color: '#b8b8b8'}}>{comment.date}</Text>
                                                        <Text note numberOfLines={10} style={{color: 'white', textAlign: 'justify'}}>{comment.description}</Text>
                                                    </Body>
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
                            }
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
                                            cantComentarios={this.props.navigation.state.params.cantComentarios}
                                        ></Paso2>
                                    )}
                            </View>
                        </Modal>
                        <Modal style={styles.container} isVisible={this.state.isModalVisibleSpinner}>
                            <View style={styles.contentSpinner}>
                                <Spinner color='red' />
                            </View>
                        </Modal>
                        <Modal style={styles.containerModal} isVisible={this.state.viewImage} >
                            {!this.state.viewImage && 
                            <View style={styles.contentModal}>
                                <Spinner color='red' />
                            </View>}
                            {this.state.viewImage && 
                            <View style={styles.contentModal}>
                                <Image 
                                    source={ this.state.imagenSeleccionada } 
                                    style={{ width: 200, height: 200, marginTop: 10 }}>
                                </Image>
                                <Body>
                                    <Button danger style={{ width: 90, marginTop: 10, flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={this.toggleImageModal}>
                                        <Text style={{ fontSize: 20, color: "white"}}>Cerrar</Text>
                                    </Button>
                                </Body>

                            </View>}
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
        bottom: 25, //Here is the trick
    },
    containerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        shadowRadius: 10,
        width: 280,
        height: 280,
        left: 30 
    },
    contentModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        width: 280,
        maxHeight: 300,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    }
});