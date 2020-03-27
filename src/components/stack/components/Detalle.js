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


  setImage(score) {
    let newArray = [...this.state.medallas];
    newArray[0].imagen = this.setImageFood(score.foodScore)
    newArray[1].imagen = this.setImageCleaning(score.cleaningScore)
    newArray[2].imagen = this.setImagePrice(score.priceScore)
    newArray[3].imagen = this.setImageService(score.serviceScore)
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
      return imagen =require('../../../assets/medallero/gris/PrecioGris.png')
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
      <Container>
        <View style={{ flexDirection: 'row', color: '#ccc9bc', left: 50 }}>
          <View>
            <Image
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/tesis-celiacos.appspot.com/o/images%2FImageMedallas%2Fmedalla.png?alt=media&token=b52f7874-4582-45fd-9d3a-c0069836ae92' }}
              style={{ width: 80, height: 80, right: 5 }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 10 }}>
            <Button onPress={() => this.showModal()} transparent textStyle={{ color: '#87838B' }}>
              {/* <Icon name="info-circle" /> */}
              <Ionicons style={{ fontSize: 28 }} name="ios-information-circle-outline"></Ionicons>
            </Button>
            <Text onPress={() => this.showModal()} style={{ fontSize: 18, top: 8, color: 'black', left: 5 }}>Medallas {"\n"}y más información</Text>
          </View>
        </View>

        <Modal style={styles.container} isVisible={this.state.isModalVisible}>
          <View style={styles.content}>

            <Text style={styles.baseText}>
              <Text style={styles.titleText}>
                Medallas{'\n'}{'\n'}
              </Text>
            </Text>

            <ScrollView
              contentContainerStyle={{  justifyContent: 'center' }}
              showsHorizontalScrollIndicator={false}
              style={{ bottom: 40, height:80 }}
            >
                {this.state.medallas.map((medalla, index) =>
                  <Item key={index} style={{ height: 80 }}  >
                    {/* <Image
                                    source={{ uri: medalla.imagen }}
                                    style={{ width: 80, height: 50, right:5 }}
                                /> */}
                    <Image style={{ width: 50, height: 60 }} source={medalla.imagen} />
                    <Text>{medalla.descripcion}</Text>
                  </Item>
                )}
            <Accordion dataArray={this.state.dataArray} expanded={0}  />
            </ScrollView>
            {!this.state.spinner && <Button danger style={{ width: 90, }} onPress={this.toggleModal}><Text style={{ fontSize: 20, color: "white", left: 8 }}>Cerrar</Text></Button>}
          </View>
        </Modal>

      </Container>
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
    backgroundColor: 'white',
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
  },
});
