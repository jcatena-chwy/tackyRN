import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Container, Icon } from 'native-base';
export default class Comentarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widthStyle: 360,
      comentarios: this.props.comentarios,
      navigation: this.props.navigation,
      idComments: this.props.idComentarios,
      name: this.props.name,
      score: this.props.score,
    }
  }
  render() {
    var idComments = this.props.idComentarios
    var name = this.props.name
    var score = this.props.score
    return (
      <Container>
        <TouchableHighlight>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon onPress={() => this.props.navigation.navigate('Comments', { idComments, name, score })} style={{ fontSize: 20 }} name="ios-add" />
            <Text onPress={() => this.props.navigation.navigate('Comments', { idComments, name, score })} style={{ fontSize: 20 }}>{this.props.comentarios} Comentarios</Text>
          </View>
        </TouchableHighlight>
      </Container>
    );
  }
}
