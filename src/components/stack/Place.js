import React, { Component } from 'react';
import { Image, StyleSheet,SafeAreaView,View, ScrollView, Text} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Body, Right } from 'native-base';
import { createStackNavigator } from 'react-navigation';
import restaurantes from '../request/restaurantes.json'

export default class CardExample extends Component {
  constructor(props){
    super(props);
    this.state = {
      place: this.props.navigation.state.params.restaurante
    }
}
onPress = () => {
  this.props.updateState();
}
  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
      <Content>
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={{uri: 'https://logosmarcas.com/wp-content/uploads/2018/05/McDonalds-S%C3%ADmbolo.png'}} />
              <Body>
                <Text>{this.state.place.title}</Text>
              </Body>
            </Left>
          </CardItem>
         
          <CardItem cardBody>
            <Image source={{uri: this.state.place.image}} style={{height: 150, width: null, flex: 1}}/>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent >
                <Icon active name="thumbs-up" />
                <Text>{this.state.place.like}</Text>
              </Button>
            </Left>
            <Body>
              <Button transparent onPress={() => navigation.navigate('Comments')}>
                <Icon active name="chatbubbles" />
                <Text>31 Comentarios</Text>
              </Button>
            </Body>
            {/* <Right>
              <Text>{place.date}</Text> 
            </Right> */}
          </CardItem>
        </Card>
        <Text style={{padding: 10}}>Platos recomendados</Text>
        <ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}
          >
           {this.state.place.plate.map((plato) =>
					<View key={plato.id} style={{ height: 180, width: 200, marginLeft: 20, borderWidth: 0.5, borderColor: '#dddddd' }}>
                <View style={{ flex: 3 }}>
                    <Image source={{uri: plato.image}}
                        style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
                    />
                </View>
                <View style={{ flex: 1, paddingLeft: 10, paddingTop: 10 }}>
                    <Text>{plato.title}</Text>
										<Text>{plato.price}</Text>
                </View>
          </View>
        )} 
				</ScrollView>
      </Content>
      </Container>
    );
  }
}
