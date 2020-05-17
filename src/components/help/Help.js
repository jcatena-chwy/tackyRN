import React, { Component } from 'react';
import recetas from '../request/recetas.json'
import { Text, SearchBar, View, StyleSheet, Image, Styles, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import firebase from '../../config';
import Modal from "react-native-modal";
import ImageOverlay from "react-native-image-overlay";
import { YellowBox } from 'react-native';
const { width } = Dimensions.get("window");
import _ from 'lodash';
import bgImage from '../../assets/fondoDePantalla.jpg'
YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['Warning']);
YellowBox.ignoreWarnings(['Remote']);
import { Container, Spinner, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button, Icon, Input, Item } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
export default class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
    
  }


  render() {
    return (
      <ImageBackground source={bgImage} source={bgImage} style={styles.containerMain}>
        <View style={{flex: 1}}>
            <ScrollView>
                    <Text style={{color:'white', fontSize:20,  fontWeight: '800'}}>¿Qué es Tacky?</Text>
                    <Text style={{color:'white', fontSize:15}}>Tacky busca mejorar la calidad de personas que padecen celiaquía, dándoles la información para saber en qué restaurante  pueden sentarse a comer, o a qué almacén pueden ir a comprar con plena tranquilidad. A su vez, le da la posibilidad al usuario de calificar y comentar las experiencias en los establecimientos visitados, de buscar y seleccionar recetas sin TACC, como también la posibilidad de agregar una al recetario.</Text>
                    <Text style={{color:'white', fontSize:20,  fontWeight: '800',}}>¿Cómo funcionan las medallas en los establecimientos?</Text>
                    <Image  style={{ width: 400, height: 800 }} source={require('../../assets/medallero.jpeg')} />
                    <Text style={{color:'white', fontSize:15}}>Cada vez que el establecimiento recibe un comentario y una pregunta de la encuesta es respondida con 4 o 5 estrellas, suma 1 punto para ganar la medalla de la categoría correspondiente a esa pregunta. En caso de recibir 3 estrellas o menos, resta 1 punto de dicha categoría.
                            Cada medalla puede presentarse de cuatro maneras diferentes dependiendo de la cantidad de puntos que el establecimiento sume en cada categoria.Si tiene 10 puntos o menos la medalla se mostrará en escalada de grises (bloqueada)
                    </Text>
                    <Text  style={{color:'white', fontSize:15, textAlign:"center"}}>- Si tiene entre 11 y 30 puntos la medalla se mostrará en color bronce.</Text>  
                    <Text  style={{color:'white', fontSize:15, textAlign:"center"}}>- Si tiene entre 31 y 60 puntos la medalla se mostrará en color plata.</Text>  
                    <Text  style={{color:'white', fontSize:15, textAlign:"center"}}>- Si tiene 61 puntos o más la medalla se mostrará en color oro.</Text>  
                            
                            
                            
            </ScrollView>
        </View>
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
});