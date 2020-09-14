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
import logo from '../../assets/LOGO-INICIO.png'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const { width: WIDTH } = Dimensions.get('window')
export default class FormLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'pepe@gmail.com',
            password: 'hola123',
            isModalVisibleSpinner: false
        };
        this.SignUp = this.SignUp.bind(this);
    }

    LogIn(email, password) {
        this.setState({
            isModalVisibleSpinner: !this.state.isModalVisibleSpinner
        }, () => {
        });
        try {

            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    this.setState({
                        isModalVisibleSpinner: !this.state.isModalVisibleSpinner
                    }, () => {
                        console.log('Success')
                        this.props.navigation.navigate('Map')
                    });

                })
                .catch(() => {
                    this.setState({
                        isModalVisibleSpinner: !this.state.isModalVisibleSpinner
                    }, () => {
                    });

                })
        } catch (error) {
            console.log(error.toString(error));
        }
    };

    SignUp(email, password) {
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

                }).catch(() => {
                    this.setState({
                        isModalVisibleSpinner: !this.state.isModalVisibleSpinner
                    }, () => {

                    });

                })
                .catch(() => {
                    alert("El usuario o contraseña son incorrectas")
                })
        } catch (error) {
            console.log(error.toString(error));
        }
    };

    render() {
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}></Image>
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="ios-contact" size={28} color={'red'} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor={'rgba(255,255,255,0.7)'}
                        autoCapitalize='none'
                        autoCompleteType='off'
                        keyboardType='email-address'
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
                        textContentType="newPassword"
                        placeholderTextColor={'rgba(255,255,255,0.7)'}
                        underlineColorAndroid='transparent'
                        onChangeText={password => this.setState({ password })}
                    >

                    </TextInput>
                </View>

                <TouchableOpacity onPress={() => this.LogIn(this.state.email, this.state.password)} style={styles.btnLogin}>
                    <Text style={styles.text}>Iniciar Sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')} style={styles.btnLogin}>
                    <Text style={styles.text} >Registrarse</Text>
                </TouchableOpacity>
                <Modal style={styles.containerSpinner} isVisible={this.state.isModalVisibleSpinner}>
                    <View style={styles.contentSpinner}>
                        <Spinner color='red' />
                    </View>
                </Modal>
              
            </ImageBackground>
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
        width: 300,
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
        marginTop: 10

    },
    btnLogin: {
        width: WIDTH - 55,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginTop: 20,
        borderColor: 'white',
        borderWidth: 1
    },
    text: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center'
    },
    containerSpinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 10,
        width: 350,
        height: 280
    },
    contentSpinner: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        width: 200,
        height: 200,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    }
})