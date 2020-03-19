import React, { Component } from 'react';
import { Image,View, ScrollView, Text} from 'react-native';
import { Container, Card, Button, Icon } from 'native-base';
import firebase from '../../../config';
export default class Comentarios extends Component {
  constructor(props){
    super(props);
    this.state = {
      widthStyle: 360,
      comentarios : this.props.comentarios,
      navigation: this.props.navigation,
      idComments: this.props.idComentarios,
      name: this.props.name,
      score: this.props.score,
    } 
}
componentWillMount() {
    const db = firebase.database()
    db.ref('Comments').on('value', (data) =>{
      const db2 = firebase.database().ref('Comments')
      db2.orderByChild('idEstablecimiento')
      .equalTo(this.state.idComments)
      .once('value')
      .then((snapshot) => { 
        var value = snapshot.val();
        var comentarios = 0;
        if (value) {
          snapshot.forEach((child) => {
            console.log(child.key, child.val());
            comentarios = comentarios + 1;
          });
          this.setState({
            comentarios: comentarios
          }, () => {
          });
        }
        });
  })
      
}
 
  render() {
    var idComments = this.props.idComentarios
    var name = this.props.name
    var score = this.props.score
    return (
      <Container>
          <View style={{flexDirection:'row', justifyContent: 'center',alignItems: 'center', top:10}}>
                <Button  onPress={() => navigation.navigate('Comments')} transparent textStyle={{color: '#87838B'}}>
                  <Icon name="ios-add" />
                </Button>
          <Text onPress={() => this.props.navigation.navigate('Comments', {idComments, name, score})} style={{ fontSize: 20 }}>{this.state.comentarios} Comentarios</Text>
          </View>
      </Container>
    );
  }
}
