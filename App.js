import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import ToDo from './ToDo';

const { width, height } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: ""
  }

  render() {
    const { newToDo } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>React To Do</Text>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder={"New To Do"} returnKeyType={"done"} value={newToDo} onChangeText={this._controlNewToDo} autoCorrect={false} />
          <ScrollView contentContainerStyle={styles.todos}>
            <ToDo />
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center'
  },
  title: {
    marginTop: 50,
    color: '#fff',
    fontSize: 30,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50, 50, 50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    fontSize: 20,
    padding: 20,
    borderBottomColor: "#ddd",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  todos: {
    alignItems: "center"
  }
});
