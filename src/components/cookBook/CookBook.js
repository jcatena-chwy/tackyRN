import React, { Component } from 'react';
import recetas from '../request/recetas.json'
import { Text,SearchBar} from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Left, Body, Right, Button,Icon,Input, Item } from 'native-base';
export default class CookBook extends Component {
    constructor() {
        super();
        this.state = { 
          plate:recetas.recetario, 
          data: [],
          dataBackup  : [],
        }
        this.filtrarLista = this.filtrarLista.bind(this);
    }
    
    filtrarLista = (nombre) => {
        texto = nombre.nativeEvent.text.toLowerCase();
        if(texto!= ""){
            var plate = this.state.plate.filter(function (plate) {
                return plate.nombre.toLowerCase().match(texto)
            });
            this.setState({
                plate
            });
        } else {
            this.setState({
                plate:recetas.recetario
            });
        }
    }
    render() { 
        const navigation = this.props.navigation;
        return (
        <Container> 
            <Header />
           
            <Content>
             <Item>
                <Input placeholder='Buscá productos por nombre' onChange={text => this.filtrarLista(text)}/>
                <Button  onPress={this.filtrarLista}>
                    <Icon name="search"/>
                </Button>
                </Item> 
           
            <List>
            {this.state.plate.map((plato) =>
                <ListItem key={plato.id} thumbnail>
                <Left>
                    <Thumbnail square source={{ uri: plato.image}} />
                </Left>
                <Body>
                    <Text>{plato.nombre}</Text>
                    <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>View</Text>
                    </Button>
                </Right>
                </ListItem>
            )}
            </List>
            </Content>
            
                <Button full primary onPress={() => navigation.navigate('DetalleReceta')}>
                    <Icon active name="ios-add-circle" />
                    <Text>Agrega tu Receta</Text>
                </Button>
            
        </Container>
        );
    }
}