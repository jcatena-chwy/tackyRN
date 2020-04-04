import * as React from 'react';
import {
  Text
} from 'react-native';
import { Image, View, Platform, StyleSheet } from 'react-native';
import { Button} from 'native-base';


import {Icon, Spinner } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import firebase from '../../../config';
import Modal from "react-native-modal";
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);


export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    textoImagen:false,
    isModalVisible: false,
    isTituloReceta:false
  }; 

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {!image && <Icon active name='image' onPress={this._pickImage} style={{ fontSize: 80 }}/>}
        {!image && <Text style={{ fontSize: 20}}>Publicar foto del Plato Terminado</Text>}
        { image && <Image source={{ uri: image }} style={{ width: 200, height: 200,marginTop:10 }} />}
        <Modal style={styles.container} isVisible={this.state.isModalVisible}>
          <View style={styles.content}> 
            {this.state.isTituloReceta && <Spinner color='red' />}
            {!this.state.isTituloReceta && <Text style={{ fontSize: 20}}>Por favor, complete el titulo de la receta  👋!</Text>}
            {!this.state.isTituloReceta && <Button danger style={{ width:90, }} onPress={this.toggleModal}><Text style={{ fontSize: 20, color:"white", left:4}}>Cerrar</Text></Button>}

          </View>
        </Modal>
      </View>
    ); 
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  toggleModal= () =>{
    this.setState({
      isModalVisible: !this.state.isModalVisible 
    })
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  isImageMain(uri){
    let name = Math.random().toString(36).substring(7);
    this.uploadImage(uri,name).then((responseData) => {
      console.log("La data es: " + responseData)
      this.setState({ isModalVisible: !this.state.isModalVisible});
      this.props.isImageToGalery(responseData.metadata.name)
    })
  }

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("images/ImageRecipe/" + this.props.tituloReceta + "/" + imageName);
    return ref.put(blob)
  }

  _pickImage = async () => { 
    if(this.props.tituloReceta == "" || this.props.tituloReceta == null){
      this.setState({isModalVisible: !this.state.isModalVisible});
      return
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1 
      });
    
      console.log(result);
  
      if (!result.cancelled) {
        this.setState({ image: result.uri, isModalVisible: !this.state.isModalVisible , isTituloReceta:true });
        setTimeout(() => { 
          this.isImageMain(result.uri)
        }, 1000)
      }
    }
  };
  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
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
  }
});