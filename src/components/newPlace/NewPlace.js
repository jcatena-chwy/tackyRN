import React, { Component } from 'react';
import { Text, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
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
import { Spinner } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, Picker } from 'react-native';
import firebase from '../../config';
import Modal from "react-native-modal";
import { TextInput } from 'react-native-gesture-handler';
import { Checkbox } from 'galio-framework'
import bgImage from '../../assets/fondoDePantalla.jpg'
const { width: WIDTH } = Dimensions.get('window')
export default class NewPlace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            isName: false,
            direccion: '',
            isDireccion: false,
            localidad: '',
            isLocalidad: false,
            password: '',
            googleMaps: '',
            selectedValue: '',
            isModalVisibleSpinner: false,
            isModalConfirmed: false,
        }
        this.validarCampos = this.validarCampos.bind(this)
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangeDireccion = this.handleChangeDireccion.bind(this)
        this.handleChangeLocalidad = this.handleChangeLocalidad.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    validarCampos() {
        if (this.state.name === '') {
            this.setState({ isName: true })
            return
        }
        if (this.state.localidad === '') {
            this.setState({ isLocalidad: true })
            return
        }
        if (this.state.direccion === '') {
            this.setState({ isDireccion: true })
            return
        }
        this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
        this.guardarSolicitud()
    }
    toggleModal() {
        this.setState({
            isModalConfirmed: !this.state.isModalConfirmed
        }, () => {
            this.props.navigation.navigate('Mapa')
        });
    }

    guardarSolicitud() {
        const db = firebase.database()
        var id = Math.random().toString(36).substring(7)
        db.ref("Solicitudes/").push({
            id: id,
            name: this.state.name,
            localidad: this.state.localidad,
            direccion: this.state.direccion,
            tipo: this.state.selectedValue,
            googleMaps: this.state.googleMaps,
            activo: false
        }).then(() => {
            this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner, isModalConfirmed: !this.state.isModalConfirmed });
            this.props.navigation.navigate('Mapa')
        }).catch((error) => {
            console.log("error")
        })
    }

    handleChangeName(event = {}) {
        if (event == "" || event == null) {
            this.setState({ isName: true, name: '' });
        } else {
            this.setState({ isName: false, name: event });
        }
    }
    handleChangeLocalidad(event = {}) {
        if (event == "" || event == null) {
            this.setState({ isLocalidad: true, localidad: '' });
        } else {
            this.setState({ isLocalidad: false, localidad: event });
        }
    }
    handleChangeDireccion(event = {}) {
        if (event == "" || event == null) {
            this.setState({ isDireccion: true, direccion: '' });
        } else {
            this.setState({ isDireccion: false, direccion: event });
        }
    }

    render() {
        const navigation = this.props.navigation;
        const [selectedValue, setSelectedValue] = "Restaurant";
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <View style={{ bottom: 80, justifyContent: 'center',
        alignItems: 'center', }}>
                    <Text style={{ fontSize: 20, marginBottom: 10, left: 5, color:'white' }}>Agregar Nuevo Establecimiento</Text>
                    <TouchableOpacity  style={styles.btnAdd}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Label style={{ color: 'white', fontSize: 15, marginLeft: 8, marginRight: 5 }}>NOMBRE: </Label>
                            <Input
                                style={{ borderBottomColor: 'red', fontSize: 12 }}
                                placeholder="StoryBrooke Buenos Aires"
                                placeholderTextColor='#e1e1e1'
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={this.handleChangeName}
                            />
                        </View>
                    </TouchableOpacity>
                    {this.state.isName && <Text style={styles.textStyleAlert}>Complete el Nombre </Text>}
              
                    <TouchableOpacity  style={styles.btnAdd}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Label style={{ color: 'white', fontSize: 15, marginLeft: 8, marginRight: 5 }}>LOCALIDAD: </Label>
                            <Input
                                style={{ borderBottomColor: 'red', fontSize: 12 }}
                                placeholder="LOMAS DE ZAMORA"
                                placeholderTextColor='#e1e1e1'
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={this.handleChangeLocalidad}
                            />
                        </View>
                    </TouchableOpacity>
                    {this.state.isLocalidad && <Text style={styles.textStyleAlert}>Complete la Localidad </Text>}

                    <TouchableOpacity  style={styles.btnAdd}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Label style={{ color: 'white', fontSize: 15, marginLeft: 8, marginRight: 5 }}>DIRECCIÓN: </Label>
                            <Input
                                style={{ borderBottomColor: 'red', fontSize: 12 }}
                                placeholder="SIXTO FERNANDEZ 500"
                                placeholderTextColor='#e1e1e1'
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={this.handleChangeDireccion}
                            />
                        </View>
                    </TouchableOpacity>
                    {this.state.isDireccion && <Text style={styles.textStyleAlert}>Complete la Direccion</Text>}

                    <TouchableOpacity  style={styles.btnAdd}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Label style={{ color: 'white', fontSize: 15, marginLeft: 8, marginRight: 5 }}>TIPO: </Label>
                            <Checkbox onChange={() => this.setState({ selectedValue: 'Restaurante' })} color="warning" label="Restaurante" labelStyle={{ fontSize: 14, color: 'white' }} />
                            <Checkbox onChange={() => this.setState({ selectedValue: 'Almacen' })} color="warning" label="Almacen" labelStyle={{ fontSize: 14, color: 'white' }} />

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  style={styles.btnAdd}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Label style={{ color: 'white', fontSize: 15, marginLeft: 8, marginRight: 5 }}>LINK GOOGLE MAP: </Label>
                            <Input
                                style={{ borderBottomColor: 'red', fontSize: 12 }}
                                autoCapitalize="none"
                                placeholder="https://www.google.com.ar/maps/place/Storybrooke+Buenos+Aires/@-34.7661093,-58.4074877,17z"
                                placeholderTextColor='#e1e1e1'
                                autoCorrect={false}
                                onChangeText={googleMaps => this.setState({ googleMaps })}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.validarCampos()}  style={styles.btnguardar}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                           <Text style={{color:'white'}} onPress={() => this.validarCampos()} >Guardar</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <Modal style={styles.containerConfirmed} isVisible={this.state.isModalVisibleSpinner}>
                    <View style={styles.contentSpinner}>
                        <Spinner color='red' />
                    </View>
                </Modal>
                <Modal style={styles.containerConfirmed} isVisible={this.state.isModalConfirmed}>
                    <View style={styles.contentConfirmed}>
                        <Text style={{ fontSize: 20 }}>Su solicitud, sera procesada!  {"\n"}Muchas gracias!</Text>
                        <Button full rounded success style={{ marginTop: 20 }} onPress={() => this.toggleModal()}>
                            <Text>Ok</Text>
                        </Button>
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
    btnAdd: {
        width: WIDTH - 60,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginTop: 20,
        borderColor: 'white',
        borderWidth: 1
    },
    btnguardar: {
        width: WIDTH - 220,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginTop: 20,
        borderColor: 'white',
        borderWidth: 3
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