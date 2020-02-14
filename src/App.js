import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Mapa from './components/map/Map'
import Place from './components/stack/Place'
import Comments from './components/comments/Comments'
import Home from './components/prueba/Home'
import CookBook from './components/cookBook/CookBook'
import CookBookDetail from './components/cookBook/CookBookDetail'
import DetalleReceta from './components/detalleReceta/DetalleReceta'
import Footer from './components/footer/Footer'
import Profile from './components/prueba/Profile'
import Login from './components/auth/Login'
const MainNavigator = createStackNavigator({
  //  Login: { screen: Login},
  CookBook: { screen: CookBook, navigationOptions: {
    title: "Tacky",
  }},
  CookBookDetail: { screen: CookBookDetail, navigationOptions: {
    title: "Tacky",
  } },
  DetalleReceta: { screen: DetalleReceta,
    navigationOptions: {
      title: "Tacky",
      headerLeft: null
    } 
  },
  Map: { screen: Mapa,
    navigationOptions: {
      title: "Tacky",
      headerLeft: null
    }
  },
  Comments: { screen: Comments, navigationOptions: {
    title: "Tacky",
  }},
  Footer: { screen: Footer },
  Place: { screen: Place, navigationOptions: {
    title: "Tacky",
  } },
  Home: { screen: Home},
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