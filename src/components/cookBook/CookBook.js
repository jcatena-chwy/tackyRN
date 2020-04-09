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
export default class CookBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plate: [],
      data: [],
      dataBackup: [],
      isModalVisibleSpinner: false,
      contenido: false,
      recetas: [],
      imagenesRecetas: [],
      posicion: 0,
      isModalVisibleSpinner: false,
      copiaRecetas: [],
      widthStyle: 30,
      nuevaReceta: this.props.navigation ? this.props.navigation : ""
    }
    this.guidGenerator = this.guidGenerator.bind(this);
    this.filtrarLista = this.filtrarLista.bind(this);
    this.cargarLista = this.cargarLista.bind(this);
  }


  componentWillReceiveProps() {
    setTimeout(() => {
      this.setState({
        posicion: 0
      }, () => {
        this.cargarLista();
      });
    }, 1000)
  }
  componentWillMount() {
    this.cargarLista();
  }

  cargarLista() {
    this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
    const db = firebase.database()
    db.ref('Recipes').once('value', (data) => {
      var recetas = []
      var jsonRecetas = []
      jsonRecetas = data.toJSON()
      i = 0;
      for (var key in jsonRecetas) {
        var obj = jsonRecetas[key];
        obj.id = jsonRecetas[key].id
        obj.ingredients = jsonRecetas[key].ingredients
        obj.mainImage = jsonRecetas[key].mainImage
        obj.steps = jsonRecetas[key].steps
        obj.title = jsonRecetas[key].title
        obj.time = jsonRecetas[key].time
        recetas[i] = obj
        i = i + 1;
      }
      this.setState({ recetas: recetas });
      setTimeout(() => {
        for (f = 0; f < recetas.length; f++) {
          this.uploadImage(recetas[f].mainImage, recetas[f].title)
        }

      }, 100)
    })
  }

  uploadImage = async (imageName, title) => {
    var ref = firebase.storage().ref("images/ImageRecipe/" + title + "/" + imageName).getDownloadURL()
      .then(resolve => {
        let newArray = [...this.state.recetas];
        var cantCall = this.state.posicion;
        for (i = 0; i < this.state.recetas.length; i++) {
          if (this.state.recetas[i].mainImage == imageName) {
            newArray[i].imageName = resolve
            cantCall = cantCall + 1
          }
        }
        this.setState({
          recetas: newArray, posicion: cantCall
        }, () => {
          if (this.state.recetas.length == this.state.posicion) {
            var arrayRecetas = []
            var a = 0;
            for (var key in this.state.recetas) {
              var obj = this.state.recetas[key];
              obj.id = this.state.recetas[key].id
              obj.ingredients = this.state.recetas[key].ingredients
              obj.mainImage = this.state.recetas[key].mainImage
              obj.imageName = this.state.recetas[key].imageName
              obj.steps = this.state.recetas[key].steps
              obj.title = this.state.recetas[key].title
              arrayRecetas[a] = obj
              a = a + 1;
            }
            for (f = 0; f < arrayRecetas.length; f++) {
              var listaIngredientes = arrayRecetas[f].ingredients;
              var cantidad = 0;
              for (var key in listaIngredientes) {
                cantidad++
              }
              arrayRecetas[f].ingredients.cantidad = cantidad;
            }
            this.setState({
              receta: arrayRecetas,
              copiaRecetas: arrayRecetas,
              isModalVisibleSpinner: !this.state.isModalVisibleSpinner
            })
          }
        });
      })
      .catch(error => {
        console.log(error)
      })
  }

  guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  filtrarLista = (nombre) => {
    texto = nombre.nativeEvent.text.toLowerCase();
    if (texto != "") {
      var recetas = this.state.copiaRecetas.filter(function (receta) {
        return receta.title.toLowerCase().match(texto)
      });
      this.setState({
        recetas
      });  
    } else {
      var copiaRecetas = this.state.copiaRecetas
      this.setState({
        recetas: copiaRecetas
      });
    }
  }
  render() {
    const navigation = this.props.navigation;
    const {
      blurRadius,
      children,
      containerStyle,
      contentPosition,
      height,
      overlayAlpha,
      overlayColor,
      rounded,
      source,
      title,
      titleStyle,
      ...props
    } = this.props;
    let justifyContent;
    if (contentPosition == "top") {
      justifyContent = "flex-start";
    } else if (contentPosition == "bottom") {
      justifyContent = "flex-end";
    } else if (contentPosition == "center") {
      justifyContent = "center";
    }
    return (
      <ImageBackground source={bgImage} source={bgImage} style={styles.containerMain}>
        <View isVisible={this.state.contenido} style={styles.containerMain}>
          <View style={styles.containerSection1}>
            <View style={styles.containerSearchReceta}>
              <Input style={{
                fontSize: 14, textAlign: 'center',
                fontWeight: 'bold',
                fontstyle: 'italic'
              }} placeholder='Buscá productos por nombre' placeholderTextColor='#a2a2a2' onChange={text => this.filtrarLista(text)} />
              <Icon style={{ color: 'white', marginRight: 30 }} name="search" />
            </View>
          </View>
          <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          >
            {this.state.recetas.map((receta) =>
              <View showsHorizontalScrollIndicator={false} key={receta.id} style={styles.containerSecundary}>
                <ImageBackground source={bgImage} style={styles.containerThrid}>
                  <Image source={{ uri: receta.imageName }} style={styles.image} />
                </ImageBackground>
                <ImageBackground source={bgImage} style={styles.containerText}>
                  <Text style={styles.titleText}>{receta.title}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {receta.ingredients.cantidad != undefined && <Text style={{ color: 'white', fontSize: 10 }}>{receta.time + " "}</Text>}
                    {receta.ingredients.cantidad != undefined && <Icon style={{ color: 'white', fontSize: 10 }} name="time" />}
                    {receta.ingredients.cantidad != undefined && <Text style={{ color: 'white', fontSize: 10 }}>{"   " + receta.ingredients.cantidad + " Ingredientes"}</Text>}
                  </View>
                </ImageBackground>
                <ImageBackground source={bgImage} style={styles.containerVer}>
                  <TouchableOpacity onPress={() => navigation.navigate('CookBookDetail', { receta })} style={styles.btnVer}>
                    <Text onPress={() => navigation.navigate('CookBookDetail', { receta })} style={styles.titleText}>Ver</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </View> 
            )}
          </ScrollView>
          <View style={styles.containerSection2}>
            <View style={styles.containerAddRecetaDetalle}>
              <Icon style={{ color: 'white' }} onPress={() => navigation.navigate('DetalleReceta')} active name="ios-add" />
              <Text style={styles.textAddReceta} onPress={() => navigation.navigate('DetalleReceta')} >Agrega tu Receta </Text>
            </View>
          </View>
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
  containerSecundary: {
    backgroundColor: '#ea8073',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 250,
    height: 250,
  },
  containerThrid: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 30,
    width: 180,
    height: 180,
    overflow: "hidden",
  },
  containerText: {
    backgroundColor: 'red',
    width: 130,
    height: 40,
  },
  containerVer: {
    borderRadius: 20,
    overflow: "hidden",
    borderColor: 'white',
    borderWidth: 3
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
    alignItems: "center"
  },
  btnVer: {
    width: 50,
    overflow: "hidden",
    borderRadius: 20,
  },
  containerSection1: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    width: 350,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
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
  containerSearchReceta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
  },
  textAddReceta: {
    marginLeft: 5,
    color: 'white'
  },
  titleText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  }
});