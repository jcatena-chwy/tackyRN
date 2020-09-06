import React from 'react';
import { TextInput, TouchableOpacity, View, ScrollView, Image, TouchableHighlight, StyleSheet, Text, Dimensions, ImageBackground } from 'react-native';
import { Button, Spinner, Icon, Badge, Item, List, ListItem, Left, Body, Container, Header, Content, Right, Card, CardItem } from 'native-base';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { IMAGENAME } from '../../../assets/camera.png';
import firebase from '../../../config';
import Modal from 'react-native-modal';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import bgImage from '../../../assets/fondoDePantalla.jpg'
const { width: WIDTH } = Dimensions.get('window')
YellowBox.ignoreWarnings(['Setting a timer']);
const options = [
    'Cancel',
    'Apple',
    <Button
        onPress={this.handleClick}
        title="Click ME"
        color="blue"
    />,
    <Button onPress={this.showAlert} transparent textStyle={{ color: '#87838B' }}>
        <Icon active name='close' />
    </Button>,
    'Watermelon',
    <Text style={{ color: 'red' }} onPress={this.handleClick}>Durian</Text>
]
export default class Paso extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [
                {
                    "orden": 1, photos: [
                        { "photo": 1, image: null, flag: false, name: "" },
                        { "photo": 2, image: null, flag: false, name: "" },
                        { "photo": 3, image: null, flag: false, name: "" }
                    ], colorBadge: 'green', description: ""
                },
                {
                    "orden": 2, photos: [
                        { "photo": 1, image: null, flag: false, name: "" },
                        { "photo": 2, image: null, flag: false, name: "" },
                        { "photo": 3, image: null, flag: false, name: "" }
                    ], colorBadge: 'blue', description: ""
                },
                {
                    "orden": 3, photos: [
                        { "photo": 1, image: null, flag: false, name: "" },
                        { "photo": 2, image: null, flag: false, name: "" },
                        { "photo": 3, image: null, flag: false, name: "" }
                    ], colorBadge: 'red', description: ""
                }
            ],
            camera: [
                { "photo": 1, image: null, flag: false },
                { "photo": 2, image: null, flag: false },
                { "photo": 3, image: null, flag: false }
            ],
            posFila: null,
            posColumna: null,
            image: '../../../assets/camera.png',
            uploading: false,
            isModalVisible: false,
            isModalVisibleSpinner: false,
            tituloReceta: this.props.tituloReceta,
            isTituloReceta: false,
            time: ""
        }
        this.analizarOpcion = this.analizarOpcion.bind(this)
        this.updatePosImage = this.updatePosImage.bind(this)
        this.addRow = this.addRow.bind(this)
        this.deleteRow = this.deleteRow.bind(this)
        this.actualizarOrdenPaso = this.actualizarOrdenPaso.bind(this)
        this.viewImage = this.viewImage.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
        this.eliminarFoto = this.eliminarFoto.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.isImagePaso = this.isImagePaso.bind(this);
        this.toggleModalSpinner = this.toggleModalSpinner.bind(this);
    }

    analizarOpcion(index) {
        // options={['Ver', 'Tomar Foto', 'Eliminar', 'Cancelar']}
        switch (index) {
            case 0:
                this.viewImage();
                break;
            case 1:
                this.takePhoto(index)
                break;
            case 2:
                this.eliminarFoto();
                break;
            default:
                break;
        }
        console.log(index);
    }
    eliminarFoto() {
        let newArrayPhotos = [...this.state.steps];
        console.log(newArrayPhotos[this.state.posFila])
        newArrayPhotos[this.state.posFila].photos[this.state.posColumna].image = null
        newArrayPhotos[this.state.posFila].image = null;
        newArrayPhotos[this.state.posFila].flag = false
        let newArray = [...this.state.steps];
        newArray[this.state.posFila].photos = newArrayPhotos;
        this.setState({ steps: newArray });
    }
    toggleModal() {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
    viewImage() {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }
    showActionSheet = () => {
        this.ActionSheet.show();
    };

    takePhoto = async (index) => {
        console.log("Llego al takePhoto")
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });

            if (!pickerResult.cancelled) {

                let newArray = [...this.state.steps];
                newArray[this.state.posFila].photos[this.state.posColumna].image = pickerResult.uri
                newArray[this.state.posFila].photos[this.state.posColumna].flag = true
                this.setState({ image: pickerResult.uri, steps: newArray, isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
                setTimeout(() => {
                    this.isImagePaso(pickerResult.uri)
                }, 1000)
            }
            // this.uploadImageAsync(pickerResult.uri);
        }
    };

    isImagePaso(uri) {
        let name = Math.random().toString(36).substring(7);
        // this.uploadImage(uri,name).then((responseData) => {

        // console.log("La data es: " + responseData)
        let newArray = [...this.state.steps];
        newArray[this.state.posFila].photos[this.state.posColumna].name = this.state.image
        this.setState({
            isModalVisibleSpinner: !this.state.isModalVisibleSpinner, steps: newArray
        }, () => {
            this.validarCargaPasos();
        });
        // })
    }

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref().child("images/ImageRecipe/" + this.state.tituloReceta + "/" + "Steps" + "/" + imageName);
        return ref.put(blob)
    }

    uploadImageAsync(pictureuri) {
        let apiUrl = 'http://123.123.123.123/ABC';



        var data = new FormData();
        data.append('file', {
            uri: pictureuri,
            name: 'file',
            type: 'image/jpg'
        })

        fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: data
        }).then(
            response => {
                console.log('succ ')
                console.log(response)
            }
        ).catch(err => {
            console.log('err ')
            console.log(err)
        })


    }
    updatePosImage(fila, columna) {
        if (this.props.tituloReceta == "" || this.props.tituloReceta == null) {
            this.setState({ isTituloReceta: true, isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
            return
        } else {
            this.setState({ posFila: fila - 1, posColumna: columna - 1, isTituloReceta: false, tituloReceta: this.props.tituloReceta });
            if (this.state.steps[fila - 1].photos[columna - 1].flag) {
                // if(true){
                this.ActionSheet.show();
            } else {
                this.takePhoto(fila);
            }
        }

    }

    addRow() {
        var row =
        {
            "orden": this.state.steps.length + 1, photos: [
                { "photo": 1, image: null, flag: false, name: "" },
                { "photo": 2, image: null, flag: false, name: "" },
                { "photo": 3, image: null, flag: false, name: "" }
            ], description: ""
        }
        var numero = Math.floor(Math.random() * 10);
        if (this.state.steps[this.state.steps.length - 1] != null) {
            var color1 = this.state.steps[this.state.steps.length - 1].colorBadge
        } else {
            var color1 = "red"
        }
        if (this.state.steps[this.state.steps.length - 2] != null) {
            var color2 = this.state.steps[this.state.steps.length - 2].colorBadge
        } else {
            var color2 = "grey"
        }
        if (this.state.steps[this.state.steps.length - 3] != null) {
            var color3 = this.state.steps[this.state.steps.length - 3].colorBadge
        } else {
            var color3 = "coral"
        }
        flag = true;
        while (flag) {
            switch (numero) {
                case 1:
                    row.colorBadge = "red"
                    break;
                case 2:
                    row.colorBadge = "blue"
                    break;
                case 3:
                    row.colorBadge = "grey"
                    break;
                case 4:
                    row.colorBadge = "black"
                    break;
                case 5:
                    row.colorBadge = "coral"
                    break;
                case 6:
                    row.colorBadge = "lime"
                    break;
                case 7:
                    row.colorBadge = "pink"
                    break;
                default:
                    row.colorBadge = "orange"
                    break;
            }
            if (row.colorBadge != color1 && row.colorBadge != color2 && row.colorBadge != color3) {
                flag = false;
            } else {
                numero = Math.floor(Math.random() * 5);
            }
        }

        this.setState({
            steps: [...this.state.steps, row]
        })
        this.state.steps;
    }
    deleteRow(r) {
        if (this.state.steps.length > 1) {
            var array = [...this.state.steps]; // make a separate copy of the array
            var index = array.indexOf(r)
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({
                    steps: array
                }, () => {
                    this.actualizarOrdenPaso()
                });
            }
        }
    }
    actualizarOrdenPaso() {
        var array = [...this.state.steps];
        for (i = 0; i < array.length; i++) {
            array[i].orden = i + 1;
        }
        this.setState({
            steps: array
        }, () => {
            this.validarCargaPasos()
        });
    }

    handleChange(text, posicion) {
        let newArray = [...this.state.steps];
        newArray[posicion - 1].description = text
        this.setState({ steps: newArray });
        this.validarCargaPasos()
    }
    handleChangeTime(text) {
        this.setState({ time: text });
        this.validarCargaPasos()
    }

    toggleModalSpinner() {
        this.setState({
            isModalVisibleSpinner: !this.state.isModalVisibleSpinner
        })
    }

    validarCargaPasos() {

        // ARREGLAR EL VALIDAR PASOS ESTA REPITIENDO LA LISTa

        let newArray = [];
        var imagenesPasos = [];
        var obj = {
            image: "",
            name: ""
        }
        var paso = {}
        var x = 0;
        var y = 0;
        for (i = 0; i < this.state.steps.length; i++) {
            var contieneTexto = false;
            var step = this.state.steps[i]
            if (step.description != "") {
                contieneTexto = true;
            }
            var contieneImagen = false;
            for (f = 0; f < step.photos.length; f++) {
                if (step.photos[f].image != null) {
                    step.photos[f].name = Math.random().toString(36).substring(7);
                    contieneImagen = true;
                }
            }
            if (contieneTexto) {
                newArray[x] = step;
                x++;
            } else {
                if (contieneImagen) {
                    newArray[x] = step;
                    x++;
                }
            }

        }
        //Hacerlo Despues
        if (newArray.length > 0) {
            this.props.isPasos(true, newArray, this.state.time);
        } else {
            this.props.isPasos(false, newArray, this.state.time);
        }
    }


    render() {
        return (
            <ImageBackground source={bgImage} style={styles.backgroundContainer} >
                <TouchableOpacity onPress={this.validarReceta} style={styles.btnLogin}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Preparación</Text>
                </TouchableOpacity>
                <TextInput onChangeText={(text) => this.handleChangeTime(text)} style={{ textAlign: 'right', fontSize: 15 }} placeholder='Tiempo'></TextInput>
                {this.state.steps.map((r) =>
                    <Card key={r.orden} style={{ width: 350, borderRadius: 20, borderWidth: 1, overflow: 'hidden', borderColor: 'white' }}>
                        <ImageBackground source={bgImage} style={styles.backgroundContainer} style={{ height: 200, borderRadius: 20, borderWidth: 1, overflow: 'hidden', borderColor: 'white' }} >
                            <View style={{
                                flexDirection: 'row', justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <TouchableHighlight
                                    style={{
                                        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                                        width: Dimensions.get('window').width * 0.09,
                                        height: Dimensions.get('window').width * 0.09,
                                        backgroundColor: '#e23f52',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 20
                                    }}
                                    underlayColor='#ccc'
                                >
                                    <Text style={{ color: 'white' }}>{r.orden}</Text>
                                </TouchableHighlight>
                                <View style={styles.textAreaContainerSteps} >
                                    <TextInput
                                        placeholder="Describe como lo hiciste..."
                                        placeholderTextColor='white'
                                        onChangeText={(text) => this.handleChange(text, r.orden)}
                                        style={styles.textAreaSteps}
                                        numberOfLines={10}
                                        multiline={true}
                                    />
                                </View>
                                <Button onPress={() => this.deleteRow(r)} transparent textStyle={{
                                    color: '#87838B',
                                }}>
                                    <Icon onPress={() => this.deleteRow(r)} name="close" style={{ fontSize: 25, color: 'white', marginBottom: 4 }} />
                                </Button>
                            </View>
                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                {r.photos.map((paso) =>
                                    <Item key={paso.photo}  >
                                        <TouchableHighlight onPress={() => this.updatePosImage(r.orden, paso.photo)}>
                                            {paso.image ? (
                                                <Image
                                                    source={{ uri: paso.image }}
                                                    style={{ width: 60, height: 60, right: 5 }}
                                                />
                                            ) : (
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Icon active name='image' style={{ fontSize: 80, color: 'white' }} />
                                                        <Icon name="ios-add-circle" style={{ fontSize: 30, color: 'black', bottom: 30, borderColor: '#e65540' }} />
                                                    </View>
                                                )}
                                        </TouchableHighlight>
                                        <Button onPress={() => this.updatePosImage(r.orden, paso.photo)} transparent style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                            <Icon active name='camera' style={{ fontSize: 200, opacity: 0 }} />
                                        </Button>

                                        <ActionSheet
                                            ref={o => (this.ActionSheet = o)}
                                            //Title of the Bottom Sheet
                                            title={'¿Que desea hacer?'}
                                            //Options Array to show in bottom sheet
                                            options={['Ver', 'Cambiar Foto', 'Eliminar', 'Cancelar']}
                                            //Define cancel button index in the option array
                                            //this will take the cancel option in bottom and will highlight it
                                            cancelButtonIndex={3}
                                            //If you want to highlight any specific option you can use below prop
                                            destructiveButtonIndex={1}
                                            onPress={index => {
                                                //Clicking on the option will give you the index of the option clicked
                                                this.analizarOpcion(index)
                                            }}
                                        />
                                    </Item>
                                )}
                            </ScrollView>
                        </ImageBackground>

                    </Card>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <Button onPress={() => this.addRow()} transparent textStyle={{ color: '#87838B' }}>
            <Icon name="add" />
          </Button>
          <Text style={{ fontSize: 20 }}>Añadir paso</Text> */}
                    <TouchableOpacity onPress={this.addRow} style={styles.btnAdd}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Icon name="add" style={{ color: 'white', fontSize: 15, marginRight: 5 }} />
                            <Text style={{ fontWeight: '400', fontSize: 15, color: 'white' }}>Añadir paso</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Modal style={styles.container} isVisible={this.state.isModalVisible}>
                    <View style={styles.content}>
                        <Image source={{ uri: this.state.image }} style={{ width: 300, height: 300 }} />
                        <Button style={{ width: 80, height: 40, backgroundColor: "white" }} onPress={this.toggleModal}>
                            <Text style={{ fontSize: 18, color: "#1a0dab" }} >Cerrar</Text>
                        </Button>
                    </View>
                </Modal>
                <Modal style={styles.container} isVisible={this.state.isModalVisibleSpinner}>
                    <View style={styles.contentSpinner}>
                        {!this.state.isTituloReceta && <Spinner color='red' />}
                        {/* {this.state.tituloReceta && <Text>Por favor, complete el titulo de la receta</Text>} */}
                        {this.state.isTituloReceta && <Text style={{ fontSize: 20 }}>Por favor, complete el titulo de la receta  👋!</Text>}
                        {this.state.isTituloReceta && <Button danger style={{ width: 80, }} onPress={this.toggleModalSpinner}><Text style={{ fontSize: 20, color: "white", left: 5 }}>Cerrar</Text></Button>}

                    </View>
                </Modal>
            </ImageBackground>
        );
    }
}


const styles = StyleSheet.create({
    btnLogin: {
        width: WIDTH - 95,
        height: 45,
        fontSize: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    btnAdd: {
        width: WIDTH - 200,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        marginTop: 20,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 10
    },
    backgroundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 10,
        width: 350,
        height: 280
    },
    button: {
        backgroundColor: 'lightblue',
        width: 30,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        width: 330,
        height: 400,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentSpinner: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        width: 300,
        height: 200,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    textAreaContainerSteps: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        width: '70%',
        borderRadius: 7
    },
    textAreaSteps: {
        height: 80,
        fontSize: 15,
        color: 'white'
    }
});