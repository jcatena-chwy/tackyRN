import React, { Component } from 'react';
import { 
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    FlatList,
    Alert,
} from 'react-native';
import LocationItem from "./LocationItem";
import CityLocationItem from "./CityLocationItem";
import { Checkbox } from 'galio-framework'

const WIDTH = Dimensions.get('window').width;

export default class MapSearchBar extends Component{

    constructor(props){
        super(props);
        const citiesFromJSON = require('../mapSearchBar/ArgCities.json').localidades;

        this.state = { 
            lugares : this.props.places,
            lugaresBack : this.props.places, 
            showLocationItem : false, 
            textInputValue : "", 
            searchByCities : true,
            localidades :  citiesFromJSON,
            localidadesBack :  citiesFromJSON}
        
        this.hideLocationItem = this.hideLocationItem.bind(this);
        this.filterResults = this.filterResults.bind(this);
        this._changeSearchToCities = this._changeSearchToCities.bind(this);
    }

    componentWillReceiveProps(someProp) {
        this.setState( { lugares : someProp.places, lugaresBack : someProp.places})
    }
    filterResults(event = {}) {
        if(this.state.searchByCities){
            if(event != ""){
                var filteredList = this.state.localidadesBack.filter(function (place) {
                    return place.nombre.toUpperCase().includes(event.toUpperCase())
                });
                this.setState({
                    localidades : filteredList,
                    showLocationItem: true,
                    textInputValue: event
                });
            } else {
                this.setState({
                    localidades : this.state.localidadesBack,
                    showLocationItem: false,
                    textInputValue: event
                });
            }
        }else{
            if(event != ""){
                var filteredList = this.state.lugaresBack.filter(function (place) {
                    return place.name.toUpperCase().includes(event.toUpperCase())
                });
                this.setState({
                    lugares : filteredList,
                    showLocationItem: true,
                    textInputValue: event
                });
            } else {
                this.setState({
                    lugares : this.state.lugaresBack,
                    showLocationItem: false,
                    textInputValue: event
                });
            }
        }
    };

    hideLocationItem(name){
        this.setState({
            showLocationItem: false,
            textInputValue: name
        });
    }

    _changeSearchToCities = () => {      
        this.setState({ searchByCities : !this.state.searchByCities });
    }

    render(){
        return(
            <View style={{position : 'absolute', top : 10}}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{width: (WIDTH-40), height: 10}}>

                    </View>
                    <View style={{width: (WIDTH-40), height: 50, borderRadius:25,}}>
                        <View style={styles.container}>
                            <View style={styles.leftCol}>
                                <Text style={{fontSize : 8}}>{'\u25A0'}</Text>
                            </View>
                            <View style={styles.centerCol}>
                                <TextInput  style={{fontSize : 15, fontWeight: '800', color : '#545454'}} 
                                            placeholder="¿A dónde quieres ir?"
                                            value={this.state.textInputValue}
                                            onChangeText={this.filterResults}
                                            />
                            </View>
                            <View style={styles.rightCol}>
                                <Checkbox color="warning"  onChange={() => this._changeSearchToCities()} label="Localidad" labelStyle={{fontSize : 14}}/>
                            </View>
                        </View>
                    </View>
                    { this.state.showLocationItem && 
                    <View style={{width: (WIDTH-40), height: 50, paddingTop : 20}}>
                        <View style={styles.resultList}>
                            {this.state.searchByCities ? 
                                <FlatList
                                data={this.state.localidades}
                                renderItem={({ item }) => <CityLocationItem hideLocationItem={this.hideLocationItem}  place={item} changeMapLocationFocus={this.props.changeMapLocationFocus}/>}
                                keyExtractor={item => item.id}
                                /> 
                                :
                                <FlatList
                                    data={this.state.lugares}
                                    renderItem={({ item }) => <LocationItem hideLocationItem={this.hideLocationItem}  place={item} changeMapLocationFocus={this.props.changeMapLocationFocus}/>}
                                    keyExtractor={item => item.id}
                                />                     
                            }
                        </View>
                    </View>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        zIndex : 9,
        position : 'absolute',
        flexDirection : 'row',
        width : (WIDTH-40),
        height : 50,
        borderRadius : 3,
        backgroundColor : 'white',
        alignItems : 'center',
        shadowColor : '#000000',
        borderRadius:25,
        elevation : 7,
        shadowRadius : 5,
        shadowOpacity : 0.5
    },
    leftCol : {
        flex : 1,
        alignItems : 'center'
    },
    centerCol : {
        flex : 4
    },
    rightCol : {
        flex : 2,
        right: 6,
        borderColor : '#ededed'
    },
    resultList : {
        width: (WIDTH-40),
        height: 200,
        backgroundColor: 'white',
        borderColor : 'black',
        zIndex : 9,
        borderRadius : 3,
        shadowColor : '#000000',
        elevation : 7,
        shadowRadius : 5,
        shadowOpacity : 0.5
    }
 })