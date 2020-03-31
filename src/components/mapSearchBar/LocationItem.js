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
        /*const res = await this.props.fetchDetails(this.props.place_id)
        
        Alert.alert(JSON.stringify(res))*/
        this.props.changeMapLocationFocus(item.latitude, item.longitude)
    }

    render(){
        return(
            <TouchableOpacity style={styles.item} onPress={() => this._handlePress(this.state.locItem)}>
                { this.state.locItem.type == 'Restaurant' ? 
                    <Icon style={styles.icon} type='MaterialCommunityIcons' name='silverware-fork'/> : 
                    <Icon style={styles.icon} type='MaterialCommunityIcons' name='store'/>}
                <View>
                    <Text>
                        {this.state.locItem.name}
                    </Text>
                    <Text style={styles.itemAddress}>
                        {this.state.locItem.address}
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

export default LocationItem;