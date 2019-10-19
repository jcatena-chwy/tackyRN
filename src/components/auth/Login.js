import React, { Component } from 'react';
import { Constants } from 'expo'
import {
    Container,
    Button,
    Form,
    Item as FormItem,
    Input,
    Label,
    Icon,
    Item
} from 'native-base';
import {Text} from 'react-native';
import { StyleSheet, Alert } from 'react-native';
import firebase from '../../config';

export default class FormLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'pepe@gmail.com',
            password: 'hola123'
        };
        this.SignUp = this.SignUp.bind(this);
    }

    async LogIn(email, password) {
        try {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    console.log('Success')
                    this.props.navigation.navigate('Map')
                })
        } catch (error) {
            console.log(error.toString(error));
        }
    };

    async SignUp(email, password) {
        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    console.log('Success')
                })
        } catch (error) {
            console.log(error.toString(error));
        }
    };

    render() {
        return (
            <Container style={styles.container}>
                <Form>
                    <Item floatingLabel>
                        <Icon name='eye' />
                        <Label>Email</Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={email => this.setState({ email })}
                        />
                    </Item>
                    <Item floatingLabel>
                        <Icon name='eye' />
                        <Label>Password</Label>
                        <Input
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={password => this.setState({ password })}
                        />
                    </Item>
                    <Button full rounded success style={{ marginTop: 20 }} onPress={() => this.LogIn(this.state.email, this.state.password)}>
                        <Text>Login</Text>
                    </Button>
                    <Button full rounded success style={{ marginTop: 20 }} onPress={() => this.SignUp(this.state.email, this.state.password)}>
                        <Text>Signup</Text>
                    </Button>
                </Form>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    icon: {
        fontSize: 20
    }
})