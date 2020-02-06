import firebase from 'firebase';


var firebaseConfig = {
  apiKey: "AIzaSyBU9LIUt1XYz5bQYYBbCP6j2YgykHwicYk",
  authDomain: "tesis-celiacos.firebaseapp.com",
  databaseURL: "https://tesis-celiacos.firebaseio.com",
  projectId: "tesis-celiacos",
  storageBucket: "tesis-celiacos.appspot.com",
  messagingSenderId: "64424012176",
  appId: "1:64424012176:web:3769382464fb8181"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
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
