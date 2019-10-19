import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import comments from '../request/comments.json'
export default class Comments extends Component {
  constructor(props){
    super(props);
    this.state = {
        comments: comments
    }
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <Header />
        <Content>
          {this.state.comments.comments.map((comment) =>
            <List>
                
                <ListItem key={comment.id} avatar>
                <Left>
                    <Thumbnail source={{ uri: comment.image }} />
                </Left>
                <Body>
                    <Text>{comment.autor.nombre}</Text>
                    <Text note>{comment.autor.opinion}</Text>
                </Body>
                <Right>
                    <Text note>{comment.date}</Text>
                </Right>
                </ListItem>
            </List>
        )}
        </Content>
      </Container>
    );
  }
}