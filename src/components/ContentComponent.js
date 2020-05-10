import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { width: WIDTH } = Dimensions.get('window')
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
    goToSreen(item, key) {
        this.props.navigation.navigate(item.screenToNavigate )
    }
    render() {
        return (
            <View style={styles.sideMenuContainer}>
                <Text style={styles.logoText}>Tacky</Text>
                <View style={{ width: '100%' }}>
                    {this.items.map((item, key) => (
                        <View
                            key={key}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: '#d27064',
                                marginBottom: 5,
                            }}>
                            <View style={{ marginRight: 10, marginLeft: 20 }}>
                                <Ionicons name={item.navOptionThumb} size={32} style={{ marginLeft: 10, color:'white' }} />
                            </View>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: 'white',
                                }}
                                onPress={() => {
                                   this.goToSreen(item, key)
                                }}>
                                {item.navOptionName}
                            </Text>
                        </View>
                    ))}
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 10 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styles.btnLogin}>
                        <Text style={styles.text}>Salir</Text>
                    </TouchableOpacity>
                </View>

            </View> 
        );
    }
}

const styles = StyleSheet.create({
    logoText: {
        color: 'white',
        fontSize: 30,
        fontWeight: '800',
        marginTop: 10,
        opacity: 0.5,
        marginBottom: 50
    },
    btnLogin: {
        width: 55,
        height: 35,
        borderRadius: 25,
        fontSize: 16,
        backgroundColor: 'transparent',
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderColor: 'white',
        borderWidth: 1
    },
    text: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center'
    },
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#d27064',
        alignItems: 'center',
        paddingTop: 20,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 150 / 2,
    },
});