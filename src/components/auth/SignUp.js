import React, { Component } from 'react';
import { Constants } from 'expo'
import {
    Container,
    Button,
    Form,
    Item as FormItem,
    Input,
    Label,
    Icon,
    Item,
    View
} from 'native-base';
import { Text, ImageBackground, Dimensions } from 'react-native';
import { StyleSheet, Image } from 'react-native';
import firebase from '../../config';
import Modal from "react-native-modal";
import { Spinner } from 'native-base';
import bgImage from '../../assets/fondoDePantalla.jpg'
import logo from '../../assets/logoApp.png'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const { width: WIDTH } = Dimensions.get('window')


export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'pepe@gmail.com',
            password: 'hola123',
            confirmedPassword: 'hola123',
            isModalVisibleSpinner: false
        };
        this.SignUp = this.SignUp.bind(this);
    }


    SignUp(email, password) {
        if(this.state.password != this.state.confirmedPassword) {
            alert('Las contraseñas no coinciden')
            return
        }
        this.setState({
            isModalVisibleSpinner: !this.state.isModalVisibleSpinner
        }, () => {  
        });
        try {
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    alert('Registro completo')
                    this.setState({
                        isModalVisibleSpinner: !this.state.isModalVisibleSpinner
                    }, () => {  
                        console.log('Success')
                        this.props.navigation.navigate('Map')
                    });
                   
                }).catch(()=> {
                    this.setState({
                        isModalVisibleSpinner: !this.state.isModalVisibleSpinner
                    }, () => {  
                        alert('Credenciales incorrectas')
                    });
                    
                })
        } catch (error) {
            console.log(error.toString(error));
        }
    };

    render() {
        return (
            <Container style={styles.container}>
                <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={logo} style={styles.logo}></Image>
                        <Text style={styles.logoText}>Tacky</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="ios-contact" size={28} color={'red'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            placeholderTextColor={'rgba(255,255,255,0.7)'}
                            underlineColorAndroid='transparent'
                            onChangeText={email => this.setState({ email })}
                        >

                        </TextInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="ios-lock" size={28} color={'red'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            secureTextEntry={true}
                            placeholderTextColor={'rgba(255,255,255,0.7)'}
                            underlineColorAndroid='transparent'
                            onChangeText={password => this.setState({ password })}
                        >

                        </TextInput>
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Icon name="ios-lock" size={28} color={'red'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar Contraseña"
                            secureTextEntry={true}
                            placeholderTextColor={'rgba(255,255,255,0.7)'}
                            underlineColorAndroid='transparent'
                            onChangeText={confirmedPassword => this.setState({ confirmedPassword })}
                        >

                        </TextInput>
                    </View>

                    
                    <TouchableOpacity onPress={() => this.SignUp(this.state.email, this.state.password)} style={styles.btnLogin}>
                        <Text style={styles.text}>Registrarse</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50
    },
    logo: {
        width: 120,
        height: 120
    },
    logoText: {
        color: 'white',
        fontSize: 30,
        fontWeight: '800',
        marginTop: 10,
        opacity: 0.5
    },
    input: {
        width: WIDTH - 55,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.35)',
        color: 'rgba(255,255,255,0.7)',
        marginHorizontal: 25,
        textAlign: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: 37
    },
    inputContainer: {
        marginTop:10

    },
    btnLogin: {
        width: WIDTH - 55,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor:'transparent',
        justifyContent:'center',
        marginTop:20,
        borderColor: 'white', 
        borderWidth: 1 
    },
    text: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign:'center'
    }
})