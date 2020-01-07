import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Button, Icon, Badge, Text, Item, List, ListItem, Left, Body, Container, Header, Content, Right} from 'native-base';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { TextInput } from 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
const options = [
  'Cancel', 
  'Apple', 
  <Button
 onPress={this.handleClick}
 title="Click ME"
 color="blue"
/>,
 <Button  onPress={this.showAlert} transparent textStyle={{color: '#87838B'}}>
 <Icon active name='close'/>
</Button>,
  'Watermelon', 
  <Text style={{color: 'red'}}  onPress={this.handleClick}>Durian</Text>
]
export default class Paso extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      rows: [
        { "id":1 },
        { "id":2 },
        { "id":3 }
      ],
      camera: [
        { "id":1, image:null },
        { "id":2, image:null  },
        { "id":3, image:null  }
      ],
      image: null,
    uploading: false
    }
    this.showAlert = this.showAlert.bind(this)
  }
  handleClick = () => {
    console.log('Button clicked!'); 
}
  showAlert(index){
    console.log("Hizo Click" + index)
    this.takePhoto(index);
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };

  takePhoto = async (index) => {
    console.log("Llego al takePhoto")
    debugger
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
  

  
    
    render() {
        return (
        <Container>
          <Text>Pasos</Text>
          {this.state.image &&
          <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
        <Content>
          <List>
          {this.state.rows.map((r) =>
            <ListItem  key={r.id} avatar>
              <Left>
              <Badge>
                  <Text>{r.id}</Text>
                 </Badge>
              </Left>
              <Body>
              <TextInput style={{ fontSize: 20}} placeholder='Describe como lo hiciste...'/>
              <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              >
               {this.state.camera.map((c) =>
              <Item key={c.id} >
               <Button  onPress={this.showActionSheet} transparent textStyle={{color: '#87838B'}}>
                  <Icon active name='camera'/>
              </Button>
              <ActionSheet
                ref={o => this.ActionSheet = o}
                title={'Which one do you like ?'}
                options={['Ver', 'Tomar Foto', 'Eliminar']}
                cancelButtonIndex={2}
                destructiveButtonIndex={1}
                onPress={(index) => { this.showAlert(index) }}
              />
              {c.image &&
                <Image source={{uri: c.image}} style={{width: 40, height: 40}} />}
              
              </Item>
            )} 
            </ScrollView>
              </Body>
            </ListItem>
            )}
          </List>
        </Content>
      </Container>
        );
    }
}


