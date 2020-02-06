import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Mapa from './components/map/Map'
import Place from './components/stack/Place'
import Comments from './components/comments/Comments'
import Home from './components/prueba/Home'
import CookBook from './components/cookBook/CookBook'
import DetalleReceta from './components/detalleReceta/DetalleReceta'
import Footer from './components/footer/Footer'
import Profile from './components/prueba/Profile'
import Login from './components/auth/Login'
const MainNavigator = createStackNavigator({
  //  Login: { screen: Login},
  DetalleReceta: { screen: DetalleReceta,
    navigationOptions: {
      title: "Tacky",
      headerLeft: null
    } 
  },
  Comments: { screen: Comments, navigationOptions: {
    title: "Tacky",
  }},
  Map: { screen: Mapa,
    navigationOptions: {
      title: "Tacky",
      headerLeft: null
    }
  },
  Footer: { screen: Footer },
  Place: { screen: Place, navigationOptions: {
    title: "Tacky",
  } },
  Home: { screen: Home},
  CookBook: { screen: CookBook, navigationOptions: {
    title: "Tacky",
  }},
  Profile: { 
      screen: Profile,
      navigationOptions: {
        title: "FirstPage",
        headerLeft: null
      }    
  }, 
}, {headerLayoutPreset: 'center'}); 
 
const App = createAppContainer(MainNavigator);

export default App;