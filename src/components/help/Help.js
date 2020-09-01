import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
const { width } = Dimensions.get("window");
import _ from 'lodash';
import bgImage from '../../assets/fondoDePantalla.jpg'
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.titleStyle}>¿Qué es Tacky?</Text>
                        <Text style={styles.paragraphStyle}>Tacky busca mejorar la calidad de vida de las personas que padecen celiaquía, dándoles información para saber en qué restaurante  pueden sentarse a comer o a qué almacén pueden ir a comprar con plena tranquilidad. A su vez, tenés la posibilidad de calificar y comentar tus experiencias en los establecimientos visitados, de buscar y seleccionar recetas sin TACC, como también la posibilidad de agregar una al recetario.</Text>
                        <Text style={styles.titleStyle}>¿Cómo funcionan las medallas en los establecimientos?</Text>
                        <Image style={{ width: 300, height: 500 }} resizeMethod='scale' source={require('../../assets/medallero.png')} />
                        <Text style={styles.paragraphStyle}>Cada vez que un establecimiento recibe un comentario y una pregunta de la encuesta es respondida con 4 o 5 estrellas, suma 1 punto para ganar la medalla de la categoría correspondiente a esa pregunta. En caso de recibir 3 estrellas o menos, resta 1 punto de dicha categoría.
                            Cada medalla puede presentarse de cuatro maneras diferentes dependiendo de la cantidad de puntos que el establecimiento sume en cada categoría.{'\n'}</Text>
                        <Text style={styles.listTextStyle}>* Si tiene 10 puntos o menos la medalla se mostrará en escala de grises (bloqueada).</Text>
                        <Text style={styles.listTextStyle}>* Si tiene entre 11 y 30 puntos la medalla se mostrará en color bronce.</Text>
                        <Text style={styles.listTextStyle}>* Si tiene entre 31 y 60 puntos la medalla se mostrará en color plata.</Text>
                        <Text style={styles.listTextStyle}>* Si tiene 61 puntos o más la medalla se mostrará en color oro.</Text>
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
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
    },
    paragraphStyle: {
        color: 'white', 
        fontSize: 15,
        textAlign: 'justify',
        paddingHorizontal: 15
    },
    titleStyle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 15,
        paddingBottom: 15
    },
    listTextStyle: {
        color: 'white',
        fontSize: 15,
        textAlign: "justify",
        paddingHorizontal: 15,
        paddingVertical: 5
    }
});