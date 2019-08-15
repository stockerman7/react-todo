import React, { Component } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	TextInput,
} from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window"); // 단말기 윈도우 크기를 가져온다.

// Component 를 상속받은 ToDo
export default class ToDo extends Component {
	constructor(props) {
		// super 를 통한 상위 클래스 호출 -> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes#super_%EB%A5%BC_%ED%86%B5%ED%95%9C_%EC%83%81%EC%9C%84_%ED%81%B4%EB%9E%98%EC%8A%A4_%ED%98%B8%EC%B6%9C
		super(props); // App.js 의 props 을 말한다.
		// ToDo 가 수정되는 상태 아닌 상태를 구별한다.
		this.state = {
			isEditing: false,
			toDoValue: props.text,
		};
	}
	// 정적 메소드 참고 -> https://poiemaweb.com/es6-class#7-%EC%A0%95%EC%A0%81-%EB%A9%94%EC%86%8C%EB%93%9C
	// PropTypes는 인자 type 검사와 필수 여부를 검사 -> 실제로 보고 싶다면 console.log(ToDo.propTypes); 적용
	static propTypes = {
		text: PropTypes.string.isRequired,
		isCompleted: PropTypes.bool.isRequired,
		deleteToDo: PropTypes.func.isRequired,
		id: PropTypes.string.isRequired,
		uncompletedToDo: PropTypes.func.isRequired,
		completeToDo: PropTypes.func.isRequired,
		updateToDo: PropTypes.func.isRequired,
	};

	render() {
		const { isEditing, toDoValue } = this.state;
		const { text, id, deleteToDo, isCompleted } = this.props;
		return (
			<View style={styles.container}>
				<View style={styles.column}>
					{/* 터치 했을시 투명도 */}
					<TouchableOpacity onPress={this._toggleComplete}>
						<View
							style={[
								styles.circle,
								isCompleted ? styles.completedCircle : styles.uncompletedCircle,
							]}
						/>
					</TouchableOpacity>
					{isEditing ? (
						<TextInput
							style={[
								styles.text,
								styles.input,
								isCompleted ? styles.completedText : styles.uncompletedText,
							]}
							value={toDoValue}
							multiline={true}
							returnKeyType={"done"}
							onBlue={this._finishEditing}
							onChangeText={this._controlInput}
							underlineColorAndroid={"transparent"}
						/>
					) : (
						<Text
							style={[
								styles.text,
								isCompleted ? styles.completedText : styles.uncompletedText,
							]}>
							{text}
						</Text>
					)}
				</View>

				{isEditing ? (
					<View style={styles.actions}>
						<TouchableOpacity onPressOut={this._finishEditing}>
							<View style={styles.actionContainer}>
								<Text style={styles.actionText}>✓</Text>
							</View>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.actions}>
						<TouchableOpacity onPressOut={this._startEditing}>
							<View style={styles.actionContainer}>
								<Text style={styles.actionText}>✎</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPressOut={event => {
								event.stopPropagation;
								deleteToDo(id);
							}}>
							<View style={styles.actionContainer}>
								<Text style={styles.actionText}>X</Text>
							</View>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	}

	_toggleComplete = event => {
		event.stopPropagation();
		const { id, isCompleted, uncompletedToDo, completeToDo } = this.props;
		if (isCompleted) {
			uncompletedToDo(id);
		} else {
			completeToDo(id);
		}
	};

	_startEditing = event => {
		event.stopPropagation();
		this.setState({
			isEditing: true,
		});
	};

	_finishEditing = event => {
		event.stopPropagation();
		const { toDoValue } = this.state;
		const { id, updateToDo } = this.props;
		updateToDo(id, toDoValue);
		this.setState({
			isEditing: false,
		});
	};

	_controlInput = text => {
		this.setState({
			toDoValue: text,
		});
	};
}

const styles = StyleSheet.create({
	container: {
		width: width - 50,
		borderBottomColor: "#bbb",
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	circle: {
		width: 30,
		height: 30,
		borderRadius: 15,
		borderWidth: 1,
		marginRight: 20,
	},
	completedCircle: {
		borderColor: "#bbb",
	},
	uncompletedCircle: {
		borderColor: "#f23657",
	},
	text: {
		fontWeight: "600",
		fontSize: 20,
		marginVertical: 20,
	},
	completedText: {
		color: "#bbb",
		textDecorationLine: "line-through",
	},
	uncompletedText: {
		color: "#353535",
	},
	column: {
		flexDirection: "row",
		alignItems: "center",
		width: width / 2,
	},
	actions: {
		flexDirection: "row",
	},
	actionContainer: {
		marginVertical: 10,
		marginHorizontal: 10,
	},
	actionText: {
		fontSize: 20,
	},
	input: {
		width: width / 2,
		marginVertical: 15,
		paddingBottom: 5,
	},
});
