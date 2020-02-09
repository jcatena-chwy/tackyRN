import React, { Component } from 'react';
import { Text} from 'react-native';
import { Container, Button, Icon, Item, Input, Content, Left} from 'native-base';
import { View} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
export default class Ingrediente extends Component {
  constructor(props){
    super(props);
    this.state = {
        // rows: ['row 1', 'row 2'],
        rows: [
          { "orden":1, descripcion: "", "id": this.guidGenerator() },
          { "orden":2, descripcion: "" , "id": this.guidGenerator()  },
          { "orden":3, descripcion: "", "id": this.guidGenerator()   }
        ]
    }
    this.handleChange= this.handleChange.bind(this);
    this.addRow = this.addRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
  }

addRow(){ 
  this.state.rows; 
  var r = {};
  r.orden = this.state.rows.length+1;
  r.descripcion = ""
  r.id = this.guidGenerator()
  this.setState({
    rows:[...this.state.rows,r]
  })
}
deleteRow(r){
  if(this.state.rows.length>1){
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

actualizarOrden(){
  debugger;
  var array = [...this.state.rows];
  for(i =0; i<array.length ; i++){
    array[i].orden = i+1;
  }
  this.setState({
    rows: array
  }, () => {
    this.validarCargaIngredientes()
  });
}

handleChange(text, posicion) {
  
  let newArray = [...this.state.rows];
  newArray[posicion-1].descripcion = text
  this.setState({ rows:newArray });
  this.validarCargaIngredientes()
}

validarCargaIngredientes(){
  debugger;
  let newArray = [];
  var ingrediente = {}
  for(i = 0 ; i< this.state.rows.length ; i++){
    if(this.state.rows[i].descripcion != null && this.state.rows[i].descripcion != ""){
      newArray.push(this.state.rows[i])
    }
  }
  if(newArray.length > 0){
    this.props.isIngredientes(true , newArray);
  } else {
    this.props.isIngredientes(false , newArray);
  }
}

guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
 
  render() {
    return (
      <View>
      {this.state.rows.map((r) =>
        <Item key={r.id}>
          <Button  onPress={() => this.deleteRow(r)} transparent textStyle={{color: '#87838B'}}>
            <TextInput style={{ fontSize: 20}}  onChangeText={(text) => this.handleChange(text, r.orden)} placeholder='Cantidad y nombre de ingredientes'/>
            <Icon active name='close'/>
          </Button>
      </Item>
      
        )}  
        <Content>
        <Left>
                <Button onPress={this.addRow} transparent textStyle={{color: '#87838B'}}>
                  <Icon name="add" />
                  <Text style={{ fontSize: 20}}>Ingrediente</Text>
                </Button>
        </Left>
        </Content>
      </View>
    );
  }
}