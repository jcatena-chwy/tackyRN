//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import Mapa from './components/map/Map'
import CookBook from './components/cookBook/CookBook'
import Screen3 from './components/cookBook/CookBookDetail'
import Comments from './components/comments/Comments'
import Paso2 from './components/comments/Paso2'
import Place from './components/stack/Place'
import { Ionicons } from '@expo/vector-icons';
import CookBookDetail from './components/cookBook/CookBookDetail'
import DetalleReceta from './components/detalleReceta/DetalleReceta'
import NewPlace from './components/newPlace/NewPlace'
import ContentComponent from './components/ContentComponent'

class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Ionicons name="ios-menu" size={32} style={{  marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    );
  }
}

const MainNavigator = createStackNavigator({
  //  Login: { screen: Login},
  Map: {
    screen: Mapa,
    navigationOptions: ({ navigation }) => ({
      title: 'Tacky',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black',
    }),
  },
  Place: { screen: Place, navigationOptions: {
    title: "Tacky",
  } },
  Comments: { screen: Comments, navigationOptions: {
    title: "Tacky",
  }}, 
  Paso2: { screen: Paso2, navigationOptions: {
    title: "Tacky",
  }}, 
}, {headerLayoutPreset: 'center'});

const SecondNavigator = createStackNavigator({ 
  CookBook: { screen: CookBook,
    navigationOptions: ({ navigation }) => ({
      title: 'Tacky',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black',
    }),
  },
  DetalleReceta: { screen: DetalleReceta,
    navigationOptions: {
      title: "Tacky",
      headerLeft: null
    } 
  }, 
  CookBookDetail: { screen: CookBookDetail, navigationOptions: {
    title: "Tacky",
  } },
}, {headerLayoutPreset: 'center'});

const ThirdNavigator = createStackNavigator({ 
  NewPlace: { screen: NewPlace,
    navigationOptions: ({ navigation }) => ({
      title: 'Tacky',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black',
    }),
  },});
 

// https://expo.github.io/vector-icons/
const DrawerNavigatorExample = createDrawerNavigator({
  //Drawer Optons and indexing
  
  Mapa: {
    //Title
    screen: MainNavigator,
    navigationOptions: {
      drawerLabel: 'Mapa',
      drawerIcon: () => <Ionicons name="md-home"></Ionicons>
    },
  },
  CookBook: {
    //Title
    screen: SecondNavigator,
    navigationOptions: {
      drawerLabel: 'Recetario',
      drawerIcon: () => <Ionicons name="ios-menu"></Ionicons>
    },
  },
  NewPlace: {
    screen: ThirdNavigator,
    navigationOptions: {
      drawerLabel: 'Agregar Lugar',
      drawerIcon: () => <Ionicons name="ios-menu"></Ionicons>
    },
  },
},
{
  //For the Custom sidebar menu we have to provide our CustomSidebarMenu
  contentComponent: ContentComponent,
  //Sidebar width
  drawerWidth: Dimensions.get('window').width - 130,
}
);
 
export default createAppContainer(DrawerNavigatorExample);