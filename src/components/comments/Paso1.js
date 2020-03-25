import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, Image, View } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Button, Textarea, Form, Icon } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
export default class Paso1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      imagentexto: false,
      comentario: "",
      textComentario: this.props.textComentario,
      contenidoTexto: this.props.infoPaso1.text === '' ? '' : this.props.infoPaso1.textoPaso1
    }
    this.seleccionoFoto = this.seleccionoFoto.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.validarCampos = this.validarCampos.bind(this)
  }
  componentDidMount() {
    this.getPermissionAsync();
    if (this.props.infoPaso1.text === undefined) return
    if (this.props.infoPaso1.text !== '') {
      this.setState({ contenidoTexto: this.props.infoPaso1.text });
    }
  }

  componentWillUnmount() {
    this.setState({ contenidoTexto: '' });
  }

  seleccionoFoto() {
    if (this.state.image != null) {
      this.setState({ imagentexto: this.props.image });
      this.props.sendDataImage(this.state.image);
    } else {
      this.setState({ imagentexto: this.props.image });
      this.props.sendDataImage(this.state.image);
    }
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.seleccionoFoto()
    }
  };

  handleChange(event = {}) {
    if (event == "" || event == null) {
      this.props.sendDataText(false, event);
      this.setState({ textComentario: true, contenidoTexto: '' });
    } else {
      this.props.sendDataText(true, event);
      this.setState({ textComentario: false, contenidoTexto: event });
    }
  }
  handleChange2(event = {}) {
    if (event == "" || event == null) {
    } else {
      this.setState({ textComentario: false });
    }
  }

  toggleModal() {
    this.props.cerrarModal()
  }

  validarCampos() {
    if (this.state.contenidoTexto === '') {
      this.setState({ textComentario: true });
    } else {
      this.setState({ textComentario: false });
    }
    this.props.validarCampos();
  }

  render() {
    let { image } = this.state;
    return (
      <Container>
        <Content>
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail source={{ uri: "https://img.fifa.com/image/upload/t_l4/v1568781948/gzuddxhx4evpfd5q5ean.jpg" }} />
              </Left>
              <Body>
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder="Escribir..."
                  placeholderTextColor="grey"
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={this.handleChange}
                  value={this.state.contenidoTexto}
                />
                {this.state.textComentario && <Text onChangeText={this.handleChange2} style={styles.textStyleAlert}> Por favor ingrese un texto </Text>}
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
          </List>
          {!image && <Icon active name='image' onPress={this._pickImage} style={styles.navBarLeftButton} />}
          {!image && <Text style={{ fontSize: 20 }}>Publicar una foto </Text>}
          {this.props.image && <Text style={styles.textStyleAlert}> Por favor ingrese una imagen </Text>}
          {image &&
            <Image source={{ uri: image }} style={{ width: 200, height: 180, marginLeft: 30 }} />}
          <View style={styles.container2}>
            <View style={styles.buttonContainer}>
              <Button style={{ float: 'right', marginLeft: 30 }} danger onPress={this.toggleModal}>
                <Text style={styles.TextStyle} >Cerrar</Text>
              </Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button style={{ float: 'right', marginLeft: 25, marginRight: 5 }} success onPress={this.validarCampos}>
                <Text style={styles.TextStyle} onPress={this.validarCampos} >Siguiente</Text>
              </Button>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  textAreaContainer: {
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 50,
    justifyContent: "flex-start"
  },
  navBarLeftButton: {
    paddingLeft: 100,
    fontSize: 80
  },
  textStyleAlert: {
    color: "red"
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 60
  },
  buttonContainer: {
    flex: 1,
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
