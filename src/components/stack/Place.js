import React, { Component } from 'react';
import { Image,View, ScrollView, Text, StyleSheet} from 'react-native';
import { Container, Card, Button, Icon,Spinner } from 'native-base';
import { createStackNavigator } from 'react-navigation';
import restaurantes from '../request/restaurantes.json'
import ImageOverlay from "react-native-image-overlay";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Detalle from './components/Detalle.js';
import Comentarios from './components/Comentarios.js';
import Productos from './components/Productos.js';
import Modal from "react-native-modal";
import firebase from '../../config';
const WATER_IMAGE = require('../../assets/camera.png')
export default class CardExample extends Component {
  constructor(props){
    super(props);
    this.state = {
      place: this.props.navigation.state.params.establecimiento,
      navigation: this.props.navigation,
      widthStyle: 360,
      isModalVisibleSpinner: false
    }
    this.ratingCompleted = this.ratingCompleted.bind(this);
}
componentWillMount() {
  setTimeout(() => { 
    this.setState({
      isModalVisibleSpinner: !this.state.isModalVisibleSpinner 
    }, () => {
      setTimeout(() => { 
        this.setState({
          isModalVisibleSpinner: !this.state.isModalVisibleSpinner 
        }, () => {
        });
      }, 2000)
    });
  }, 1000)
  const db = firebase.database()
  db.ref('Scores').on('value', (data) =>{
    setTimeout(() => { 
      this.setState({
      }, () => { 
      });
    }, 4000)
    const db2 = firebase.database().ref('Scores')
    db2.orderByChild('id')
    .equalTo(this.state.place.score.id)
    .once('value')
    .then((snapshot) => { 
      var jsonComments = {
        averageScore:null,
        id:null 
      }
      var value = snapshot.val();
      score = 0;
      if (value) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val());
          jsonComments.averageScore = child.val().averageScore ; 
          jsonComments.id = child.val().id ; 
        });
        var copiaPlace = this.state.place
        copiaPlace.score.averageScore = jsonComments.averageScore 
        this.setState({
          place: copiaPlace 
        }, () => {
        });
      }
      console.log(jsonComments)
    });
})
}
ratingCompleted(rating) {
  console.log("Rating is: " + rating)
}
  render() {
    const navigation = this.props.navigation.state.params.navigation;
    return (
      <Container>
        <ScrollView>
            <ImageOverlay widthStyle = {this.props.widthStyle} source={{ uri: this.state.place.imageUri }}  width = "10%"
        contentPosition="bottom" titleStyle={{ color: 'yellow'}}>
                        <View>
                        <Text style={{fontSize:30,  fontWeight: 'bold', left:6, textAlign:'center', color:'#97bc00'}}>{this.state.place.name}</Text>
                        </View>
            </ImageOverlay>
            <Card title="CUSTOM RATING" >
    <View style={{flexDirection: 'row',color:'#ccc9bc', left:100}}><Text style={{fontSize: 20,left:6,color:'#f1c40e', top:20}}>Rating: </Text><Text style={{fontSize: 45,left:6, top:5, color:'#f1c40e'}}>{this.state.place.score.averageScore}</Text><Text style={{fontSize: 20,left:10, top:20, color:'#f1c40e'}}>/5</Text></View>
                <Rating
                  ratingCount={5}
                  fractions={2}
                  startingValue={this.state.place.score.averageScore}
                  imageSize={40}
                  onFinishRating={this.ratingCompleted}
                  style={{ paddingVertical: 10 }}
                  readonly = {true}
                  showReadOnlyText = {true}
                />
          </Card>
          <Card style={{height:140}} title="CUSTOM RATING" >
            <Detalle score = {this.state.place.score} schedule = {this.state.place.schedule}  phone = {this.state.place.phone}></Detalle>
          </Card>
          <Card style={{height:60}} title="CUSTOM RATING" >
            <Comentarios comentarios = {this.state.place.cantidadComentarios}   idComentarios = {this.state.place.id} name = {this.state.place.name} score = {this.state.place.score.id} navigation = {this.state.navigation}></Comentarios>
          </Card>
            <Productos products = {this.state.place.products}></Productos>
        </ScrollView>

        <Modal style={styles.containerSpinner} isVisible={this.state.isModalVisibleSpinner}>
                    <View style={styles.contentSpinner}> 
                        <Spinner color='red' />
                    </View>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
 
  containerSpinner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		shadowRadius:10,
		width: 350, 
		height:280
	  },
	  contentSpinner: {
		backgroundColor: 'white',
		padding: 22,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		width:200,
		height:200,
		borderColor: 'rgba(0, 0, 0, 0.1)',
	  }
});
