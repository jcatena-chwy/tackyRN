import React, { Component } from 'react';
import { TextInput,Text,TouchableHighlight, View, StyleSheet, Image, Dimensions, ScrollView} from 'react-native';
import { Card, CardItem} from 'native-base';
import firebase from '../../config';
import Modal from "react-native-modal";
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
            viewImage:false,
            imagenSeleccionada:"",
            receta: this.props.navigation.state.params.receta
        }
        this.cargarReceta = this.cargarReceta.bind(this);
        this.isLongString = this.isLongString.bind(this);
        this.visualizarFoto = this.visualizarFoto.bind(this);
        this.toggleModal = this.toggleModal.bind(this)
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
                jsonStep.Isdescription = true
                jsonStep.description = step.description
            }else {
              jsonStep.Isdescription = false
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
              debugger
              for(f =0; f<this.state.stepsImage.length; f++){
                var arrayPositionPhotos = this.state.stepsImage[f]
                for(i =0; i<arrayPositionPhotos.photos.length; i++){
                  if(arrayPositionPhotos.photos[i] != null || arrayPositionPhotos.photos[i] != undefined )
                    this.uploadImage(arrayPositionPhotos.photos[i].name, this.state.receta.title)
                }
              }

          }, 100)
    }

    isLongString(string){
      var str = string;
      var res = str.split(" ");
      maxStringForRow = ""
      stringFinished = []
      cant = 0
      stringFinished[0] = res[0]
      for(i =1 ; i<res.length ; i++){
        maxStringForRow = res[i]
        if((stringFinished[cant].length + maxStringForRow.length) > 20) {
          cant++
          stringFinished[cant] = maxStringForRow
        }else {
          stringFinished[cant] = stringFinished[cant] + maxStringForRow
        }
      }
      return res
    }

    uploadImage = async (imageName, title) => { 
        var ref = firebase.storage().ref("images/ImageRecipe/" + title + "/"+ "Steps" + "/" + imageName).getDownloadURL()
            .then(resolve => {
                console.log(imageName)
                let newArray = [...this.state.stepsImage];
                for(f =0; f<this.state.stepsImage.length; f++){
                    var arrayPositionPhotos = this.state.stepsImage[f]
                    for(i =0; i<arrayPositionPhotos.photos.length; i++){
                      if(arrayPositionPhotos.photos[i] != null || arrayPositionPhotos.photos[i] != undefined ){
                        if(arrayPositionPhotos.photos[i].name == imageName){
                          newArray[f].photos[i].image = resolve
                        }
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

    visualizarFoto(photo){
      this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner, viewImage:true, imagenSeleccionada:photo.image });
    }
    toggleModal(){
      this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner, viewImage:false, imagenSeleccionada:"" });
    }

    render() {
        return (
        <Container style={{ left:10}}>
            <ScrollView>
            <Image source={{ uri:this.state.receta.imageName }} style={{ width: '100%', height: 350}} />
            <Text style={{fontSize:30,  fontWeight: 'bold', left:6, textAlign:'center', color:'#97bc00'}}>{this.state.receta.title}</Text>

            <Text style={{fontSize: 20,left:6, color:'#ccc9bc'}}>Ingredientes</Text>
            <View style={styles.textAreaContainer} >
                <TextInput
                textAlignVertical="top"
                style={styles.textArea}
                underlineColorAndroid="transparent"
                value={this.state.textInput} 
                placeholderTextColor="grey" 
                numberOfLines={10}
                multiline={true}    
                />  
            </View> 


            <Text style={{ fontSize: 20,bottom:10, marginTop:10, color:'#ccc9bc'}}>Pasos</Text>
             {this.state.receta.time != ""&&<View style={{flexDirection: 'row',color:'#ccc9bc'}}><Text style={{fontSize: 20,left:6,color:'#ccc9bc'}}>Tiempo: </Text><Text style={{fontSize: 15,left:6, top:5}}>{this.state.receta.time}</Text><Icon active name='time' style={{ fontSize: 15, left:12, top:3 }}/></View>}

            {this.state.stepsImage.map((step, index) =>
            <Card key={index}  style={{ width:350, borderColor:"black"  }}>
              <CardItem  style={{ height:100 }} header >
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

              {/* <TextInput value={step.description} style={{ fontSize: 17}} /> */}
              {step.Isdescription!="" &&<View style={styles.textAreaContainerSteps} >
                <TextInput
                textAlignVertical="top"
                style={styles.textAreaSteps}
                underlineColorAndroid="transparent"
                value={step.description}
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                />
            </View>}
          </CardItem>

          {step.Isdescription ? (
              <CardItem style={{alignItems: 'center', flex: 1,justifyContent: 'center', borderColor:'#ccc9bc'}} >
              <Content>
                  <ScrollView
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    >
                    {step.photos.map((photo) =>
                    <Item key={photo.photo} >
                        <TouchableHighlight onPress={() => this.visualizarFoto(photo)} >
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
            ) : (
              <CardItem style={{alignItems: 'center', flex: 1,justifyContent: 'center', borderColor:'#ccc9bc'}} >
              <Content style={{ bottom:50}}>
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
            )}
            </Card>
            )}




            <Modal style={styles.container} isVisible={this.state.isModalVisibleSpinner} >
               {!this.state.viewImage &&<View style={styles.content}>
                    <Spinner color='red' />
                </View>}
                {/* {this.state.viewImage &&<View style={styles.content}> >
                {this.state.viewImage && <Text style={{ fontSize: 20}}>ver foto</Text>}
                {this.state.viewImage && <Button danger style={{ width:90, }} onPress={this.toggleModal}><Text style={{ fontSize: 20, color:"white", left:4}}>Cerrar</Text></Button>}
                    </View>} */}
                {this.state.viewImage &&<View style={styles.content}><Image source={{ uri: this.state.imagenSeleccionada }} style={{ width: 200, height: 200,marginTop:10 }}></Image><Button danger style={{ width:90, top:5 }} onPress={this.toggleModal}><Text style={{ fontSize: 20, color:"white", left:4}}>Cerrar</Text></Button></View>}          
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
      height:300,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
      fontSize: 20,
      marginBottom: 12, 
    },
    textAreaContainer: {
        left:6,
        borderColor:'#ccc9bc',
        borderWidth: 1,
        padding: 5,
        width:'90%',
        borderRadius:7,
        marginBottom:10,
        marginTop:10
      },
      textArea: {
        height: 150,
        justifyContent: "flex-start"
      },
      textAreaContainerSteps: {
        left:6,
        borderColor:'#ccc9bc',
        borderWidth: 1,
        padding: 5,
        width:'90%',
        borderRadius:7
      },
      textAreaSteps: {
        height: 80,
        // justifyContent: "flex-start"
      }
  });