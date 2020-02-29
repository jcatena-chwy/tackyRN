import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, Image } from 'react-native';
import { Container, Header, Content,Item, Icon, View } from 'native-base';

export default class Paso2 extends Component {
  constructor(props){
    super(props);
    this.state = {
        image: null,
        isCompleted:true,
        rows: [
            { "id":1, pregunta:"Que te parecio la comida?", 
                start:[
                { "id":1, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":4, color: 'black', name:'md-star-outline' , isclickStart:false  },
                { "id":5, color: 'black' , name:'md-star-outline' , isclickStart:false },
                ] 
            },
            { "id":2, pregunta:"Que te parecio la atencion?" , 
                start:[
                { "id":1, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":4, color: 'black', name:'md-star-outline' , isclickStart:false  },
                { "id":5, color: 'black', name:'md-star-outline', isclickStart:false   },
                ] 
            },
            { "id":3, pregunta:"Que te parecio la limpieza?" , 
                start:[
                { "id":1, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":4, color: 'black' , name:'md-star-outline', isclickStart:false  },
                { "id":5, color: 'black', name:'md-star-outline', isclickStart:false   },
                ]
            },
            { "id":4, pregunta:"Que te parecio calidad/precio?" , 
                start:[
                { "id":1, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":2, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":3, color: 'black', name:'md-star-outline', isclickStart:false  },
                { "id":4, color: 'black', name:'md-star-outline', isclickStart:false   },
                { "id":5,  color: 'black' , name:'md-star-outline' , isclickStart:false },
                ]
            },
          ],
          infoPaso1: this.props.infoPaso1
    }
    this.props.infoPaso1
    debugger
    this.pickStart = this.pickStart.bind(this)
  }
  pickStart (row,col)  {
   let newArray = [...this.state.rows];
   var startElegida = newArray[row-1].start[col-1].isclickStart
   debugger
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
        </Content>
      </Container>
    );
  }
}
