import firebase from 'firebase';


const  config = {
  apiKey: "AIzaSyBU9LIUt1XYz5bQYYBbCP6j2YgykHwicYk",
  authDomain: "tesis-celiacos.firebaseapp.com",
  databaseURL: "https://tesis-celiacos.firebaseio.com",
  projectId: "tesis-celiacos",
  storageBucket: "tesis-celiacos.appspot.com",
  messagingSenderId: "64424012176",
  appId: "1:64424012176:web:3769382464fb8181"
  };
firebase.initializeApp(config);

// Leer Datos
var database = firebase.database(); 

// var ref = database.ref("Platos/");
// ref.on("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });


//  // Guardar Datos
//  database.ref("Platos").push({
//    Descripcion:'Lechuga, Doble Carne, Tomate',
//    Nombre: 'Mac Combo',
//    Precio:100,
//    id:2,
//    idRestaurant:2
//  })



export default firebase; 
