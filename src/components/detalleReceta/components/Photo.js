import * as React from 'react';
import { Button, Image, View, Text, Platform } from 'react-native';
import {Icon} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import firebase from '../../../config';



export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    textoImagen:false 
  }; 

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {!image && <Icon active name='image' onPress={this._pickImage} style={{ fontSize: 80 }}/>}
        {!image && <Text style={{ fontSize: 20}}>Publicar foto del Plato Terminado</Text>}
        { image && <Image source={{ uri: image }} style={{ width: 200, height: 200,marginTop:10 }} />}
      </View>
    ); 
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    //Ejemplo para guardar una imagen
    var ref = firebase.storage().ref().child("images/ImageRecetas/" + imageName);
    return ref.put(blob)

    //Ejemplo para recuperar una imagen
    var ref = firebase.storage().ref("images/ImageRecetas/imagePrueba5").getDownloadURL()
        .then(resolve => {
          console.log(resolve)
        })
        .catch(error => {
          console.log(error)
        })
    //
  }

  isImageMain(uri){
    this.props.isImageToGalery(uri)
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
 
    console.log(result);

    if (!result.cancelled) {
      // const db = firebase.database()
      // this.uploadImage(result.uri,'imagePrueba8').then((responseData) => {
      //      // Ejemplo de Insertar un elemento.
      //      console.log("La data es: " + responseData)
      //     db.ref("Photos/001").push({
      //       Descripcion:responseData.metadata.name
      //     }).then(() =>{
      //       console.log("Inserted")  
      //     }).catch((error) =>{
      //       console.log("error")  
      //     })
      // })
      this.setState({ image: result.uri });
      this.isImageMain(result.uri, "imagenMain")
    }
  };
  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
}