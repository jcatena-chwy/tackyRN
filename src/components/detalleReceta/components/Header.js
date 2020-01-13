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
    if(this.props.tituloReceta == null){
      this.props.sendData(true);
    }else{
      this.props.sendData(false);
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