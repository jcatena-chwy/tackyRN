//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import Mapa from './components/map/Map'
import CookBook from './components/cookBook/CookBook'
import Screen3 from './components/cookBook/CookBookDetail'
import Comments from './components/comments/Comments'
import Paso2 from './components/comments/Paso2'
import Place from './components/stack/Place'
import Detalle from './components/stack/components/Detalle'
import Paso1 from './components/stack/components/Paso1'
import { Ionicons } from '@expo/vector-icons';
import CookBookDetail from './components/cookBook/CookBookDetail'
import DetalleReceta from './components/detalleReceta/DetalleReceta'
import Cargando from './components/detalleReceta/components/Cargando'
import Header from './components/detalleReceta/components/Header'
import NewPlace from './components/newPlace/NewPlace'
import Login from './components/auth/Login'
import SignUp from './components/auth/SignUp'
import ContentComponent from './components/ContentComponent'

class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Ionicons name="ios-menu" size={32} style={{ marginLeft: 10, color: 'white' }} />
        </TouchableOpacity>
      </View>
    );
  }
}

const MainNavigator = createStackNavigator({
  Map: {
    screen: Mapa,
    navigationOptions: ({ navigation }) => ({
      title: 'Tacky',
      headerTitle: (
        <Image style={{ width: 73, height: 73, left: 100 }} source={require('./assets/titleImage.png')} />
      ),
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#e97463',
        height: 73
      },
      headerTintColor: 'black',
    }),
  },
  Place: {
    screen: Place,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Image style={{ width: 73, height: 73, left: 100 }} source={require('./assets/titleImage.png')} />
      ),
      headerBackTitle: '',
      headerStyle: {
        backgroundColor: '#e97463',
        height: 73
      },
    })
  },
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#e43753',
        height: 0,
        borderWidth: 0.1,
        borderColor: 'transparent'
      }
    })
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: '',
      headerStyle: {
        backgroundColor: '#e43753',
        height: 30,
        borderWidth: 0.1,
        borderColor: 'transparent'
      }
    })
  },
  Comments: {
    screen: Comments, navigationOptions: ({ navigation }) => ({
      title: 'Tacky',
      headerTitle: (
        <Image style={{ width: 73, height: 73, left: 100 }} source={require('./assets/titleImage.png')} />
      ),
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#e97463',
        height: 73
      },
      headerTintColor: 'black',
    }),
  },
  Detalle: {
    screen: Detalle, navigationOptions: {
      title: "Tacky",
    }
  },
  Paso2: {
    screen: Paso2, navigationOptions: {
      title: "Tacky",
    }
  },
  Paso1: {
    screen: Paso1, navigationOptions: {
      title: "Tacky",
    }
  },
}, { headerLayoutPreset: 'center' });

const SecondNavigator = createStackNavigator({
  CookBook: {
    screen: CookBook,
    navigationOptions: ({ navigation }) => ({
      title: 'Tacky',
      headerTitle: (
        <Image style={{ width: 73, height: 73, left: 100 }} source={require('./assets/titleImage.png')} />
      ),
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#e97463',
        height: 73
      },
      headerTintColor: 'black',
    }),
  },
  DetalleReceta: {
    screen: DetalleReceta,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Image style={{ width: 73, height: 73, left: 100 }} source={require('./assets/titleImage.png')} />
      ),
      headerBackTitle: '',
      headerStyle: {
        backgroundColor: '#e97463',
        height: 73
      },
    })
  },
  Cargando: {
    screen: Cargando, navigationOptions: {
      headerLeft: null
    }
  },
  Header: {
    screen: Header, navigationOptions: {
      headerLeft: null
    }
  },
  CookBookDetail: {
    screen: CookBookDetail,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Image style={{ width: 73, height: 73, left: 100 }} source={require('./assets/titleImage.png')} />
      ),
      headerBackTitle: '',
      headerStyle: {
        backgroundColor: '#e97463',
        height: 73
      },
    })
  },
}, { headerLayoutPreset: 'center' });

const ThirdNavigator = createStackNavigator({
  NewPlace: {
    screen: NewPlace,
    navigationOptions: ({ navigation }) => ({
      title: 'Tacky',
      headerTitle: (
        <Image style={{ width: 73, height: 73, left: 100 }} source={require('./assets/titleImage.png')} />
      ),
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#e97463',
        height: 73
      },
      headerTintColor: 'black',
    }),
  },
});


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
    backgroundColor: 'red',
    //Sidebar width
    drawerWidth: Dimensions.get('window').width - 130,
  }
);

export default createAppContainer(DrawerNavigatorExample);