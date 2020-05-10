import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
export default class Loading extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <View>
                <Text >Cargando</Text>
            </View> 
        );
    }
}

