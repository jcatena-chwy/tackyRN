import React, { PureComponent } from "react";
import { Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, View } from "native-base";


class CityLocationItem extends PureComponent {

    constructor(props){
        super(props);
        this.state = { cityLocItem : this.props.place }
        this._handlePress = this._handlePress.bind(this);
    }
    
    _handlePress = (item) => {
        this.props.changeMapLocationFocus(item.lat, item.lon)
        this.props.hideLocationItem(item.nombre)
    }

    /*_capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
    }*/

    render(){
        return(
            <TouchableOpacity style={styles.item} onPress={() => this._handlePress(this.state.cityLocItem.centroide)}>
                <Icon style={styles.icon} type='MaterialCommunityIcons' name='map-marker-radius'/>
                <View>
                    <Text>
                        {this.state.cityLocItem.nombre}
                    </Text>
                    <Text style={styles.itemAddress}>
                        {this.state.cityLocItem.provincia.nombre}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    item : {
        flex : 1,
        flexDirection : 'row',
        height: 40,
        justifyContent : 'flex-start',
        paddingTop : 3,
        paddingLeft : 3
    },
    icon : {
        fontSize : 28,
        color : 'gray'
    },
    itemInfo : {
        flex : 1,
        flexDirection : 'column'
    },
    itemAddress : {
        color : 'gray'
    }
})

export default CityLocationItem;