import React, { Component } from 'react';
import { Image, View, ScrollView, Text, StyleSheet } from 'react-native';
import { Container, Card, Button, Item, Accordion } from 'native-base';
import { createStackNavigator } from 'react-navigation';
import ImageOverlay from "react-native-image-overlay";
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import firebase from '../../../config';
const imag = ''
const dataArray = [
    { title: "Horarios", content: "Lorem ipsum dolor sit amet" },
    { title: "Telefono", content: "Lorem ipsum dolor sit amet" },
];

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['source.uri should']);

export default class Detalle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widthStyle: 360,
            isModalVisible: false,
            spinner: false,
            score: this.props.score,
            phone: this.props.phone,
            schedule: this.props.schedule,
            medallas: [
                { "imagen": "", descripcion: "Buena Comida" },
                { "imagen": "", descripcion: "Limpio Limpio" },
                { "imagen": "", descripcion: "Alta Atención" },
                { "imagen": "", descripcion: "Buen Billete" },
            ],
            dataArray: [
                { title: "Horarios", content: "" },
                { title: "Telefono", content: "" },
            ]
        }
        this.showModal = this.showModal.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setImageFood = this.setImageFood.bind(this);
        this.setImageCleaning = this.setImageCleaning.bind(this);
        this.setImagePrice = this.setImagePrice.bind(this);
        this.setImageService = this.setImageService.bind(this);
        this.setInformacion = this.setInformacion.bind(this);
    }

    componentWillMount() {
        this.showModal()
    }


    setImage(score) {
        let newArray = [...this.state.medallas];
        newArray[0].imagen = this.setImageFood(score.foodScore)
        newArray[1].imagen = this.setImageCleaning(score.cleaningScore)
        newArray[2].imagen = this.setImageService(score.serviceScore)
        newArray[3].imagen = this.setImagePrice(score.priceScore)
        this.setState({ medallas: newArray });
    }

    setImageFood(foodScore) {
        if (foodScore <= 10) {
            return imagen = require('../../../assets/medallero/gris/ComidaGris.png')
        }
        if (foodScore > 10 && foodScore <= 30) {
            return imagen = require('../../../assets/medallero/bronce/ComidaBronce.png')
        }
        if (foodScore > 30 && foodScore <= 60) {
            return imagen = require('../../../assets/medallero/plata/ComidaPlata.png')
        }
        if (foodScore > 60) {
            return imagen = require('../../../assets/medallero/oro/ComidaOro.png')
        }
    }
    setImageCleaning(cleaningScore) {
        if (cleaningScore <= 10) {
            return imagen = require('../../../assets/medallero/gris/LimpiezaGris.png')
        }
        if (cleaningScore > 10 && cleaningScore <= 30) {
            return imagen = require('../../../assets/medallero/bronce/LimpiezaBronce.png')
        }
        if (cleaningScore > 30 && cleaningScore <= 60) {
            return imagen = require('../../../assets/medallero/plata/LimpiezaPlata.png')
        }
        if (cleaningScore > 60) {
            return imagen = require('../../../assets/medallero/oro/LimpiezaOro.png')
        }
    }
    setImagePrice(priceScore) {
        if (priceScore <= 10) {
            return imagen = require('../../../assets/medallero/gris/PrecioGris.png')
        }
        if (priceScore > 10 && priceScore <= 30) {
            return imagen = require('../../../assets/medallero/bronce/PrecioBronce.png')
        }
        if (priceScore > 30 && priceScore <= 60) {
            return imagen = require('../../../assets/medallero/plata/PrecioPlata.png')
        }
        if (priceScore > 60) {
            return imagen = require('../../../assets/medallero/oro/PrecioOro.png')
        }
    }
    setImageService(serviceScore) {
        if (serviceScore <= 10) {
            return imagen = require('../../../assets/medallero/gris/ServicioGris.png')
        }
        if (serviceScore > 10 && serviceScore <= 30) {
            return imagen = require('../../../assets/medallero/bronce/ServicioBronce.png')
        }
        if (serviceScore > 30 && serviceScore <= 60) {
            return imagen = require('../../../assets/medallero/plata/ServicioPlata.png')
        }
        if (serviceScore > 60) {
            return imagen = require('../../../assets/medallero/oro/ServicioOro.png')
        }
    }

    showModal() {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            spinner: !this.state.spinner
        }, () => {
            this.props
            const db2 = firebase.database().ref('Scores')
            db2.orderByChild('id')
                .equalTo(this.state.score.id)
                .once('value')
                .then((snapshot) => {
                    var value = snapshot.val();
                    if (value) {
                        snapshot.forEach((child) => {
                            console.log(child.key, child.val());
                            this.setImage(child.val())
                        });
                    } else {
                    }
                    this.setInformacion()
                    this.setState({ spinner: !this.state.spinner });
                });
        });
    }

    setInformacion() {
        schedule = ""
        for (var key in this.state.schedule) {
            var obj = this.state.schedule[key];
            schedule = schedule + obj.Dia + ":" + obj.Horario + "\n"
        }

        const dataArray = [
            { title: "Horarios", content: schedule },
            { title: "Telefono", content: this.state.phone },
        ];
        this.setState({ dataArray: dataArray });
    }

    toggleModal = () => {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        })
    }


    render() {
        const navigation = this.props.navigation;
        return (
            <View style={styles.content}>
                <Text style={styles.titleText}>
                    Medallas{'\n'}{'\n'}
                </Text>
                <ScrollView
                    contentContainerStyle={{ justifyContent: 'center' }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ bottom: 40, height: 80 }}
                >
                    <View style={styles.badgeContainer}>
                        {this.state.medallas.slice(0, 2).map((medalla, index) =>
                            <Item key={index} style={{ borderBottomColor: '#e97463' }}>
                                <View>
                                    <Image style={{ width: 90, height: 110 }} source={medalla.imagen}/>
                                    <Text style={{ color: 'white', fontSize: 17 }}>{medalla.descripcion}</Text>
                                </View>
                            </Item>
                        )}
                    </View>
                    <View style={styles.badgeContainer}>
                        {this.state.medallas.slice(2, 4).map((medalla, index) =>
                            <Item key={index} style={{ borderBottomColor: '#e97463' }}>
                                <View>
                                    <Image style={{ width: 90, height: 110 }} source={medalla.imagen}/>
                                    <Text style={{ color: 'white', fontSize: 17 }}>{medalla.descripcion}</Text>
                                </View>
                            </Item>
                        )}
                    </View>
                    <Accordion style={{paddingTop: 15}} headerStyle={{backgroundColor: '#c94c38'}} contentStyle={{backgroundColor: 'white'}} dataArray={this.state.dataArray}/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 10,
        width: 350,
        height: 350
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
        backgroundColor: '#e97463',
        padding: 22,
        borderRadius: 4,
        width: 330,
        height: 550,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    baseText: {
        marginVertical: 5,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    badgeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 150,
        paddingTop: 15
    }
});
