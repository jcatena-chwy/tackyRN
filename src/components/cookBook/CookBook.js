import React, { Component } from 'react';
import recetas from '../request/recetas.json'
import { Text,SearchBar, View, StyleSheet, Image, Styles, ImageBackground, Dimensions} from 'react-native';
import firebase from '../../config';
import Modal from "react-native-modal";
import ImageOverlay from "react-native-image-overlay";
import { YellowBox } from 'react-native';
const { width } = Dimensions.get("window");
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['Warning']);
YellowBox.ignoreWarnings(['Remote']);
import { Container, Spinner, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button,Icon,Input, Item } from 'native-base';
export default class CookBook extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          plate:[], 
          data: [],
          dataBackup  : [],
          isModalVisibleSpinner: false,
          contenido: false,
          recetas: [],
          imagenesRecetas:[],
          posicion: 0,
          isModalVisibleSpinner: false,
          copiaRecetas: [],
          nuevaReceta: this.props.navigation ? this.props.navigation : ""
        }
        this.guidGenerator = this.guidGenerator.bind(this);
        this.filtrarLista = this.filtrarLista.bind(this);
        this.cargarLista = this.cargarLista.bind(this);
    }


    componentWillReceiveProps(){
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

    cargarLista(){
      this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
      const db = firebase.database()
      db.ref('Recipes').once('value', (data) =>{
          var recetas = []
          var jsonRecetas = []
          jsonRecetas = data.toJSON()
          i = 0; 
          for(var key in jsonRecetas){ 
              var obj = jsonRecetas[key]; 
              obj.id = jsonRecetas[key].id
              obj.ingredients = jsonRecetas[key].ingredients
              obj.mainImage = jsonRecetas[key].mainImage
              obj.steps = jsonRecetas[key].steps
              obj.title = jsonRecetas[key].title
              obj.time = jsonRecetas[key].time
              recetas[i] = obj
              i = i +1; 
          }
          this.setState({ recetas: recetas});
          setTimeout(() => { 
              for(f =0; f<recetas.length; f++){ 
                  this.uploadImage(recetas[f].mainImage , recetas[f].title )
              }
              
          }, 100)
      })
    }
   
    uploadImage = async (imageName, title) => {
     var ref = firebase.storage().ref("images/ImageRecipe/"+ title + "/" + imageName).getDownloadURL()
         .then(resolve => { 
            let newArray = [...this.state.recetas];
            var cantCall = this.state.posicion;
            for(i =0 ; i<this.state.recetas.length ; i++){
              if(this.state.recetas[i].mainImage == imageName){
                newArray[i].imageName = resolve
                cantCall = cantCall + 1    
              }
            }
            this.setState({
                recetas: newArray, posicion: cantCall
            }, () => {
                if(this.state.recetas.length == this.state.posicion){
                    var arrayRecetas = []
                    for(var key in this.state.recetas){ 
                        var obj = this.state.recetas[key];
                        obj.id = this.state.recetas[key].id
                        obj.ingredients = this.state.recetas[key].ingredients
                        obj.mainImage = this.state.recetas[key].mainImage
                        obj.imageName = this.state.recetas[key].imageName
                        obj.steps = this.state.recetas[key].steps
                        obj.title = this.state.recetas[key].title
                        arrayRecetas[i] = obj
                        i = i +1;  
                    } 
                        this.setState({  
                            receta : arrayRecetas,
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
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
     
    filtrarLista = (nombre) => {
        texto = nombre.nativeEvent.text.toLowerCase();
        if(texto!= ""){
            var recetas = this.state.recetas.filter(function (receta) {
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
        <Container> 
            <Content isVisible={this.state.contenido}>
             <Item>
                <Input placeholder='Buscá productos por nombre' onChange={text => this.filtrarLista(text)}/>
                <Button  onPress={this.filtrarLista}>
                    <Icon name="search"/>
                </Button>
                </Item> 
           
            <List> 
            {this.state.recetas.map((receta) =>
                <ListItem key={receta.id} thumbnail>
              
              <Body style={{width:20}}>
              <ImageOverlay source={{ uri: receta.imageName }}  
    contentPosition="bottom" titleStyle={{ color: 'yellow', fontWeight: 'bold'}}>
                    <View>
                        <Image style={styles.avatar} source={{uri:"http://example.com/user/avatar.png"}} />
                        <Text style={{fontSize:20, color: 'yellow', fontWeight: 'bold', textAlign:'center', marginBottom:50}}>{receta.title}</Text>
                        <Button success style={{borderRadius: 64, width:100, marginBottom:5}} onPress={() => navigation.navigate('CookBookDetail',{receta} )}>
                            <Text style={{color: 'white', fontWeight: 'bold', left:35, fontSize:20}} >Ver</Text>
                        </Button>
                    </View>
                </ImageOverlay>
                </Body>
                </ListItem> 
            )}
            </List>
            </Content>
            
                <Button full primary onPress={() => navigation.navigate('DetalleReceta')}>
                    <Icon active name="ios-add-circle" />
                    <Text>Agrega tu Receta</Text>
                </Button>
            
                <Modal style={styles.container} isVisible={this.state.isModalVisibleSpinner}>
                    <View style={styles.contentSpinner}> 
                        <Spinner color='red' />
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
      shadowRadius:10,
      width: 350, 
      height:280
    },
    containerBody: {
      flex: 1,
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
      backgroundColor:'tomato'
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
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      width:330,
      height:400,
      borderColor: 'rgba(0, 0, 0, 0.1)',
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
    contentTitle: {
      fontSize: 20,
      marginBottom: 12,
    },
    textStyle: {
      fontSize: 20,
      fontWeight:'bold',
      color:'white',
      fontStyle:'italic'
    },image: {
        width: 300,
        height:100,
        overflow: "hidden",
        alignItems: "center"
      },
      title: {
        margin: 20,
        color: "white",
        textAlign: "center",
        fontSize: 16
      }
  });