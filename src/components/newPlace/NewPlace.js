import React, { Component } from 'react';
import { Text } from 'react-native';
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
            <Container style={styles.container}>
                <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10, left: 5 }}>Agregar Nuevo Establecimiento</Text>
                <Form>
                    <Item >
                        <Label style={{ color: 'black' }}>Nombre: </Label>
                        <Input
                            style={{ borderBottomColor: 'red' }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={this.handleChangeName}
                        />
                    </Item>
                    {this.state.isName && <Text style={styles.textStyleAlert}>Complete el Nombre </Text>}
                    <Item >
                        <Label style={{ color: 'black' }}>Localidad: </Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={this.handleChangeLocalidad}
                        />
                    </Item>
                    {this.state.isLocalidad && <Text style={styles.textStyleAlert}>Complete la Localidad </Text>}
                    <Item >
                        <Label style={{ color: 'black' }}>Dirección: </Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={this.handleChangeDireccion}
                        />
                    </Item>
                    {this.state.isDireccion && <Text style={styles.textStyleAlert}>Complete la Direccion</Text>}
                    <Item >
                        <Label style={{ color: 'black' }}>Tipo: </Label>
                        <Checkbox onChange={() => this.setState({ selectedValue: 'Restaurante'  })} color="warning"  label="Restaurante" labelStyle={{fontSize : 14}}/>
                        <Checkbox onChange={() => this.setState({ selectedValue: 'Almacen'  })} color="warning"  label="Almacen" labelStyle={{fontSize : 14}}/>
                          
                    </Item> 
                    <Item >
                        <Label style={{ color: 'black' }}>Link Google Map: </Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={googleMaps => this.setState({ googleMaps })}
                        />
                    </Item>
                    <Button full rounded success style={{ marginTop: 20 }} onPress={() => this.validarCampos()}>
                        <Text>Guardar</Text>
                    </Button>
                </Form>
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
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerConfirmed: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        fontSize: 20
    },
    textStyleAlert: {
        color: "red"
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
    },
    contentConfirmed: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

}) 