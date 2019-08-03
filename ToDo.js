import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const { width, height } = Dimensions.get("window"); // 단말기 윈도우 크기를 가져온다.

export default class ToDo extends Component {
  // ToDo 가 수정되는 상태 아닌 상태를 구별한다.
  state = {
    isEditing: false,
    isCompleted: false
  };

  render() {
    const { isCompleted } = this.state;
    return (
      <View style={styles.container}>
        {/* 터치 했을시 투명도 */}
        <TouchableOpacity onPress={this._toggleComplete}>
          <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.uncompletedCircle]} />
        </TouchableOpacity>
        <Text style={styles.text}>I'm a Todo</Text>
      </View>
    );
  }

  _toggleComplete = () => {
    this.setState(prevState => {
      return {
        isCompleted: !prevState.isCompleted
      }
    })
  };
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    marginRight: 10
  },
  completedCircle: {
    borderColor: "#f23657",
    borderWidth: 8
  },
  uncompletedCircle: {
    borderColor: "#bbb"
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20
  }
});