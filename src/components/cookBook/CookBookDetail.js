import React, { Component } from 'react';
import { TextInput, Text, TouchableHighlight, View, StyleSheet, Image, Dimensions, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, CardItem } from 'native-base';
import firebase from '../../config';
import Modal from "react-native-modal";
import { YellowBox } from 'react-native';
const { width } = Dimensions.get("window");
import _ from 'lodash';
import bgImage from '../../assets/fondoDePantalla.jpg'
YellowBox.ignoreWarnings(['Setting a timer']);
YellowBox.ignoreWarnings(['Warning']);
YellowBox.ignoreWarnings(['Remote']);
import { Container, Spinner, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button, Icon, Input, Item } from 'native-base';
export default class CookBookDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            textoImagen: false,
            isModalVisible: false,
            textInput: "",
            stepsImage: [],
            cantPhotos: 0,
            cantCall: 0,
            viewImage: false,
            imagenSeleccionada: "",
            receta: this.props.navigation.state.params.receta
        }
        this.cargarReceta = this.cargarReceta.bind(this);
        this.isLongString = this.isLongString.bind(this);
        this.visualizarFoto = this.visualizarFoto.bind(this);
        this.toggleModal = this.toggleModal.bind(this)
    }
    componentWillMount() {
        this.state
        this.setState({
            isModalVisibleSpinner: !this.state.isModalVisibleSpinner
        }, () => {
            this.cargarReceta()
        });
    }

    cargarReceta() {
        console.log("La receta es: " + this.state.receta)
        for (var key in this.state.receta.ingredients) {
            var obj = this.state.receta.ingredients[key];
            if (key != "cantidad")
                this.state.textInput = this.state.textInput + obj.description + "\n"
        }
        var steps = []
        var stepImage = []
        var cantPhotos = 0;
        var jsonStep = {
            description: {},
            photos: []
        }
        i = 0;
        j = 0;
        for (var key in this.state.receta.steps) {
            var step = this.state.receta.steps[key];
            if (step.description != null && step.description != "") {
                jsonStep.Isdescription = true
                jsonStep.description = step.description
            } else {
                jsonStep.Isdescription = false
            }
            for (var key in step.photos) {
                var photo = step.photos[key];
                if (photo.flag) {
                    jsonStep.photos[j] = photo
                    cantPhotos = cantPhotos + 1;
                }
                j++
            }
            steps[i] = jsonStep;
            i++
            j = 0;
            jsonStep = {
                description: {},
                photos: []
            }
        }
        this.setState({ stepsImage: steps, cantPhotos: cantPhotos });
        setTimeout(() => {
            var arrayPhotos = this.state.stepsImage;
            var imagenLess = true;
            for (f = 0; f < this.state.stepsImage.length; f++) {
                var arrayPositionPhotos = this.state.stepsImage[f]
                for (i = 0; i < arrayPositionPhotos.photos.length; i++) {
                    if (arrayPositionPhotos.photos[i] != null || arrayPositionPhotos.photos[i] != undefined) {
                        imagenLess = false
                        this.uploadImage(arrayPositionPhotos.photos[i].name, this.state.receta.title)
                    }
                }
            }
            if (imagenLess) {
                this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner });
            }
        }, 100)
    }

    isLongString(string) {
        var str = string;
        var res = str.split(" ");
        maxStringForRow = ""
        stringFinished = []
        cant = 0
        stringFinished[0] = res[0]
        for (i = 1; i < res.length; i++) {
            maxStringForRow = res[i]
            if ((stringFinished[cant].length + maxStringForRow.length) > 20) {
                cant++
                stringFinished[cant] = maxStringForRow
            } else {
                stringFinished[cant] = stringFinished[cant] + maxStringForRow
            }
        }
        return res
    }

    uploadImage = async (imageName, title) => {
        var ref = firebase.storage().ref("images/ImageRecipe/" + title + "/" + "Steps" + "/" + imageName).getDownloadURL()
            .then(resolve => {
                console.log(imageName)
                let newArray = [...this.state.stepsImage];
                for (f = 0; f < this.state.stepsImage.length; f++) {
                    var arrayPositionPhotos = this.state.stepsImage[f]
                    for (i = 0; i < arrayPositionPhotos.photos.length; i++) {
                        if (arrayPositionPhotos.photos[i] != null || arrayPositionPhotos.photos[i] != undefined) {
                            if (arrayPositionPhotos.photos[i].name == imageName) {
                                newArray[f].photos[i].image = resolve
                            }
                        }
                    }
                }
                var modifyRecipe = this.state.receta
                modifyRecipe.steps = newArray
                contador = this.state.cantCall + 1;
                this.setState({
                    receta: modifyRecipe,
                    cantCall: contador
                }, () => {
                    if (this.state.cantCall == this.state.cantPhotos) {
                        this.setState({
                            stepsImage: newArray
                        }, () => {
                            contador = 0;
                            let newArray = [...this.state.stepsImage];
                            while (contador < this.state.stepsImage.length) {
                                newArray[contador].orden = contador + 1;
                                contador++
                            }
                            var modifyRecipe = this.state.receta
                            modifyRecipe.steps = newArray
                            this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner, stepsImage: newArray });
                        });
                    }
                });
            })
            .catch(error => {
                console.log(error)
            })
    }

    visualizarFoto(photo) {
        this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner, viewImage: true, imagenSeleccionada: photo.image });
    }
    toggleModal() {
        this.setState({ isModalVisibleSpinner: !this.state.isModalVisibleSpinner, viewImage: false, imagenSeleccionada: "" });
    }

    render() {
        return (
            <ImageBackground source={bgImage} source={bgImage} style={styles.containerMain}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 15 }}
                >
                    <View isVisible={this.state.contenido} style={styles.containerMain}>
                        <View showsHorizontalScrollIndicator={false} style={styles.containerSecundary}>
                            <ImageBackground source={bgImage} style={styles.containerThrid}>
                                <Image source={{ uri: this.state.receta.imageName }} style={styles.image} />
                            </ImageBackground>
                            <View style={styles.containerText}>
                                <Text style={styles.titleText}>{this.state.receta.title}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        {this.state.receta.ingredients.cantidad != undefined && <Text style={{ color: 'white', fontSize: 16 }}>{this.state.receta.time + " "}</Text>}
                                        {(this.state.receta.time != undefined && this.state.receta.time != '') && <Icon style={{ color: 'white', fontSize: 16 }} name="time" />}
                                        {this.state.receta.ingredients.cantidad != undefined && <Text style={{ color: 'white', fontSize: 16 }}>{"   " + this.state.receta.ingredients.cantidad + " Ingredientes"}</Text>}
                                </View>
                            </View>
                            <ImageBackground source={bgImage} style={styles.containerVer}>
                                <View style={styles.ingredientsView}>
                                    <Text style={styles.ingredientsText}>Ingredientes</Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={styles.textAreaContainer} >
                            <TextInput
                                textAlignVertical="top"
                                style={styles.textArea}
                                underlineColorAndroid="transparent"
                                value={this.state.textInput}
                                placeholderTextColor="white"
                                numberOfLines={10}
                                multiline={true}
                                editable={false}
                            />
                        </View>
                        <Text style={{ fontSize: 20, bottom: 10, marginTop: 10, color: 'white' }}>Preparación</Text>

                        {this.state.stepsImage.map((step, index) =>
                            <Card key={index} style={{ width: 350, borderRadius: 20, borderWidth: 1, overflow: 'hidden', borderColor: 'white' }}>
                                <ImageBackground source={bgImage} style={styles.backgroundContainer}
                                    style={{
                                        height: 230, borderRadius: 20, borderWidth: 1,
                                        overflow: 'hidden', borderColor: 'white',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <View style={{
                                        flexDirection: 'row', justifyContent: 'center',
                                        alignItems: 'center', top: 5
                                    }}>
                                        <TouchableHighlight
                                            style={{
                                                borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                                                width: Dimensions.get('window').width * 0.09,
                                                height: Dimensions.get('window').width * 0.09,
                                                backgroundColor: '#e23f52',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            underlayColor='#ccc'
                                        >
                                            <Text style={{ color: 'white' }}>{index + 1}</Text>
                                        </TouchableHighlight>
                                        <View style={styles.textAreaContainerSteps} >
                                            <TextInput
                                                style={styles.textAreaSteps}
                                                underlineColorAndroid="transparent"
                                                value={step.description}
                                                placeholderTextColor="grey"
                                                numberOfLines={10}
                                                editable={false}
                                                multiline={true}
                                            />
                                        </View>
                                    </View>
                                    {step.Isdescription ? (
                                        <CardItem style={{ backgroundColor: 'transparent' }} >
                                            <ScrollView
                                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                showsVerticalScrollIndicator={false}
                                            >
                                                {step.photos.map((photo) =>
                                                    <Item key={photo.photo} >
                                                        <TouchableHighlight onPress={() => this.visualizarFoto(photo)} >
                                                            <Image
                                                                source={{ uri: photo.image }}
                                                                style={{ width: 80, height: 80, right: 5, bottom: 5, borderRadius: 5, overflow: 'hidden' }}
                                                            />
                                                        </TouchableHighlight>
                                                    </Item>
                                                )}
                                            </ScrollView>
                                        </CardItem>
                                    ) : (
                                            <CardItem style={{ backgroundColor: 'transparent' }} >
                                                <ScrollView
                                                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                                    horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                >
                                                    {step.photos.map((photo) =>
                                                        <Item key={photo.photo} >
                                                            <TouchableHighlight >
                                                                <Image
                                                                    source={{ uri: photo.image }}
                                                                    style={{ width: 80, height: 80, right: 5, bottom: 5, borderRadius: 5, overflow: 'hidden' }}
                                                                />
                                                            </TouchableHighlight>
                                                        </Item>
                                                    )}
                                                </ScrollView>
                                            </CardItem>
                                        )}
                                </ImageBackground>
                            </Card>
                        )}

                    </View>
                </ScrollView>
                <Modal style={styles.containerModal} isVisible={this.state.isModalVisibleSpinner} >
                    {!this.state.viewImage && <View style={styles.contentModal}>
                        <Spinner color='red' />
                    </View>}
                    {this.state.viewImage &&
                        <View style={styles.contentModal}>
                            <Image source={{ uri: this.state.imagenSeleccionada }} style={{ width: 200, height: 200, marginTop: 10 }}></Image>
                            <Body>
                                <Button danger style={{ width: 90, marginTop: 10, flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={this.toggleModal}>
                                    <Text style={{ fontSize: 20, color: "white" }}>Cerrar</Text>
                                </Button>
                            </Body>
                        </View>}
                </Modal>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    containerModal: {
        shadowRadius: 10,
        width: 280,
        height: 280,
        left: 30
    },
    contentModal: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        width: 280,
        height: 300,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    containerMain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textAreaContainer: {
        left: 6,
        borderColor: '#ccc9bc',
        borderWidth: 1,
        height: 120,
        padding: 5,
        width: '90%',
        borderRadius: 7,
        marginBottom: 10,
        marginTop: 10
    },
    textArea: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'justify'
    },
    containerSecundary: {
        backgroundColor: '#ea8073',
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width: 250,
        height: 280,
    },
    containerThrid: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 30,
        width: 180,
        height: 180,
        overflow: "hidden",
    },
    containerText: {
        width: 'auto',
        height: 'auto',
        padding: 5
    },
    containerVer: {
        borderRadius: 20,
        overflow: "hidden",
        borderColor: 'white',
        borderWidth: 3,
        top: 15
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 20,
        alignItems: "center"
    },
    ingredientsView: {
        width: 100,
        overflow: "hidden",
        borderRadius: 20
    },
    containerSection1: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        width: 350,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    containerSection2: {
        backgroundColor: '#a1998e',
        borderColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        width: 250,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    containerAddRecetaDetalle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerSearchReceta: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
    },
    textAddReceta: {
        marginLeft: 5,
        color: 'white'
    },
    titleText: {
        fontSize: 18,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    },
    textAreaContainerSteps: {
        marginLeft: 5,
        width: '80%',
    },
    textAreaSteps: {
        fontSize: 12,
        color: 'white',
    },
    ingredientsText: {
        fontSize: 15,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        marginVertical: 2
    }
}); 