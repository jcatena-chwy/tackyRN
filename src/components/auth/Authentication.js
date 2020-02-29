import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

import firebase from '../../config';
import { Constants, Google } from 'expo';

export const isAndroid = () => Platform.OS === 'android';

export default class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      testVarible: '',
      config: ''
    }
    this.handleAuth = this.handleAuth.bind(this);
  }
  
  async handleAuth() {
        try{
          // const { type, user,idToken, accessToken } = await Google.logInAsync({
          //   androidStandaloneAppClientId: '<ANDROID_CLIENT_ID>',
          //   iosStandaloneAppClientId: '<IOS_CLIENT_ID>',
          //   androidClientId: '64424012176-iapqgej2po9k447edj5reiekm968b6hk.apps.googleusercontent.com',
          //   iosClientId: '64424012176-bl0km2g6nrbm0qujjigas56fjuk1ntvq.apps.googleusercontent.com',
          //   scopes: ['profile', 'email']
          // });
           const result = await Google.logInAsync({
           iosClientId: '64424012176-bl0km2g6nrbm0qujjigas56fjuk1ntvq.apps.googleusercontent.com',
             scopes: ['profile', 'email']
           });
          const provider = firebase.auth.GoogleAuthProvider.credential(result);
          firebase.auth().signInWithCredential(provider).then(result =>{
            console.log("Login Success");
          });
        }catch (e) {
          Alert.alert(
            'Oops!',
            'Login failed!',
          );
        }
        
      }
      
      

    
    render() {
        return (
       <View style={styles.container}>
         <Text>Welcome!</Text>  
         <Button onPress={this.handleAuth} title='Login with Google' />
       </View>
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


