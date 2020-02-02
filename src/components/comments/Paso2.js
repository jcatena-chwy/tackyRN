import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, Image } from 'react-native';
import { Container, Header, Content,Item, Icon, View } from 'native-base';

export default class Paso2 extends Component {
  constructor(props){
    super(props);
    this.state = {
        image: null,
        isCompleted:true,
        rows: [
            { "id":1, pregunta:"Que te parecio la comida?" },
            { "id":2, pregunta:"Que te parecio la atencion?" },
            { "id":3, pregunta:"Que te parecio la limpieza?" },
            { "id":4, pregunta:"Que te parecio calidad/precio?" },
          ]
    }
  }
  
  render() {
    let { image } = this.state;
    return (
      <Container>
        <Content>
        {this.state.rows.map((r) =>
        <Content key={r.id}>
             <Text style={{ fontSize: 20}}>{r.pregunta}</Text>
            <View style={{flexDirection: 'row'}}>
                <Icon active name='star' style={{ fontSize: 40, color: 'red' }} />
                <Icon active name='star' style={{ fontSize: 40, color: 'red' }} />
                <Icon active name='star' style={{ fontSize: 40, color: 'red' }} />
                <Icon active name='star' style={{ fontSize: 40, color: 'red' }} />
                <Icon active name='star' style={{ fontSize: 40, color: 'red' }} />
            </View>
        </Content>
        )} 
        </Content>
      </Container>
    );
  }
}
