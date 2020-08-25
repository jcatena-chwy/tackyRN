import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, Dimensions, View, TextInput } from 'react-native';
import { Container, Button, Icon, Item, Input, Content, Left } from 'native-base';
import { YellowBox } from 'react-native';
import _ from 'lodash';
const { width: WIDTH } = Dimensions.get('window')

YellowBox.ignoreWarnings(['Setting a timer']);
export default class Ingrediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // rows: ['row 1', 'row 2'],
      rows: [
        { "orden": 1, description: "", "id": this.guidGenerator() },
        { "orden": 2, description: "", "id": this.guidGenerator() },
        { "orden": 3, description: "", "id": this.guidGenerator() }
      ]
    }
    this.handleChange = this.handleChange.bind(this);
    this.addRow = this.addRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
  }

  addRow() {
    this.state.rows;
    var r = {};
    r.orden = this.state.rows.length + 1;
    r.description = ""
    r.id = this.guidGenerator()
    this.setState({
      rows: [...this.state.rows, r]
    })
  }
  deleteRow(r) {
    if (this.state.rows.length > 1) {
      var array = [...this.state.rows]; // make a separate copy of the array
      var index = array.indexOf(r)
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({
          rows: array
        }, () => {
          this.actualizarOrden()
        });
      }
    }
  }

  actualizarOrden() {
    var array = [...this.state.rows];
    for (i = 0; i < array.length; i++) {
      array[i].orden = i + 1;
    }
    this.setState({
      rows: array
    }, () => {
      this.validarCargaIngredientes()
    });
  }

  handleChange(text, posicion) {

    let newArray = [...this.state.rows];
    newArray[posicion - 1].description = text
    this.setState({ rows: newArray });
    this.validarCargaIngredientes()
  }

  validarCargaIngredientes() {
    let newArray = [];
    for (i = 0; i < this.state.rows.length; i++) {
      if (this.state.rows[i].description != null && this.state.rows[i].description != "") {
        newArray.push(this.state.rows[i])
      }
    }
    if (newArray.length > 0) {
      this.props.isIngredientes(true, newArray);
    } else {
      this.props.isIngredientes(false, newArray);
    }
  }

  guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {this.state.rows.map((r) =>
          <View key={r.id}>
            <TouchableOpacity onPress={() => this.deleteRow(r)} style={styles.btnLogin}>
              <View style={{ flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', }}>
                <TextInput style={{ fontWeight: '400', fontSize: 15, color: 'white', marginRight: 5 }} onChangeText={(text) => this.handleChange(text, r.orden)} placeholder='Cantidad y nombre de ingredientes' placeholderTextColor='#e1e1e1'/>
                <Icon style={{ color: 'white', fontSize: 15}} active name='close' />
              </View>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={this.addRow} style={styles.btnAdd}>
          <View style={{ flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', }}>
            <Icon name="add" style={{ color: 'white', fontSize: 15, marginRight: 5}} />
            <Text style={{ fontWeight: '400', fontSize: 15, color: 'white' }}>Ingredientes</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnLogin: {
    width: WIDTH - 35,
    height: 35,
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: 20,
    borderColor: 'white',
    borderWidth: 1
  },
  btnAdd: {
    width: WIDTH - 150,
    height: 35,
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginTop: 20,
    borderColor: 'white',
    borderWidth: 1
  },

})