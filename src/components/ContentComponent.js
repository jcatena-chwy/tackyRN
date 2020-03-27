import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default class ContentContainer extends Component {
    constructor() {
        super();
        this.items = [
            {
                navOptionThumb: 'ios-map',
                navOptionName: 'Mapa',
                screenToNavigate: 'Mapa',
            },
            {
                navOptionThumb: 'ios-restaurant',
                navOptionName: 'Recetario',
                screenToNavigate: 'CookBook',
            },
            {
                navOptionThumb: 'ios-paper-plane',
                navOptionName: 'Agregar Lugar',
                screenToNavigate: 'NewPlace',
            },
        ];
    }
    render() {
        return (
            <View style={styles.sideMenuContainer}>
                <Image style={{width: 50, height: 50}} source={require('../assets/logoApp.png')} />
                <View style={{ width: '100%' }}>
                    {this.items.map((item, key) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
                            }}>
                            <View style={{ marginRight: 10, marginLeft: 20 }}>
                            <Ionicons name={item.navOptionThumb} size={32} style={{  marginLeft: 10 }} />
                            </View>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: global.currentScreenIndex === key ? 'red' : 'black',
                                }}
                                onPress={() => {
                                    global.currentScreenIndex = key;
                                    this.props.navigation.navigate(item.screenToNavigate);
                                }}>
                                {item.navOptionName}
                            </Text>
                        </View>
                    ))}
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },
    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 150 / 2,
    },
});