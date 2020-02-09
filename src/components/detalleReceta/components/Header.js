import React, { Component } from 'react';
import { Text} from 'react-native';
import { Button, Icon, Left,Body, Right, Header} from 'native-base';
export default class Ingrediente extends Component {
  constructor(props){
    super(props);
    this.state = {
       
    }
    tituloReceta = this.props.tituloReceta;
    this.guardarReceta = this.guardarReceta.bind(this)
  }
  guardarReceta(){
    debugger
    if(!this.props.imagenGaleria) {
      this.props.sendData("Por favor, elija una imagen de la galeria", true)
      return
    }
    if(this.props.tituloReceta == null || this.props.tituloReceta == "" ){
      this.props.sendData("Por favor, escriba un titulo para la receta", true)
      return
    }
    if(!this.props.isIngredientes ){
      this.props.sendData("Por favor, escriba al menos un ingrediente", true)
      return
    }
    if(!this.props.isPasos ){
      this.props.sendData("Por favor, escriba al menos una descripcion en el paso o cargue una imagen, en un paso", true)
      return
    }
  }

  handleLangChange = () => {
    var lang = this.dropdown.value;
    this.props.onSelectLanguage(lang);            
  }
  
  render() {
    return (
        <Header>
        <Left>
          <Button transparent>
            <Icon name='close' />
          </Button>
        </Left>
        <Body>
        </Body>
        <Right>
        <Button style={{backgroundColor:"white", width:80, height:40}} onPress={this.guardarReceta}>
          <Text style={{fontSize:18}} >Guardar</Text>
        </Button>
        </Right>
      </Header>
    );
  }
}