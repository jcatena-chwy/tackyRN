import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Button, Spinner } from 'native-base';
import comments from '../request/comments.json'
import Modal from "react-native-modal";
import Paso1 from "./Paso1"
import Paso2 from './Paso2.js';
import firebase from '../../config';
export default class Comments extends Component {
  constructor(props){
    super(props);
    this.state = {
        comments: [],
        isModalVisible: false,
        paso1:true,
        image:false,
        imageUrl:"",
        contieneTexto:false,
        textoPaso1:"",
        infoPaso1:{},
        image: null,
        isModalVisibleSpinner: false,
        idComments: this.props.navigation.state.params.idComments,
        name: this.props.navigation.state.params.name,
        score: this.props.navigation.state.params.score,
        cantCall:0,
        posicion:0,
        textComentario:false,
        averageScore: null
    } 
    this.toggleModal= this.toggleModal.bind(this);
    this.setPaso1=this.setPaso1.bind(this);
    this.analizarTexto=this.analizarTexto.bind(this);
    this.analizarImagen=this.analizarImagen.bind(this);
    this.validarCampos=this.validarCampos.bind(this);
    this.validarPaso2=this.validarPaso2.bind(this);
    this.setearValorPaso1=this.setearValorPaso1.bind(this);
    this.uploadImage=this.uploadImage.bind(this);
    this.toggleModalandReloadList=this.toggleModalandReloadList.bind(this);
  }

  componentWillMount() {
    this.cargarLista(); 
  }

  cargarLista(){
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
          console.log(child.key, child.val());
          comments[i] = child.val()
          i++
        });
      }
      this.setState({
        comments: comments
      }, () => {
        this.cargarFotos(this.state.comments)
      });
    });
  }

  cargarFotos() {
    var cantCall=0;
    for(f =0; f<this.state.comments.length; f++){
      var obj = this.state.comments[f]
      if( 'idImagen' in  obj ) {
        if(obj.idImagen != '' ){
          soloTexto= true
          cantCall = cantCall + 1;
          // this.uploadImage(obj.idImagen, this.state.name)
        }
      }
    }
    this.setState({
      cantCall: cantCall
    }, () => {
      if(cantCall>0){
        for(f =0; f<this.state.comments.length; f++){
          var obj = this.state.comments[f]
          if( 'idImagen' in  obj ) {
            if(obj.idImagen != '' ){
               this.uploadImage(obj.idImagen, this.state.name, cantCall)
            }
          }
        }
      }else {
        this.setState({
          isModalVisibleSpinner: !this.state.isModalVisibleSpinner
        }, () => {
        });
      }
    });
  }

  uploadImage = async (imageName, nameEstablecimiento, cantCall) => {
    var ref = firebase.storage().ref("images/ImageEstablecimiento/"+ nameEstablecimiento + "/Comentarios/" + imageName).getDownloadURL()
        .then(resolve => { 
          let newArray = [...this.state.comments]
          for(f =0; f<newArray.length; f++){
            var obj = this.state.comments[f]
            if( 'idImagen' in  obj ) {
              if(obj.idImagen === imageName ){
                obj.urlImage = resolve
              }
            }
          }
          posicion = this.state.posicion + 1
          this.setState({
            comments: newArray,
            posicion : posicion
          }, () => {
            if(this.state.posicion === this.state.cantCall){
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

  validarPaso2(){
    if(this.state.contieneTexto){
      var json = {
        text: this.state.textoPaso1,
        image: this.state.imageUrl,
        idEstablecimiento: this.state.idComments,
        name: this.state.name,
        score: this.state.score,
      }
      this.setState({ paso1: false, infoPaso1:json});
    } else {
      this.setState({ textComentario: true});
    }
  }

  analizarTexto(val, text){
    this.setState({ contieneTexto: val, textoPaso1:text});
  }

  analizarImagen(image){
    this.setState({ imageUrl:image});
  }

  setearValorPaso1() {
    this.setState({paso1:true})
  }
  
  setPaso1(val){
    this.setState({ image: val});
  }
  
  toggleModal(){
    var json = {
      text: '',
      image: '',
      idEstablecimiento: this.state.idComments,
      name: this.state.name,
      score: this.state.score,
    }
    this.setState({ isModalVisible: !this.state.isModalVisible, infoPaso1:json });
  }
  toggleModalandReloadList(averageScore){
    this.setState({
      averageScore: averageScore,
      isModalVisible: !this.state.isModalVisible, paso1: true, contieneTexto:false,  textComentario: false, posicion : 0
    }, () => {
      setTimeout(() => { 
        this.setState({
        }, () => { 
          this.cargarLista();
        });
      }, 100)
    });
  }
  validarCampos(){ 
    if(this.state.image){
      this.setState({ paso1: true, image:false});
    }else {
      this.setState({ paso1: false, image:true});
    }
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <Header />
        <Content>
          {this.state.comments.map((comment, index) =>
            <List key={index}>
                <ListItem  avatar>
                <Left>
                    {/* <Thumbnail source={{ uri: comment.image }} /> */}
                </Left>
                {comment.urlImage === "" ? (
                <Body>
                    <Text note>{comment.description}</Text>
                </Body>
                ) : (
                  <Body>
                <Image source={{ uri: comment.urlImage }}  style={{ width: 200, height: 180}} />
                    <Text note>{comment.description}</Text>
                </Body>
                  )}
                <Right>
                    <Text note>{comment.date}</Text>
                </Right>
                </ListItem>
            </List>
        )}
        <TouchableOpacity
          style={styles.SubmitButtonStyle}
          activeOpacity = { .5 }
          onPress={ this.toggleModal }
       >
        <Text style={styles.TextStyle}> Agregar un comentario </Text>
        
      </TouchableOpacity>
      <Modal style={styles.container} isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            {this.state.paso1 ? (
              <Content>
                <Paso1 image = {this.state.image} sendDataText={this.analizarTexto}
                       sendDataImage={this.analizarImagen}
                       cerrarModal = {this.toggleModal}
                       validarCampos = {this.validarPaso2}
                       textComentario = {this.state.textComentario}
                       infoPaso1 = {this.state.infoPaso1}
                       ></Paso1>
              </Content>
              ) : (
                  <Paso2 infoPaso1 = {this.state.infoPaso1} 
                   regresarPaso1 = {this.setearValorPaso1}
                   cerrarModal = {this.toggleModalandReloadList}
                   ></Paso2>
            )}
          
          </View> 
        </Modal>
        <Modal style={styles.container} isVisible={this.state.isModalVisibleSpinner}>
                    <View style={styles.contentSpinner}> 
                        <Spinner color='red' />
                    </View>
                </Modal>
        </Content>
      </Container>
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
 
    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'#00BCD4',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
 
  TextStyle:{
      color:'#fff',
      textAlign:'center',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius:10,
    width: 350, 
    height:280
  },
  button: {
    backgroundColor: 'lightblue',
    width: 30, 
    height:20,
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
    width:330,
    height:400,
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
    marginBottom:10
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
    width:200,
    height:200,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
 
});