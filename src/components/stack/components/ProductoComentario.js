import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableHighlight, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, Image, FlatList } from 'react-native';
import { Button, Spinner} from 'native-base';
import { Content, } from 'native-base';
import { Icon} from 'native-base';
import bgImage from '../../../assets/fondoDePantalla.jpg'
import firebase from '../../../config';
import Modal from "react-native-modal";
export default class ProductoComentario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      cantidad: 0,
      isModalComentarios: false,
      isModalAddComentarios: false,
      productoSeleccionado: this.props.navigation.state.params.productoSeleccionado,
      navigation: this.props.navigation.state.params.navigation,
      isModalProducto:false,
      isTextComentario: false,
      contenidoTexto: '',
      rows: [
        { "id":1, pregunta:"Que te parecio la comida?",recomend: false,
            start:[
            { "id":1, color: 'black', name:'md-star-outline', isclickStart:false  },
            { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
            { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
            { "id":4, color: 'black', name:'md-star-outline' , isclickStart:false  },
            { "id":5, color: 'black' , name:'md-star-outline' , isclickStart:false },
            ] 
        }
      ],
      pickStart: false,
      isPickStart: false,
      puntajeElegido: 0,
      isModalVisibleSpinner: false
    }
    this.cargarValores = this.cargarValores.bind(this)
    this.showModalAddComentarios = this.showModalAddComentarios.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.validarCampos = this.validarCampos.bind(this);
    this.pickStart = this.pickStart.bind(this);
    this.actualizarScore = this.actualizarScore.bind(this);
    this.actualizarPromedio = this.actualizarPromedio.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.guardarComentario = this.guardarComentario.bind(this);
    this.obtenerKeyPuntaje = this.obtenerKeyPuntaje.bind(this);
    this.actualizarListaComentarios = this.actualizarListaComentarios.bind(this);
  }

  componentWillMount() {
    this.cargarValores();
  }

  cargarValores() {
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
            comments[i] = child.val();
            comments[i].cantidad = i + 1;
            i++;
          });
        }
        this.setState({
          comments: comments,
          cantidad: i
        }, () => {
        });
      });
  }

  showModalAddComentarios() {
    this.setState({
      isModalProducto: !this.state.isModalProducto,
    }, () => {
      
    });

  }
  toggleModal() {
    this.setState({
      isModalProducto: !this.state.isModalProducto,
    }, () => {
      
    });
  }

  handleChange(event = {}) {
    if (event == "" || event == null) {
        this.setState({ isTextComentario: true, contenidoTexto: event });
    } else {
        this.setState({ isTextComentario: false, contenidoTexto: event });
    }
  }

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
    this.toggleModal();
    setTimeout(() => {
      this.setState({
        isModalVisibleSpinner: !this.state.isModalVisibleSpinner
      }, () => {
        this.obtenerKeyPuntaje();
      });
    }, 900)
  } 

  obtenerKeyPuntaje() {
    var jsonComments = {
      score: null,
      key: null
    }
    const db2 = firebase.database().ref('Products')
    db2.orderByChild('id')
        .equalTo(this.state.productoSeleccionado.id)
        .once('value')
        .then((snapshot) => {
            var value = snapshot.val();
            score = 0;
            if (value) {
                snapshot.forEach((child) => {
                    jsonComments.key = child.key;
                });
                var producto = this.state.productoSeleccionado;
                producto.key = jsonComments.key;
                this.setState({
                    productoSeleccionado: producto
                }, () => {
                  this.actualizarScore();
                });
            }
    });
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
    this.setState({ rows: newArray, pickStart: true, isPickStart: false, puntajeElegido: col });
  };

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
            this.guardarComentario();
        });

    }).catch((error) => {
        console.log("error")
    })
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
      this.setState({
        
        isTextComentario: false,
        contenidoTexto: '',
        pickStart: false,
        isPickStart: false,
        rows: [
          { "id":1, pregunta:"Que te parecio la comida?",recomend: false,
              start:[
              { "id":1, color: 'black', name:'md-star-outline', isclickStart:false  },
              { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
              { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
              { "id":4, color: 'black', name:'md-star-outline' , isclickStart:false  },
              { "id":5, color: 'black' , name:'md-star-outline' , isclickStart:false },
              ] 
          }
        ],
      }, () => {
        this.actualizarListaComentarios();
      });
    }).catch((error) => {
        console.log("error")
    })
  }

  actualizarListaComentarios(){
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
            comments[i] = child.val();
            comments[i].cantidad = i + 1;
            i++;
          });
        }
        this.setState({
          comments: comments,
          cantidad: i,
          isModalVisibleSpinner: !this.state.isModalVisibleSpinner,
        }, () => {
          var updateScore = 'actualizarScore';
          this.state.navigation.navigate('Productos', {updateScore})
        });
      });
  }

  render() {
    return ( 
      <ImageBackground source={bgImage} style={styles.containerMain}>
        <View style={styles.containerMain2}>
          <View>
            {this.state.comments.length === 0 ?
            <Text style={{color: 'white', fontSize: 15}}>No existen comentarios vinculados al producto</Text>
            : (
            <Text></Text>
          )}
          </View>
          <FlatList
            style={styles.root}
            data={this.state.comments}
            extraData={this.state}
            ItemSeparatorComponent={() => {
              return (
                <View style={styles.separator}/>
              )
            }}
            keyExtractor={(item)=>{
              return item.id;
            }}
            renderItem={(item) => {
              const Notification = item.item;
              return(
                <ImageBackground source={bgImage} style={styles.containerMain}>
                <View style={styles.container}>
                  <TouchableHighlight
                      style={{
                        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                        width: Dimensions.get('window').width * 0.09,
                        height: Dimensions.get('window').width * 0.09,
                        backgroundColor: '#e23f52',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 20
                      }}
                      underlayColor='#ccc'
                    >
                      <Text style={{ color: 'white' }}>{Notification.cantidad}</Text>
                    </TouchableHighlight>
                  <View style={styles.content}>
                    <Text style={{top:7}}>{Notification.description}</Text>
                  </View>
                </View>
                </ImageBackground>
              );
          }}/> 
          
         
          <View style={styles.bottomView}>
            <Icon style={{ color: 'white' }} onPress={() => this.showModalAddComentarios()} active name="ios-add" />
            <Text style={styles.textAddReceta} onPress={() => this.showModalAddComentarios()} >Agregar un Comentario</Text>
          </View>
          <Modal style={styles.containerSpinner} isVisible={this.state.isModalProducto}>
            <View style={styles.contentSpinner}>
                  <TextInput
                      style={styles.textArea}
                      underlineColorAndroid="transparent"
                      placeholder="Escribir..."
                      placeholderTextColor="grey"
                      numberOfLines={3}
                      multiline={true}
                      onChangeText={this.handleChange}
                      value={this.state.contenidoTexto}
                  />
                  {this.state.isTextComentario && <Text style={styles.textStyleAlert}> Por favor ingrese un texto </Text>}
                  {this.state.rows.map((r) =>
                    <Content key={r.id}>
                        <View style={{flexDirection: 'row'}}>
                            {r.start.map((s) =>
                                <Icon key={s.id} active name={s.name} style={{ fontSize: 40, color: s.color }} onPress={() => this.pickStart(r.id, s.id)} />
                            )} 
                        </View>
                        {this.state.isPickStart && <Text style={styles.textStyleAlert}> Por favor seleccione un puntaje</Text>}
                    </Content>
                  )} 
                  <View style={styles.container2}>
                      <View style={styles.buttonContainer}>
                          <Button danger onPress={this.toggleModal}>
                              <Text onPress={this.toggleModal} style={styles.TextStyle} >Cerrar</Text>
                          </Button>
                      </View>
                      <View style={styles.buttonContainer}> 
                          <Button success onPress={this.validarCampos}>
                              <Text  style={styles.TextStyle} onPress={this.validarCampos} >Guardar</Text>
                          </Button>
                      </View>
                  </View>
            </View>
          </Modal>
          <Modal style={styles.containerSpinner2} isVisible={this.state.isModalVisibleSpinner}>
            <View style={styles.contentSpinner2}>
              <Spinner color='red' />
            </View>
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
  },
  root: {
    marginTop:10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    height: 1,
    backgroundColor: "#e97463"
  },
  image:{
    width:45,
    height:45,
    borderRadius:20,
    marginLeft:20
  },
  textStyleAlert: {
    color: "white"
  },
  time:{
    fontSize:11,
    color:"#808080",
  },
  name:{
    fontSize:16,
    fontWeight:"bold",
  },
  containerSection2: {
    backgroundColor: 'red',
    borderColor: 'red',
    borderRadius: 20,
    borderWidth: 1,
    width: 250,
    height: 30,
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  containerAddRecetaDetalle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAddReceta: {
    marginLeft: 5,
    color: 'white',
  },
  containerMain2: {
    flex: 1,
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
    marginLeft: 50,
    marginBottom: 5,
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
  containerProducto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    width: 250,
    height: 50,
    backgroundColor: '#e97463',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20
  },
  containerSpinner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		shadowRadius:10,
		width: 350, 
		height:300
  },
  contentSpinner: {
  backgroundColor: '#e97463',
  padding: 22,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 4,
  width:300,
  height:300,
  borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textArea: {
    height: 80,
    width: 250,
    justifyContent: "flex-start",
    backgroundColor: "white"
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
    marginRight: 5,
  },
  containerSpinner2: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		shadowRadius:10,
		width: 350, 
		height:280
  },
  contentSpinner2: {
  backgroundColor: 'white',
  padding: 22,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 4,
  width:200,
  height:200,
  borderColor: 'rgba(0, 0, 0, 0.1)',
  }
});
