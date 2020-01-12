import React from 'react';
import { View, ScrollView, Image, TouchableHighlight } from 'react-native';
import { Button, Icon, Badge, Text, Item, List, ListItem, Left, Body, Container, Header, Content, Right} from 'native-base';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { TextInput } from 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { IMAGENAME } from '../../../assets/camera.png';
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
        { "id":1, camera: [
          { "id":1, image:null, flag:false },
          { "id":2, image:null, flag:false  },
          { "id":3, image:null, flag:false  }
          ] 
        },
        { "id":2 , camera: [
          { "id":1, image:null, flag:false },
          { "id":2, image:null, flag:false  },
          { "id":3, image:null, flag:false  }
        ] 
       },
        { "id":3 , camera: [
          { "id":1, image:null, flag:false },
          { "id":2, image:null, flag:false  },
          { "id":3, image:null, flag:false  }
        ]  }
      ],
      camera: [
        { "id":1, image:null, flag:false },
        { "id":2, image:null, flag:false  },
        { "id":3, image:null, flag:false  }
      ] ,
      posFila:null,
      posColumna:null,
      image: '../../../assets/camera.png',
      uploading: false
    }
    this.showAlert = this.showAlert.bind(this)
    this.updatePosImage = this.updatePosImage.bind(this)
    this.addRow = this.addRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
  }
  
  showAlert(index){
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
        let newArray = [...this.state.rows];
        newArray[this.state.posFila].camera[this.state.posColumna].image = pickerResult.uri
        newArray[this.state.posFila].camera[this.state.posColumna].flag = true
        this.setState({ image: pickerResult.uri, camera:newArray });
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
    updatePosImage(fila,columna){
      this.setState({ posFila:fila-1, posColumna:columna-1 });
      if(this.state.rows[fila-1].camera[columna-1].flag){
        this.ActionSheet.show();
      }else {
        this.takePhoto(fila);
      }
    }
   
    addRow(){ 
      var row= 
        { "id":this.state.rows.length+1, camera: [
          { "id":1, image:null, flag:false },
          { "id":2, image:null, flag:false  },
          { "id":3, image:null, flag:false  }
          ] 
        }
      this.setState({
        rows:[...this.state.rows,row]
      })
      this.state.rows;
    }
    deleteRow(r){
      var array = [...this.state.rows]; // make a separate copy of the array
      var index = array.indexOf(r)
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({rows: array});
        console.log(this.state.rows);
      }
    }
    

  
    
    render() {
        return (
        <Container>
          <Text>Pasos</Text>
          <Image source={ IMAGENAME } />
        <Content>
          <List>
          {/* <Image source={require('./assets/camera.png')} /> */}
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
               {r.camera.map((c) =>
              <Item key={c.id} >
                  <TouchableHighlight onPress={() => this.updatePosImage(r.id, c.id)}>
                    <Image
                        source={c.image
                            ? {uri: c.image}                      
                            : require('../../../assets/camera.png')} 
                            style={{ width: 80, height: 80 }} 
                    />
                  </TouchableHighlight>
                  <Button  onPress={() => this.updatePosImage(r.id, c.id)} transparent style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                      <Icon active name='camera'   style={{ fontSize: 200, opacity:0 }}/>
                  </Button>

                  <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'¿Que desea hacer?'}
                    options={['Ver', 'Tomar Foto', 'Eliminar']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => { this.showAlert(index) }}
                  />
              </Item>
            )} 
            </ScrollView>
              </Body>
              <Right  style={{ top: -10}}>
              <Button  onPress={() => this.deleteRow(r)} transparent textStyle={{color: '#87838B'}}>
                  <Icon name="close" />
                </Button>
              </Right>
            </ListItem>
            )}
          </List>
          <View style={{flexDirection:'row', justifyContent: 'center',alignItems: 'center'}}>
                <Button  onPress={() => this.addRow()} transparent textStyle={{color: '#87838B'}}>
                  <Icon name="add" />
                </Button>
                <Text style={{ fontSize: 20 }}>Añadir paso</Text>
          </View>
        </Content>
      </Container>
        );
    }
}


