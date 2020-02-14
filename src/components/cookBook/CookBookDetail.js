import React, { Component } from 'react';
import recetas from '../request/recetas.json'
import { Text,TextInput,TouchableHighlight, View, StyleSheet, Image, Styles, ImageBackground, Dimensions, ScrollView} from 'react-native';
import { Card, CardItem} from 'native-base';
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
export default class CookBookDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            image: null,
            textoImagen:false,
            isModalVisible: false,
            textInput:"",
            stepsImage:[],
            cantPhotos:0,
            cantCall:0,
            receta: this.props.navigation.state.params.receta
        }
        this.cargarReceta = this.cargarReceta.bind(this);
    }
    componentWillMount() { 
        this.state
        this.setState({ 
            isModalVisibleSpinner: !this.state.isModalVisibleSpinner 
        }, () => {
            this.cargarReceta()
        });
    }
     
    cargarReceta(){
        debugger
        console.log("La receta es: " + this.state.receta)
        for(var key in this.state.receta.ingredients){ 
            var obj = this.state.receta.ingredients[key];
            this.state.textInput = this.state.textInput + obj.description + "\n"
        }
        var steps = []
        var stepImage = []
        var cantPhotos = 0;
        var jsonStep={
            description:{},
            photos:[]
        }
        i = 0;
        j= 0; 
        for(var key in this.state.receta.steps){ 
            var step = this.state.receta.steps[key];
            if(step.description != null && step.description != "" ){
                jsonStep.description = step.description
            }
            for(var key in step.photos){
                var photo = step.photos[key];
                if(photo.flag){
                    jsonStep.photos[j] = photo
                    cantPhotos = cantPhotos + 1;
                }
                j++
            }
            steps[i] = jsonStep;
            i++
            j=0;
            jsonStep={
                description:{},
                photos:[]
            }
        } 
        this.state.receta
        this.setState({ stepsImage: steps,cantPhotos:cantPhotos});
          setTimeout(() => {
              var arrayPhotos =  this.state.stepsImage;
              for(f =0; f<this.state.stepsImage.length; f++){
                var arrayPositionPhotos = this.state.stepsImage[f]    
                for(i =0; i<arrayPositionPhotos.photos.length; i++){ 
                  this.uploadImage(arrayPositionPhotos.photos[i].name)
                }
              }
               
          }, 100)
    }

    uploadImage = async (imageName) => {
        var ref = firebase.storage().ref("images/ImageRecipe/"+ imageName).getDownloadURL()
            .then(resolve => { 
                console.log(imageName)
                let newArray = [...this.state.stepsImage];
                for(f =0; f<this.state.stepsImage.length; f++){
                    var arrayPositionPhotos = this.state.stepsImage[f]    
                    for(i =0; i<arrayPositionPhotos.photos.length; i++){ 
                      if(arrayPositionPhotos.photos[i].name == imageName){
                        newArray[f].photos[i].image = resolve
                      }
                    } 
                }
                var modifyRecipe = this.state.receta
                modifyRecipe.steps = newArray
                contador = this.state.cantCall + 1;
                this.setState({ 
                    receta: modifyRecipe,
                    cantCall: contador
                }, () => {
                    if(this.state.cantCall == this.state.cantPhotos){
                        this.setState({ 
                            stepsImage:newArray
                        }, () => {
                                contador = 0;
                                let newArray = [...this.state.stepsImage];
                                while(contador < this.state.stepsImage.length){
                                    newArray[contador].orden = contador + 1;
                                    contador++
                                }
                                var modifyRecipe = this.state.receta
                                modifyRecipe.steps = newArray
                                this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner, stepsImage:newArray });
                        });
                    }
                });
            })
            .catch(error => {
              console.log(error)
            }) 
      }

    render() { 
        return (
        <Container> 
            <ScrollView>
            <Image source={{ uri:this.state.receta.imageName }} style={{ width: '100%', height: 350}} />
            <Text style={{fontSize:20,  fontWeight: 'bold', left:6}}>{this.state.receta.title}</Text>
                
            <Text style={{left:6}}>Ingredientes</Text>
            <View style={styles.textAreaContainer} >
                <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                value={this.state.textInput}
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                /> 
            </View>

 
            <Text style={{ fontSize: 20,bottom:10, marginTop:5}}>Pasos</Text>
            <TextInput style={{textAlign: 'right', fontSize: 15, bottom:10}} placeholder='Tiempo'></TextInput>


            {this.state.stepsImage.map((step) =>
            <Card key={step.orden}  style={{ width:350 }}>
              <CardItem  style={{ height:50 }} header > 
              <TouchableHighlight
                style = {{
                borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                width: Dimensions.get('window').width * 0.09,
                height: Dimensions.get('window').width * 0.09,
                backgroundColor:'red',
                justifyContent: 'center',
                alignItems: 'center'
                }} 
                underlayColor = '#ccc'
                // onPress = { () => alert('Yaay!') }
              >
              <Text  style={{color:'white'}}>{step.orden}</Text>
              </TouchableHighlight>
              
              <TextInput value={step.description} style={{ fontSize: 17}} />

              </CardItem>
            <CardItem style={{alignItems: 'center', flex: 1,justifyContent: 'center'}} >
              <Content>
                  <ScrollView 
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    >
                    {step.photos.map((photo) =>
                    <Item key={photo.photo} >
                        <TouchableHighlight >
                          <Image
                              source={{ uri: photo.image }}
                              style={{ width: 80, height: 80, right:5 }} 
                          />
                        </TouchableHighlight>
                    </Item>
                    )}  
                  </ScrollView>
                  </Content>
            </CardItem>
            </Card>
            )} 




            <Modal style={styles.container} isVisible={this.state.isModalVisibleSpinner} >
                <View style={styles.content}> 
                    <Spinner color='red' />
                </View>
            </Modal> 

        </ScrollView>
         
            
            
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
      height:200,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
      fontSize: 20,
      marginBottom: 12,
    },
    textAreaContainer: {
        left:6,
        borderColor: 'grey',
        borderWidth: 1,
        padding: 5,
        width:'70%',
        borderRadius:7
      },
      textArea: {
        height: 150,
        justifyContent: "flex-start"
      }
  });