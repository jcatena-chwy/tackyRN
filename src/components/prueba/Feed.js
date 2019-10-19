import React from 'react';
import { Text, StyleSheet, View} from 'react-native';
export default class Feeds extends React.Component {
  constructor() {
    super();
    this.state = { 
      estado:'',
      restaurant:true,
      place:{}
    }
  }
  
  render() {
    return (
      
        <View style={styles.container}> 
          <Text>Hello from feeds!</Text>
        </View>
    );
  }
}
  
const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff'
  }
})
