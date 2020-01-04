import React, { Component } from 'react';
import {
  ActivityIndicator,
  // Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { Constants } from 'expo';
import { Container, Header, Content, Textarea, Form,Icon, Button } from "native-base";
import {
  Item,
  Label,
  Input,
  InputGroup,
  Left,
  Right
} from 'native-base';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
export default class App extends Component {
  state = {
    image: null,
    uploading: false,
    paso1: true,
    name:null,
    detail:null
  };

  guardarReceta = () => {
    debugger;
    this.state;  
    console.log("llegue")
  };
  render() {
    let {
      image
    } = this.state;
    
    const navigation = this.props.navigation;
    return (
      
      <View style={styles.container}>
      {this.state.paso1 ? 
      <View >
        <StatusBar barStyle="default" />
 
        <Text
          style={styles.exampleText}>
          Comencemos...
        </Text>

        <Button block success onPress={this._pickImage} >
            <Text>Busca una foto en tu dispositivo</Text>
        </Button>

        {/* <Button
          onPress={this._pickImage}
          title="Busca una foto en tu dispositivo"
        /> */}

        <Button block success onPress={this._takePhoto} >
            <Text>Toma una foto</Text>
        </Button>

        {/* <Button onPress={this._takePhoto} title="Toma una foto" /> */}

        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}
      </View>
       : 
          <ScrollView
					horizontal={false}
					showsHorizontalScrollIndicator={false}
          >
          <Container>
         <Form>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input onChangeText={name => this.setState({ name })}/>
            </Item>
            <Image source={{ uri: image }} style={styles.maybeRenderImage} />
            <Item floatingLabel>
              <Label>Detils</Label>
              <Input onChangeText={detail => this.setState({ detail })}/>
            </Item>
         </Form>
          {/* <Content padder>    
              <Textarea rowSpan={15} height={100} bordered style={{color: '#616161'}} placeholder="INSTRUCTIONS" />
          </Content> */}
          <Button block success onPress={this.guardarReceta} title="Agregar" >
            <Text>Add</Text>
          </Button>
          {/* <Button full primary onPress={() => navigation.navigate('CookBook')} title="Agregar"/> */}
       </Container> 
          </ScrollView>}
      </View>
    );
  }
  

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      this.setState({
        paso1:false
      }) 
      return (
        <View
          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let {
      image
    } = this.state;

    if (!image) {
      return;
    }
    this.setState({
      paso1:false
    })

    // return (
      // <View
      //   style={styles.maybeRenderContainer}>
      //   <View
      //     style={styles.maybeRenderImageContainer}>
      //     <Image source={{ uri: image }} style={styles.maybeRenderImage} />
      //   </View>
      // </View>
    //   <Container>
    //   <Image source={{ uri: image }} style={styles.maybeRenderImage} />
    //   <Content padder>    
    //       <Textarea rowSpan={15} height={100} bordered style={{color: '#616161'}} placeholder="INSTRUCTIONS" />
    //   </Content>
    //   <Content>
    //   </Content>
    //   </Container>
    // );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  };

  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!pickerResult.cancelled) {
        this.setState({ image: pickerResult.uri });
      }

      this.uploadImageAsync(pickerResult.uri);
    }
  };

  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
      });


      if (!pickerResult.cancelled) {
        this.setState({ image: pickerResult.uri});
      }

      this.uploadImageAsync(pickerResult.uri);
    }
  };

 uploadImageAsync(pictureuri) {
  let apiUrl = 'http://123.123.123.123/ABC';



    var data = new FormData();  
    data.append('file', {  
      uri: pictureuri,
      name: 'file',
      type: 'image/jpg'
    })

    fetch(apiUrl, {  
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      method: 'POST',
      body: data
    }).then(
      response => {
        console.log('succ ')
        console.log(response)
      }
      ).catch(err => {
      console.log('err ')
      console.log(err)
    } )




  }

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 30,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    width: 250,
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
  },
  maybeRenderImage: {
    height: 250,
    width: 250,
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  }
});