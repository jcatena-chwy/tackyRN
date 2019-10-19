import React, { Component } from "react";
import { Text } from "react-native";
import { Footer, FooterTab, Button} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./FooterComponentStyles";


export default class FooterComponent extends Component{

	constructor(props){
		super(props) 
		this.state = { 
		}
	}

	render(){
			//tab bar items
	const tabs = [{
		title:"Home",
		subTitle:"",
		icon:"home",
		componente:"CookBook"
	},
	{
		title:"Recipes",
		subTitle:"",
		icon:"eye",
		componente:"CookBook"
	},
	{
		title:"Restaurant",
		subTitle:"",
		icon:"shopping-cart",
		componente:"CookBook"
	},{
		title:"Account",
		subTitle:"",
		icon:"user",
		componente:"CookBook"
	}];
	onPressButton = () => {
	}
	const navigation = this.props.navigate;
		return (
			<Footer style={styles.footerContainer}>
				<FooterTab  >
					{
						tabs.map((obj, index)=>{
							return (
								<Button key={index} style={styles.button} onPress={() => navigation.navigate(obj.componente )}>
									<Icon size={20} name={obj.icon} color={(index === 0) ? "#FF5E3A" : "grey"} />
									<Text style={{fontSize:12, color:(index === 0) ? "#FF5E3A" : "grey"}}>{obj.title}</Text>
									<Text style={styles.subText}>{obj.subTitle}</Text>
								</Button>
	
							)
						})
					}
				</FooterTab>
			</Footer>
		);
	}
	
}