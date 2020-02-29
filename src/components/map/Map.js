import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import styles from "./MapComponentStyles";
import restaurantes from '../request/restaurantes.json'
import firebase from '../../config';
import Modal from "react-native-modal";
import Footer from '../footer/Footer'
import {Spinner } from 'native-base';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
 
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['FIREBASE WARNING']);
YellowBox.ignoreWarnings(['Warning']);
export default class Map extends React.Component {
  constructor(props){
    super(props) 
    this.state = { 
      latitude:-34.742569, 
      longitude:-58.385842,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015, 
      error: null,
      visibility:false,
      establecimientos: [],
      isModalVisibleSpinner: false,
      dbCopia: null,
      cantCall : 0
    }
    this.guidGenerator = this.guidGenerator.bind(this)
    this.cargarLista = this.cargarLista.bind(this);
    this.getPlace = this.getPlace.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getScore = this.getScore.bind(this);
    this.getImagenesProductos = this.getImagenesProductos.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.uploadImageProductos = this.uploadImageProductos.bind(this);
  }

  componentWillMount() {
    this.cargarLista(); 
  }

  cargarLista(){
    this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
    const db = firebase.database()
    db.ref('Establecimientos').once('value', (data) =>{
        var establecimientos = []
        var jsonEstablecimientos = []
        jsonEstablecimientos = data.toJSON()
        i = 0; 
        for(var key in jsonEstablecimientos){ 
            var obj = jsonEstablecimientos[key]; 
            obj.id = jsonEstablecimientos[key].id
            obj.idComments = jsonEstablecimientos[key].comments
            obj.image = jsonEstablecimientos[key].image
            obj.latitude = jsonEstablecimientos[key].latitude
            obj.longitude = jsonEstablecimientos[key].longitude
            obj.name = jsonEstablecimientos[key].name
            obj.phone = jsonEstablecimientos[key].phone
            obj.schedule = jsonEstablecimientos[key].schedule
            obj.score = jsonEstablecimientos[key].score
            obj.type = jsonEstablecimientos[key].type
            establecimientos[i] = obj
            i = i +1; 
        }
        this.setState({ establecimientos: establecimientos, isModalVisibleSpinner: !this.state.isModalVisibleSpinner});
    })
  }

  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  } 

  markerClick(restaurante){
    this.setState({
      visibility:true
    });
    console.log("click")
    // this.props.updateState(restaurante);
    
  }

  getPlace(establecimiento){
    this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
    this.uploadImage(establecimiento.image, establecimiento.name ,establecimiento)
  }

  uploadImage = async (imageName, title, establecimiento) => {
    const db = firebase.database()
    var ref = firebase.storage().ref("images/ImageEstablecimiento/"+ title + "/" + imageName).getDownloadURL()
        .then(resolve => { 
         
          establecimiento.imageUri = resolve
          setTimeout(() => { 
            this.setState({
            }, () => {
              this.getComments(establecimiento);
              console.log("resolve")
            });
          }, 1000)
          
        })
        .catch(error => {
          console.log(error)
        }) 
  }

  getComments(establecimiento) {
    var jsonComments = {
      cantidad:0 
    }
    const db2 = firebase.database().ref('Comments')
    db2.orderByChild('idEstablecimiento')
    .equalTo(establecimiento.id)
    .once('value')
    .then((snapshot) => { 
      var value = snapshot.val();
      cantComentarios = 0;
      if (value) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val());
          cantComentarios = cantComentarios + 1; 
        });
        establecimiento.cantidadComentarios = cantComentarios;
      } else {
        establecimiento.cantidadComentarios = 0;
      }
      firebase.database()
      this.setState({ establecimiento: establecimiento });
      this.getScore(establecimiento)
    });

  }

  getScore(establecimiento){
    var jsonComments = {
      averageScore:null,
      id:null 
    }
    var idScore = "" 
    if(establecimiento.score.id == undefined || establecimiento.score.id == null){
      idScore = establecimiento.score
    }else {
      idScore = establecimiento.score.id
    }
    const db2 = firebase.database().ref('Scores')
    db2.orderByChild('id')
    .equalTo(idScore)
    .once('value')
    .then((snapshot) => { 
      var value = snapshot.val();
      score = 0;
      if (value) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val());
          jsonComments.averageScore = child.val().averageScore ; 
          jsonComments.id = child.val().id ; 
        });
        establecimiento.score = jsonComments;
      } else {
        establecimiento.score = jsonComments;
      }
      firebase.database()
      this.setState({ establecimiento: establecimiento });
      this.getProducts(establecimiento)
    });
  }

  getProducts(establecimiento){
    const db3 = firebase.database().ref('Products')
    db3.orderByChild('idEstablecimiento')
    .equalTo(establecimiento.id) 
    .once('value')
    .then( (snapshot) =>{
      var value = snapshot.val();
      var productos = [] 
      cantidadImagenesProductos = 0;
      if (value) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val());
          productos[cantidadImagenesProductos] = child.val()
          cantidadImagenesProductos++
        });
      } else {
      }
      firebase.database()
      establecimiento.products = productos
      this.setState({ establecimiento: establecimiento });
      if(establecimiento.products.length > 0){
        this.getImagenesProductos(productos,establecimiento,cantidadImagenesProductos)
      }else {
        this.setState({
          isModalVisibleSpinner: !this.state.isModalVisibleSpinner
      }, () => {  
            this.props.navigation.navigate('Place',{establecimiento} )
      });
      }
    });
  }

  getImagenesProductos(productos,establecimiento, cantidadImagenesProductos){
    for(i =0 ; i<cantidadImagenesProductos;i++){
      this.uploadImageProductos(productos[i].image, establecimiento, cantidadImagenesProductos)
    }
  }

  uploadImageProductos = async (imageName, establecimiento, cantidadImagenesProductos) => {
    const db = firebase.database()
    var ref = firebase.storage().ref("images/ImageEstablecimiento/"+ establecimiento.name +"/" + "Productos/" + imageName).getDownloadURL()
        .then(resolve => { 
          
                let newArray = [...establecimiento.products];
                for(f =0; f<establecimiento.products.length; f++){
                    var producto = establecimiento.products[f]
                    if(producto != null || producto != undefined ){
                      if(producto.image == imageName){
                        newArray[f].image = resolve
                      }
                    }
                }
                establecimiento.products = newArray
                contador = this.state.cantCall + 1;
                this.setState({
                    cantCall: contador,
                    
                }, () => {  
                    if(this.state.cantCall == cantidadImagenesProductos){
                    this.setState({
                      cantCall: 0,
                      isModalVisibleSpinner: !this.state.isModalVisibleSpinner
                    }, () => {  
                          navigation = this.props.navigation
                          this.props.navigation.navigate('Place',{establecimiento, navigation} )
                    });
                    }
                });
        })
        .catch(error => {
          console.log(error)
        }) 
  }

  render() { 
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
      
        <MapView style={styles.map} 
          region = {{
            latitude:this.state.latitude,
            longitude:this.state.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.1
          }}
          //Muestra ubicacion del usuario
          showsUserLocation={true}
          //Centra el mapa cuando arranca de acuerdo a la ubicacion del usuario
          // followsUserLocation={true}
        >
        {this.state.establecimientos.map((establecimiento) =>
          <MapView.Marker
            coordinate={{
              latitude:establecimiento.latitude, 
              longitude:establecimiento.longitude,
              latitudeDelta: 0.015, 
              longitudeDelta: 0.015
            }}
            key={establecimiento.id}
            title= {establecimiento.name}  
            description={establecimiento.name}
            onPress={() => this.getPlace(establecimiento)}
            // onPress={() => navigation.navigate('Place',{establecimiento} )}
          ></MapView.Marker>
        )}
        </MapView>
        
        <Modal style={styles.containerSpinner} isVisible={this.state.isModalVisibleSpinner}>
                    <View style={styles.contentSpinner}> 
                        <Spinner color='red' />
                    </View>
        </Modal>

      </View>
    ); 
  }
}
