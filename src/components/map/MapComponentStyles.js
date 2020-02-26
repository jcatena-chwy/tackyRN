import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
	container: {
		position:'absolute',
		top:0,
		right:0,
		left:0,
		bottom:0,
		justifyContent: 'flex-end',
		alignItems:'center'
	  },
	  map: {
		position:'absolute',
		top:0,
		left:0,
		bottom:0,
		right:0
	  },
	  containerSpinner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		shadowRadius:10,
		width: 350, 
		height:280
	  },
	  contentSpinner: {
		backgroundColor: 'white',
		padding: 22,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		width:200,
		height:200,
		borderColor: 'rgba(0, 0, 0, 0.1)',
	  }
});

export default styles;