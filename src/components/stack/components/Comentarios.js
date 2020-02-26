import React, { Component } from 'react';
import { Image,View, ScrollView, Text} from 'react-native';
import { Container, Card, Button, Icon } from 'native-base';
import { createStackNavigator } from 'react-navigation';
export default class Comentarios extends Component {
  constructor(props){
    super(props);
    this.state = {
      widthStyle: 360,
      comentarios : this.props.comentarios
    }
   
}

  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
          <View style={{flexDirection:'row', justifyContent: 'center',alignItems: 'center', top:10}}>
                <Button  onPress={() => this.addRow()} transparent textStyle={{color: '#87838B'}}>
                  <Icon name="ios-add" />
                </Button>
          <Text style={{ fontSize: 20 }}>{this.state.comentarios} Comentarios</Text>
          </View>
      </Container>
    );
  }
}
