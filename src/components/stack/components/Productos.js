import React, { Component } from 'react';
import { Image,View, ScrollView, Text} from 'react-native';
import { Container, Card, Button, Icon } from 'native-base';
import { createStackNavigator } from 'react-navigation';
import ImageOverlay from "react-native-image-overlay";
import { Rating, AirbnbRating } from 'react-native-ratings';
export default class Productos extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: this.props.products,
      widthStyle: 360
    }
    this.showModal = this.showModal.bind(this);
}

showModal(){
  debugger
console.log("click")
}
  render() {
    const navigation = this.props.navigation;
    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            >
            {this.state.products.map((product) =>
            <View key={product.id} style={{ height: 180, width: 200, marginLeft: 20, borderWidth: 0.5, borderColor: '#dddddd' }}>
                  <View style={{ flex: 3 }}>
                      <Image source={{uri: product.image}}
                          style={{ width: 200, height: 195, resizeMode: 'cover' }}
                      />
                  </View>
                      <Icon style={{color: '#FFF'}}  name='image' onPress = { () => this.showModal() }  style={{ fontSize: 200, left:10, opacity: 0.000005, }}/>
                  <View style={{bottom:50 , color:'#8bad00', fontSize:10 }}>
                      <Text style={{ color:'black', fontSize:20 }}>{product.name}</Text>
                  </View>
            </View> 
          )} 
          </ScrollView>
    );
  }
}
