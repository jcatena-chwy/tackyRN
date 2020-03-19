import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, Image } from 'react-native';
import { Container, Header, Content,Item, Icon, View, Button } from 'native-base';
import firebase from '../../config';
export default class Paso2 extends Component {
  constructor(props){
    super(props);
    this.state = {
        image: null,
        isCompleted:true,
        puntaje:{},
        rows: [
            { "id":1, pregunta:"Que te parecio la comida?",recomend: false,
                start:[
                { "id":1, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":4, color: 'black', name:'md-star-outline' , isclickStart:false  },
                { "id":5, color: 'black' , name:'md-star-outline' , isclickStart:false },
                ] 
            },
            { "id":2, pregunta:"Que te parecio la atencion?" , recomend: false,
                start:[
                { "id":1, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":4, color: 'black', name:'md-star-outline' , isclickStart:false  },
                { "id":5, color: 'black', name:'md-star-outline', isclickStart:false   },
                ] 
            },
            { "id":3, pregunta:"Que te parecio la limpieza?" , recomend: false,
                start:[
                { "id":1, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":4, color: 'black' , name:'md-star-outline', isclickStart:false  },
                { "id":5, color: 'black', name:'md-star-outline', isclickStart:false   },
                ]
            },
            { "id":4, pregunta:"Que te parecio calidad/precio?" , recomend: false,
                start:[
                { "id":1, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":4, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":5,  color: 'black' , name:'md-star-outline' , isclickStart:false },
                ]
            },
          ],
          infoPaso1: this.props.infoPaso1,
          idImagen: '',
          textComentario:false,
          averageScore: null,
    }
    this.props.infoPaso1
    this.pickStart = this.pickStart.bind(this)
    this.setearValorPaso1 = this.setearValorPaso1.bind(this)
    this.guardarComentario = this.guardarComentario.bind(this)
    this.validarRespuestas = this.validarRespuestas.bind(this)
    this.obtenerPuntaje = this.obtenerPuntaje.bind(this)
    this.actualizarPuntaje = this.actualizarPuntaje.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }
  pickStart (row,col)  {
   let newArray = [...this.state.rows];
   var startElegida = newArray[row-1].start[col-1].isclickStart
   if(col > 3) {
    newArray[row-1].recomend = true
   }else {
    newArray[row-1].recomend = false
   }
   for(i=0;i<newArray[row-1].start.length;i++){
    if(startElegida){
      if(i>=col){
        newArray[row-1].start[i].color = "black"
        newArray[row-1].start[i].name = "md-star-outline"
        newArray[row-1].start[i].isclickStart = false 
      }
    } else {
      if(i < col){
        if(!startElegida){
          newArray[row-1].start[i].color = "yellow"
          newArray[row-1].start[i].name = "md-star"
          newArray[row-1].start[i].isclickStart = true
        }else {
          newArray[row-1].start[i].color = "black"
          newArray[row-1].start[i].name = "md-star-outline"
          newArray[row-1].start[i].isclickStart = false 
        }
      }else {
        newArray[row-1].start[i].color = "black"
        newArray[row-1].start[i].name = "md-star-outline"
        newArray[row-1].start[i].isclickStart = false 
      }
    }
    
   }
   this.setState({ rows:newArray });
  };

  validarRespuestas(){
    let newArray = [...this.state.rows];
    for(i=0;i<4;i++){
      if(newArray[i].start[0].isclickStart === false ){
        return false;
      }
      if(newArray[i].start[0].isclickStart === false ){
        return false;
      }
    }
    return true;
  }
  setearValorPaso1(){
    this.setState({ textComentario:false });
    this.props.regresarPaso1(this.state.averageScore);
  }

  obtenerPuntaje(){
    var puntaje = {}
    const db2 = firebase.database().ref('Scores')
    db2.orderByChild('id')
    .equalTo(this.props.infoPaso1.score)
    .once('value')
    .then((snapshot) => { 
      var value = snapshot.val();
      i = 0; 
      var key ;
      if (value) {
        snapshot.forEach((child) => {
          console.log(child.key, child.val());
          key = child.key
          puntaje = child.val()
          puntaje.key = child.key
          i++
        });
      }
      let newArray = [...this.state.rows];
      if(newArray[0].recomend === true ){
        puntaje.foodScore = puntaje.foodScore +1;         
      }else {
        puntaje.foodScore = puntaje.foodScore -1;
      }
      if(newArray[1].recomend === true ){
        puntaje.serviceScore = puntaje.serviceScore +1;         
      }else {
        puntaje.serviceScore = puntaje.serviceScore -1;
      }
      if(newArray[2].recomend === true ){
        puntaje.cleaningScore = puntaje.cleaningScore +1;         
      }else {
        puntaje.cleaningScore = puntaje.cleaningScore -1;
      }
      if(newArray[3].recomend === true ){
        puntaje.priceScore = puntaje.priceScore +1;         
      }else {
        puntaje.priceScore = puntaje.priceScore -1;
      }
      
      this.setState({
        puntaje: puntaje
      }, () => {
        this.actualizarPuntaje(this.state.puntaje)
      });
    });
  }
  actualizarPromedio() {
    var averageScore = 0
    for(i =0 ; i<this.state.rows.length; i++){
      var cont = 0;
      for(f =0 ; f<this.state.rows[i].start.length; f++) {
        var obj = this.state.rows[i].start[f]
        if(obj.isclickStart) {
          cont++;
        }
      }
      averageScore = averageScore + cont;
    }
    return parseFloat((averageScore/4).toFixed(2))
    return averageScore/4 
  }
  actualizarPuntaje(puntaje) {
    const db = firebase.database().ref('Scores/' + puntaje.key)
    var averageScore = this.actualizarPromedio();
    averageScore = puntaje.averageScore + averageScore
    averageScore =  parseFloat((averageScore/2).toFixed(2))
    db.update({
      foodScore:puntaje.foodScore,
      serviceScore:puntaje.serviceScore,
      cleaningScore:puntaje.cleaningScore,
      priceScore:puntaje.priceScore,
      averageScore:averageScore
     }).then(() =>{
      this.setState({
        averageScore:averageScore
      }, () => {
        if(this.state.infoPaso1.image != "" ) {
          this.uploadImage()
        } else {
         this.toggleModal()
        }
      });
       
     }).catch((error) =>{
       console.log("error")
     })
  }

  uploadImage = async () => {
    const response = await fetch(this.state.infoPaso1.image);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("images/ImageEstablecimiento/" + this.state.infoPaso1.name + "/Comentarios/" + this.state.idImagen);
    this.toggleModal()
    return ref.put(blob)
  }


  guardarComentario(){ 
     if(this.validarRespuestas()){
        const db = firebase.database()
        var formattedDate = new Date();
        var fecha = formattedDate.getDay().toString() + "-" + formattedDate.getMonth().toString() + "-" + formattedDate.getFullYear().toString();
        var idImagen = this.state.infoPaso1.image ? Math.random().toString(36).substring(7) : ''
        db.ref("Comments").push({
              date: fecha,
              description:this.props.infoPaso1.text,
              id:Math.random().toString(36).substring(7),
              idImagen:idImagen,
              idEstablecimiento:this.props.infoPaso1.idEstablecimiento,
              idProducto:"",
              userName:"",
              urlImage:""
        }).then(() =>{
          this.setState({ idImagen:idImagen });
          this.obtenerPuntaje()
          console.log("Inserted")
        }).catch((error) =>{
          console.log("error")
        })
     }else {
      this.setState({ textComentario:true });
     }
  }

  toggleModal (){
    this.props.cerrarModal(this.state.averageScore)
  }

  
  render() {
    let { image } = this.state;
    return (
      <Container>
        <Content>
        {this.state.rows.map((r) =>
        <Content key={r.id}>
             <Text style={{ fontSize: 20}}>{r.pregunta}</Text>
             <View style={{flexDirection: 'row'}}>
                {r.start.map((s) =>
                    <Icon key={s.id} active name={s.name} style={{ fontSize: 40, color: s.color }} onPress={() => this.pickStart(r.id, s.id)}  />
                )} 
            </View>
            
        </Content>
        )} 
        {this.state.textComentario &&<Text onChangeText={this.handleChange2} style={styles.textStyleAlert}> Por favor responda todas las preguntas! </Text>}
        <View style={styles.container2}>
                <View style={styles.buttonContainer}>
                  <Button style={{float: 'right', marginLeft:30}} danger onPress={this.setearValorPaso1}>
                              <Text style={styles.TextStyle} >Regresar</Text>
                  </Button>
                </View>
                <View style={styles.buttonContainer}>
                    <Button style={{ float: 'right',marginLeft:25, marginRight:5}} success onPress={this.validarCampos}>
                      <Text style={styles.TextStyle} onPress={this.guardarComentario} >Siguiente</Text>
                    </Button>
                </View>
                </View>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  textAreaContainer: {
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 50,
    justifyContent: "flex-start"
  },
  navBarLeftButton: {
      paddingLeft: 100,
      fontSize:80
  },
  textStyleAlert: {
    color:"red"
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10,
    marginTop:60
  },
  buttonContainer: {
    flex: 1,
  },
  TextStyle:{
    color:'#fff',
    textAlign:'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
}
})
