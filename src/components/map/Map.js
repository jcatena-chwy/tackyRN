import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import styles from "./MapComponentStyles";
import restaurantes from '../request/restaurantes.json'

import Footer from '../footer/Footer'
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
      restaurantes: restaurantes
    }
  }

  // componentDidMount() {
  //   // Guarda la posicion en todo momento, a
  //   this.watchId = navigator.geolocation.watchPosition(
  //     (position) => {
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         error: null,
  //       });
  //     },
  //     (error) => this.setState({ error: error.message }),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
  //   );
  // }
  
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
        {this.state.restaurantes.restaurantes.map((restaurante) =>
          <MapView.Marker
            coordinate={{
              latitude:restaurante.latitude, 
              longitude:restaurante.longitude,
              latitudeDelta: 0.015, 
              longitudeDelta: 0.015
            }}
            key={restaurante.id}
            title= {restaurante.title}  
            description={restaurante.description}
            onPress={() => navigation.navigate('Place',{restaurante} )}
          ></MapView.Marker>
        )}
        </MapView>
        <Footer navigate = {this.props.navigation}></Footer>
      </View>
    ); 
  }
}
