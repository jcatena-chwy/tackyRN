import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Button, Icon, Container, Content, List, ListItem, Right, Left, Body, Thumbnail } from 'native-base';
import { Rating, AirbnbRating } from 'react-native-ratings';
import firebase from '../../../config';
import Modal from "react-native-modal";
export default class ModalDetalleProducto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productoSeleccionado: this.props.productoSeleccionado,
            isModalComentarios: false,
            isModalAddComentarios: false,
            isTextComentario: false,
            contenidoTexto: '',
            pickStart: false,
            isPickStart: false,
            comments: [],
            cantidad: 0,
            rows: [
                {
                    "id": 1, pregunta: "Como calificarías dicho producto?", recomend: false,
                    start: [
                        { "id": 1, color: 'black', name: 'md-star-outline', isclickStart: false },
                        { "id": 2, color: 'black', name: 'md-star-outline', isclickStart: false },
                        { "id": 3, color: 'black', name: 'md-star-outline', isclickStart: false },
                        { "id": 4, color: 'black', name: 'md-star-outline', isclickStart: false },
                        { "id": 5, color: 'black', name: 'md-star-outline', isclickStart: false },
                    ]
                }
            ],
        }
        this.toggleModalAddProducto = this.toggleModalAddProducto.bind(this);
        this.toggleModalComentarios = this.toggleModalComentarios.bind(this);
        this.showModalComentarios = this.showModalComentarios.bind(this);
        this.showModalAddComentarios = this.showModalAddComentarios.bind(this);
        this.cargarValores = this.cargarValores.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.validarCampos = this.validarCampos.bind(this)
        this.pickStart = this.pickStart.bind(this)
        this.actualizarScore = this.actualizarScore.bind(this)
        this.actualizarPromedio = this.actualizarPromedio.bind(this)
        this.guardarComentario = this.guardarComentario.bind(this)
        this.cargarComentarios = this.cargarComentarios.bind(this)
    }

    componentWillMount() {
        this.cargarValores();
    }

    cargarValores() {
        var jsonComments = {
            score: null,
            key: null
        }
        const db2 = firebase.database().ref('Products')
        db2.orderByChild('name')
            .equalTo(this.state.productoSeleccionado.name)
            .once('value')
            .then((snapshot) => {
                var value = snapshot.val();
                score = 0;
                if (value) {
                    snapshot.forEach((child) => {
                        jsonComments.score = child.val().score;
                        jsonComments.key = child.key
                    });
                    var producto = this.state.productoSeleccionado;
                    producto.score = jsonComments.score;
                    producto.key = jsonComments.key;
                    this.setState({
                        productoSeleccionado: producto
                    }, () => {
                        this.cargarComentarios()
                    });
                }
            });
    }
    cargarComentarios() {
        var comments = []
        const db2 = firebase.database().ref('Comments')
        db2.orderByChild('idProducto')
            .equalTo(this.state.productoSeleccionado.id)
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
                    cantidad: i
                }, () => {
                });
            });
    }

    showModalComentarios() {
        this.setState({ isModalComentarios: !this.state.isModalComentarios });
    }
    showModalAddComentarios() {
        this.setState({
            isModalComentarios: !this.state.isModalComentarios,
            isModalAddComentarios: !this.state.isModalAddComentarios,
        }, () => {
        });
    }
    toggleModalComentarios() {
        this.setState({
            isModalComentarios: !this.state.isModalComentarios
        }, () => {
            this.toggleModalAddProducto()
        });
    }
    toggleModalAddProducto() {
        this.props.cerrarModal('cerrar');
    }

    handleChange(event = {}) {
        if (event == "" || event == null) {
            this.setState({ isTextComentario: true, contenidoTexto: event });
        } else {
            this.setState({ isTextComentario: false, contenidoTexto: event });
        }
    }



    pickStart(row, col) {
        let newArray = [...this.state.rows];
        var startElegida = newArray[row - 1].start[col - 1].isclickStart
        for (i = 0; i < newArray[row - 1].start.length; i++) {
            if (startElegida) {
                if (i >= col) {
                    newArray[row - 1].start[i].color = "black"
                    newArray[row - 1].start[i].name = "md-star-outline"
                    newArray[row - 1].start[i].isclickStart = false
                }
            } else {
                if (i < col) {
                    if (!startElegida) {
                        newArray[row - 1].start[i].color = "yellow"
                        newArray[row - 1].start[i].name = "md-star"
                        newArray[row - 1].start[i].isclickStart = true
                    } else {
                        newArray[row - 1].start[i].color = "black"
                        newArray[row - 1].start[i].name = "md-star-outline"
                        newArray[row - 1].start[i].isclickStart = false
                    }
                } else {
                    newArray[row - 1].start[i].color = "black"
                    newArray[row - 1].start[i].name = "md-star-outline"
                    newArray[row - 1].start[i].isclickStart = false
                }
            }
        }
        this.setState({ rows: newArray, pickStart: true, isPickStart: false });
    };

    validarCampos() {
        if (this.state.contenidoTexto == '') {
            this.setState({ isTextComentario: true });
            return
        }
        if (this.state.pickStart === false) {
            this.setState({ isPickStart: true });
            return
        } else {
            this.setState({ isPickStart: false });
        }
        this.actualizarScore()
    }

    actualizarPromedio(score) {
        var averageScore = 0
        for (i = 0; i < this.state.rows.length; i++) {
            var cont = 0;
            for (f = 0; f < this.state.rows[i].start.length; f++) {
                var obj = this.state.rows[i].start[f]
                if (obj.isclickStart) {
                    cont++;
                }
            }
            averageScore = averageScore + cont;
        }
        return parseFloat(((averageScore + score) / 2).toFixed(2))
    }

    actualizarScore() {
        const db = firebase.database().ref('Products/' + this.state.productoSeleccionado.key)
        var averageScore = this.actualizarPromedio(this.state.productoSeleccionado.score);
        db.update({
            score: averageScore,
        }).then(() => {
            var producto = this.state.productoSeleccionado;
            producto.score = averageScore
            this.setState({
                productoSeleccionado: producto
            }, () => {
                this.guardarComentario()
            });

        }).catch((error) => {
            console.log("error")
        })
    }
    guardarComentario() {
        const db = firebase.database()
        var formattedDate = new Date();
        var fecha = formattedDate.getDay().toString() + "-" + formattedDate.getMonth().toString() + "-" + formattedDate.getFullYear().toString();
        db.ref("Comments").push({
            date: fecha,
            description: this.state.contenidoTexto,
            id: Math.random().toString(36).substring(7),
            idEstablecimiento: '',
            idImagen: '',
            idProducto: this.state.productoSeleccionado.id,
            userName: "",
            urlImage: ""
        }).then(() => {
            this.toggleModalAddProducto()
        }).catch((error) => {
            console.log("error")
        })
    }

    render() {
        return (
            <View style={styles.content}>
                <Image source={{ uri: this.state.productoSeleccionado.image }} style={{ width: 200, height: 200, marginTop: 10 }} />
                <Rating
                    ratingCount={5}
                    fractions={2}
                    startingValue={this.state.productoSeleccionado.score}
                    imageSize={40}
                    style={{ paddingVertical: 10 }}
                    readonly={true}
                    showReadOnlyText={true}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 10 }}>
                    <Button onPress={this.showModalComentarios} transparent textStyle={{ color: '#87838B' }}>
                        <Icon name="ios-add" />
                    </Button>
                    <Text onPress={this.showModalComentarios} style={{ fontSize: 20 }}>{this.state.cantidad} Comentarios</Text>
                </View>
                <Button danger onPress={this.toggleModalAddProducto}>
                    <Text onPress={this.toggleModalAddProducto} style={styles.TextStyle} >Cerrar</Text>
                </Button>
                <Modal isVisible={this.state.isModalComentarios}>
                    <View style={styles.content3}>
                        {this.state.comments.map((comment, index) =>
                            <List key={index}>
                                <ListItem avatar>
                                    <Left>
                                        {/* <Thumbnail source={{ uri: comment.image }} /> */}
                                    </Left>
                                    <Body>
                                        <Text note>{comment.description}</Text>
                                    </Body>
                                </ListItem>
                            </List>
                        )}
                        <View style={styles.container2}>
                            <View style={styles.buttonContainer}>
                                <Button danger onPress={this.toggleModalAddProducto}>
                                    <Text onPress={this.toggleModalAddProducto} style={styles.TextStyle} >Cerrar</Text>
                                </Button>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button onPress={this.showModalAddComentarios} style={{ float: 'right', marginLeft: 25, marginRight: 5 }} success >
                                    <Text onPress={this.showModalAddComentarios} style={styles.TextStyle}  >Agregar un Comentario</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal isVisible={this.state.isModalAddComentarios}>
                    <View style={styles.content3}>
                        <List>
                            <ListItem avatar>
                                <Left>
                                <Image style={{width: 50, height: 50}} source={require('../../../assets/logoApp.png')} />
                                    {/* <Thumbnail source={{ uri: "https://img.fifa.com/image/upload/t_l4/v1568781948/gzuddxhx4evpfd5q5ean.jpg" }} /> */}
                                </Left>
                                <Body>
                                    <TextInput
                                        style={styles.textArea}
                                        underlineColorAndroid="transparent"
                                        placeholder="Escribir..."
                                        placeholderTextColor="grey"
                                        numberOfLines={10}
                                        multiline={true}
                                        onChangeText={this.handleChange}
                                        value={this.state.contenidoTexto}
                                    />
                                    {this.state.isTextComentario && <Text style={styles.textStyleAlert}> Por favor ingrese un texto </Text>}
                                </Body>
                                <Right>
                                    <Text note>3:43 pm</Text>
                                </Right>
                            </ListItem>
                        </List>
                        {this.state.rows.map((r) =>
                            <Content key={r.id}>
                                <Text style={{ fontSize: 20 }}>{r.pregunta}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {r.start.map((s) =>
                                        <Icon key={s.id} active name={s.name} style={{ fontSize: 40, color: s.color }} onPress={() => this.pickStart(r.id, s.id)} />
                                    )}
                                </View>
                                {this.state.isPickStart && <Text style={styles.textStyleAlert}> Por favor califique el producto</Text>}
                            </Content>
                        )}
                        <View style={styles.container2}>
                            <View style={styles.buttonContainer}>
                                <Button danger onPress={this.toggleModalAddProducto}>
                                    <Text onPress={this.toggleModalAddProducto} style={styles.TextStyle} >Cerrar</Text>
                                </Button>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button style={{ float: 'right', marginLeft: 25, marginRight: 5 }} success onPress={this.validarCampos}>
                                    <Text style={styles.TextStyle} onPress={this.validarCampos} >Siguiente</Text>
                                </Button>
                            </View>
                        </View>
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
    textStyleAlert: {
        color: "red"
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
    content2: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: 350,
        height: 400
    },
    content3: {
        backgroundColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        marginBottom: 10,
        width: 350,
        height: 400
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
        marginTop: 60,
        backgroundColor: 'white',
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
    },


});