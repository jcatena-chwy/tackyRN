import React from 'react';
import { Text, StyleSheet, View} from 'react-native';
import { Button } from 'native-base';
export default class Home extends React.Component {
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
          <Text>Hello from Homeooooooooooooo</Text>
          <Button>
              <Text>Clickgggg</Text>
          </Button>
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
