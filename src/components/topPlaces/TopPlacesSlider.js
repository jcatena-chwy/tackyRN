import React, { Component } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Rating } from 'react-native-ratings';
import firebase from '../../config';
import StarRating from './StarRating';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 180;
const CARD_WIDTH = width * 0.6;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default class TopPlacesSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            places: this.props.places,
            topPlaces: []
        }
        this.topScores = [];
        this.scoresIds = [];
        this.placeImageMap = [];
        this.getTopPlaces = this.getTopPlaces.bind(this);
        this.filterTopPlaces = this.filterTopPlaces.bind(this);
        this.orderTopPlacesArray = this.orderTopPlacesArray.bind(this);
        this.retrievePlaceImages = this.retrievePlaceImages.bind(this);
        this._handlePress = this._handlePress.bind(this);
    }

    componentWillReceiveProps(someProps) {
        this.setState({ places: someProps.places })
    }

    componentWillMount() {
        this.getTopPlaces();

    }

    componentDidMount() {
        setTimeout(() => {
            this.filterTopPlaces();
        }, 2000);
    }

    getTopPlaces() {
        const db2 = firebase.database().ref('Scores')
        db2.orderByChild('averageScore')
            .limitToLast(5)
            .once('value')
            .then(snapshot => {
                snapshot.forEach(child => {
                    this.topScores = this.topScores.concat([child.val()])
                });
                this.topScores = this.topScores.reverse();
            });
    }

    filterTopPlaces() {
        this.topScores.forEach(score => this.scoresIds = this.scoresIds.concat([score.id]));
        var filteredPlaces = this.state.places.filter(place => this.scoresIds.includes(place.score))
        this.orderTopPlacesArray(filteredPlaces)
    }

    retrievePlaceImages = async (place) => {
        firebase.storage().ref("images/ImageEstablecimiento/" + place.name + "/" + place.image).getDownloadURL()
        .then(resolve => {
            this.placeImageMap[place.id] = resolve;
        })
        .catch(error => {
            console.log("Error retrieving image when rendering TopPlacesSlider: ", error)
        })
    }

    orderTopPlacesArray(filteredPlaces) {
        let orderedArray = []
        let placesWrapper = []
        for (let i = 0; i < this.scoresIds.length; i++) {
            filteredPlaces.forEach(place => {
                if (place.score === this.scoresIds[i]) {
                    orderedArray = orderedArray.concat([place])
                }
            })
        }
        if (orderedArray.length > 0) {
            for (let i = 0; i < 5; i++) {
                placesWrapper = placesWrapper.concat([{
                    id: orderedArray[i].id,
                    name: orderedArray[i].name,
                    type: orderedArray[i].type,
                    lat: orderedArray[i].latitude,
                    lon:orderedArray[i].longitude,
                    averageScore: this.topScores[i].averageScore,
                    image: this.retrievePlaceImages(orderedArray[i])
                }])
            }
            setTimeout(() => {
                this.setState({ topPlaces: placesWrapper })
            }, 3000);

        }
    }

    _handlePress = (place) => {
        this.props.changeMapLocationFocus(place.lat, place.lon, place.id);
    }

    render() {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
            >
            {this.state.topPlaces.map((place, index) =>
                <View style={styles.card} key={index}>
                    <Image
                        source={{ uri: this.placeImageMap[place.id] }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    <View style={styles.textContent}>
                        <Text numberOfLines={1} style={styles.cardtitle}>{place.name}</Text>
                        <StarRating ratings={place.averageScore}/>
                        {/*<Text numberOfLines={1} style={styles.cardDescription}>{place.type}</Text>*/}
                        <View style={styles.button}>
                            <TouchableOpacity
                                onPress={() => this._handlePress(place)}
                                style={[styles.signIn, {
                                    borderColor: '#FF6347',
                                    borderWidth: 1
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#FF6347'
                                }]}>Ir al establecimiento</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                )}
            </ScrollView>
            )
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        marginTop: 5
    },
    scrollView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    card: {
        elevation: 2,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 2,
        padding: 10,
    },
    cardtitle: {
        fontSize: 12,
        fontWeight: "bold",
    },
    signIn: {
        width: '100%',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
    },
    textSign: {
        fontSize: 14,
        fontWeight: 'bold'
    }
});