import React, { PureComponent } from "react";
import { Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, View } from "native-base";


class LocationItem extends PureComponent {

    constructor(props){
        super(props);
        this.state = { locItem : this.props.place }
        this._handlePress = this._handlePress.bind(this);
    }
    
    _handlePress = (item) => {
        this.props.changeMapLocationFocus(item.latitude, item.longitude, item.id)
        this.props.hideLocationItem(item.name)
    }

    render(){
        return(
            <TouchableOpacity style={styles.item} onPress={() => this._handlePress(this.state.locItem)}>
                { this.state.locItem.type == 'Restaurant' ? 
                    <Icon style={styles.forkIcon} type='MaterialCommunityIcons' name='silverware-fork'/> : 
                    <Icon style={styles.storeIcon} type='MaterialCommunityIcons' name='store'/>}
                <View>
                    <Text>
                        {this.state.locItem.name}
                    </Text>
                    <Text style={styles.itemAddress}>
                        {this.state.locItem.address + ', ' + this.state.locItem.city + ', ' + this.state.locItem.province}
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
    forkIcon : {
        fontSize : 28,
        color : 'red'
    },    
    storeIcon : {
        fontSize : 28,
        color : '#008080'
    },
    itemInfo : {
        flex : 1,
        flexDirection : 'column'
    },
    itemAddress : {
        color : 'gray',
        fontSize: 10
    }
})

export default LocationItem;