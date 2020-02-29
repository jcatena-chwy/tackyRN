import React, { Component } from 'react';
import { Image,View, ScrollView, Text} from 'react-native';
import { Container, Card, Button, Icon } from 'native-base';
import { createStackNavigator } from 'react-navigation';
export default class Comentarios extends Component {
  constructor(props){
    super(props);
    this.state = {
      widthStyle: 360,
      comentarios : this.props.comentarios,
      navigation: this.props.navigation,
      idComments: this.props.idComentarios,
    } 
}
 
  render() {
    var idComments = this.props.idComentarios
    return (
      <Container>
          <View style={{flexDirection:'row', justifyContent: 'center',alignItems: 'center', top:10}}>
                <Button  onPress={() => navigation.navigate('Comments')} transparent textStyle={{color: '#87838B'}}>
                  <Icon name="ios-add" />
                </Button>
          <Text onPress={() => this.props.navigation.navigate('Comments', {idComments})} style={{ fontSize: 20 }}>{this.state.comentarios} Comentarios</Text>
          </View>
      </Container>
    );
  }
}
