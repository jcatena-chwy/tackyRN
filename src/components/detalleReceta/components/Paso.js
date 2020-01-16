import React from 'react';
import { View, ScrollView, Image, TouchableHighlight, StyleSheet,Text, Dimensions } from 'react-native';
import { Button, Icon, Badge, Item, List, ListItem, Left, Body, Container, Header, Content, Right, Card, CardItem} from 'native-base';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { TextInput } from 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { IMAGENAME } from '../../../assets/camera.png';
import Modal from 'react-native-modal';
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
      pasos: [
        { "paso":1, photos: [
          { "photo":1, image:null, flag:false },
          { "photo":2, image:null, flag:false  },
          { "photo":3, image:null, flag:false  }
          ], colorBadge:'green'
        },
        { "paso":2 , photos: [
          { "photo":1, image:null, flag:false },
          { "photo":2, image:null, flag:false  },
          { "photo":3, image:null, flag:false  }
        ], colorBadge:'blue'
       },
        { "paso":3 , photos: [
          { "photo":1, image:null, flag:false },
          { "photo":2, image:null, flag:false  },
          { "photo":3, image:null, flag:false  }
        ],colorBadge:'red'}
      ], 
      camera: [
        { "photo":1, image:null, flag:false },
        { "photo":2, image:null, flag:false  },
        { "photo":3, image:null, flag:false  }
      ] ,
      posFila:null,
      posColumna:null,
      image: '../../../assets/camera.png',
      uploading: false,
      isModalVisible: false
    }
    this.analizarOpcion = this.analizarOpcion.bind(this)
    this.updatePosImage = this.updatePosImage.bind(this)
    this.addRow = this.addRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
    this.actualizarOrdenPaso = this.actualizarOrdenPaso.bind(this)
    this.viewImage = this.viewImage.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.eliminarFoto = this.eliminarFoto.bind(this)
  }
  
  analizarOpcion(index){
    // options={['Ver', 'Tomar Foto', 'Eliminar', 'Cancelar']}
    switch (index) {
      case 0:
        this.viewImage();
        break;
      case 1:
        this.takePhoto(index)
        break;
      case 2:
        this.eliminarFoto();
        break; 
      default:
        break;
    }
    console.log(index);
  }
  eliminarFoto(){
    debugger
    let newArrayPhotos = [...this.state.pasos];
    console.log(newArrayPhotos[this.state.posFila])
    newArrayPhotos[this.state.posFila].photos[this.state.posColumna].image = null
    newArrayPhotos[this.state.posFila].image = null;
    newArrayPhotos[this.state.posFila].flag = false
    let newArray = [...this.state.pasos];
    newArray[this.state.posFila].photos = newArrayPhotos;
    this.setState({ pasos:newArray });
  }
  toggleModal () {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  viewImage () {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };

  takePhoto = async (index) => {
    console.log("Llego al takePhoto")
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
        let newArray = [...this.state.pasos];
        newArray[this.state.posFila].photos[this.state.posColumna].image = pickerResult.uri
        newArray[this.state.posFila].photos[this.state.posColumna].flag = true
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
      if(this.state.pasos[fila-1].photos[columna-1].flag){
      // if(true){
        this.ActionSheet.show();
      }else {
        this.takePhoto(fila);
      }
    }
   
    addRow(){ 
      var row= 
        { "paso":this.state.pasos.length+1, photos: [
          { "photo":1, image:null, flag:false },
          { "photo":2, image:null, flag:false  },
          { "photo":3, image:null, flag:false  }
          ]
        }
      var numero = Math.floor(Math.random() * 10);
      if(this.state.pasos[this.state.pasos.length-1] !=null){
        var color1 = this.state.pasos[this.state.pasos.length-1].colorBadge
      }else{
        var color1 = "red"
      }
      if(this.state.pasos[this.state.pasos.length-2] !=null){
      var color2 = this.state.pasos[this.state.pasos.length-2].colorBadge
      }else{
        var color2 = "grey"
      }
      if(this.state.pasos[this.state.pasos.length-3] !=null){
      var color3 = this.state.pasos[this.state.pasos.length-3].colorBadge
      }else{
        var color3 = "coral"
      }
      flag = true;
      while (flag){
        switch (numero) {
          case 1:
            row.colorBadge = "red"
            break;
          case 2:
            row.colorBadge = "blue"
            break;
          case 3:
            row.colorBadge = "grey"
            break;
          case 4:
            row.colorBadge = "black"
            break;
          case 5:
            row.colorBadge = "coral"
            break;
          case 6:
            row.colorBadge = "lime"
            break;
          case 7:
            row.colorBadge = "pink"
            break;  
          default:
            row.colorBadge = "orange"
            break;
        }
        if(row.colorBadge != color1 && row.colorBadge != color2 && row.colorBadge != color3 ){
          flag = false;
        } else{
          numero = Math.floor(Math.random() * 5);
        }
      }
        
      this.setState({
        pasos:[...this.state.pasos,row]
      })
      this.state.pasos;
    }
    deleteRow(r){
      if(this.state.pasos.length>1){
        var array = [...this.state.pasos]; // make a separate copy of the array
        var index = array.indexOf(r)
        if (index !== -1) {
          array.splice(index, 1);
          setTimeout(() => { 
            for(i =0; i<array.length ; i++){
              array[i].paso = i+1;
            }
            this.setState({pasos: array});
          }, 100)
          console.log(this.state.pasos);
        }
      }
    }
    actualizarOrdenPaso(pasos){
      var array = [...this.state.pasos];
      for(i =1; i<this.state.pasos ; i++){
        array[i].paso = i;
      }
    }
  
    render() {
        return (
          <View>
          <Content  style={{ top:10,bottom:20}} padder> 
            <Text style={{ fontSize: 20,bottom:10}}>Pasos</Text>
            <TextInput style={{textAlign: 'right', fontSize: 15, bottom:10}} placeholder='Tiempo'></TextInput>
            {this.state.pasos.map((r) =>
            <Card key={r.paso}  style={{ width:350 }}>
              <CardItem  style={{ height:50 }} header > 
              {/* <Badge style={{ backgroundColor: r.colorBadge, fontSize:5 }} >
                  <Text style={{ width:15, left:2, color:'white', fontSize:13 }}>{r.paso}</Text>
              </Badge> */}
              <TouchableHighlight
                style = {{
                borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                width: Dimensions.get('window').width * 0.09,
                height: Dimensions.get('window').width * 0.09,
                backgroundColor:r.colorBadge,
                justifyContent: 'center',
                alignItems: 'center'
                }} 
                underlayColor = '#ccc'
                // onPress = { () => alert('Yaay!') }
              >
              <Text  style={{color:'white'}}>{r.paso}</Text>
              </TouchableHighlight>
              <TextInput style={{ fontSize: 17, left: 10}} placeholder='Describe cómo lo hiciste...'/>
              
              <Right  >
              <Button   onPress={() => this.deleteRow(r)} transparent textStyle={{color: '#87838B'}}>
                  <Icon name="close" style={{ fontSize: 30}} />
                </Button>
              </Right>
            </CardItem>
            
            <CardItem style={{alignItems: 'center', flex: 1,
    justifyContent: 'center'}} >
              <Content>
                  <ScrollView 
                    contentContainerStyle={{flexGrow : 1, justifyContent : 'center'}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    >
                    {r.photos.map((paso) =>
                    <Item key={paso.photo} >
                        <TouchableHighlight onPress={() => this.updatePosImage(r.paso, paso.photo)}>
                          <Image
                              source={paso.image
                                  ? {uri: paso.image}                      
                                  : require('../../../assets/camera.png')} 
                                  style={{ width: 80, height: 80, right:5 }} 
                          />
                        </TouchableHighlight>
                        <Button  onPress={() => this.updatePosImage(r.paso, paso.photo)} transparent style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                            <Icon active name='camera'   style={{ fontSize: 200, opacity:0 }}/>
                        </Button>

                        <ActionSheet
                          ref={o => (this.ActionSheet = o)}
                          //Title of the Bottom Sheet
                          title={'¿Que desea hacer?'}
                          //Options Array to show in bottom sheet
                          options={['Ver', 'Cambiar Foto', 'Eliminar', 'Cancelar']}
                          //Define cancel button index in the option array
                          //this will take the cancel option in bottom and will highlight it
                          cancelButtonIndex={3}
                          //If you want to highlight any specific option you can use below prop
                          destructiveButtonIndex={1}
                          onPress={index => { 
                            //Clicking on the option will give you the index of the option clicked
                            this.analizarOpcion(index)
                          }}
                        />
                        {/* <ActionSheet
                          ref={o => this.ActionSheet = o}
                          title={'¿Que desea hacer?'}
                          options={['Ver', 'Tomar Foto', 'Eliminar']}
                          cancelButtonIndex={2}
                          destructiveButtonIndex={1}
                          onPress={(index) => { this.showAlert(index) }}
                        /> */}
                    </Item>
                  )} 
                  </ScrollView>
                  </Content>
            </CardItem>
            </Card> 
             )}
              <View style={{flexDirection:'row', justifyContent: 'center',alignItems: 'center'}}>
                <Button  onPress={() => this.addRow()} transparent textStyle={{color: '#87838B'}}>
                  <Icon name="add" />
                </Button>
                <Text style={{ fontSize: 20 }}>Añadir paso</Text>
          </View>
          <Modal style={styles.container} isVisible={this.state.isModalVisible}>
            <View style={styles.content}>
              <Image source={{ uri: this.state.image }} style={{ width: 300, height: 300 }} />
              <Button style={{ width:80, height:40, backgroundColor:"white"}} onPress={this.toggleModal}>
                <Text style={{fontSize:18, color:"#1a0dab"}} >Cerrar</Text> 
              </Button>
            </View>
          </Modal>
          </Content>
        </View>
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
    height:400,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  }
});