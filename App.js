import React from "react";
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	TextInput,
	Dimensions,
	Platform,
	ScrollView,
	AsyncStorage,
} from "react-native";
import { AppLoading } from "expo";
import ToDo from "./ToDo";
import uuidv1 from "uuid/v1";

const { width, height } = Dimensions.get("window");

export default class App extends React.Component {
	state = {
		newToDo: "",
		loadedToDos: false,
		toDos: {},
	};

	componentDidMount = () => {
		this._loadToDos();
	};

	render() {
		const { newToDo, loadedToDos, toDos } = this.state;
		if (!loadedToDos) {
			return <AppLoading />;
		}
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" />
				<Text style={styles.title}>React To Do</Text>
				<View style={styles.card}>
					<TextInput
						style={styles.input}
						placeholder={"New To Do"}
						returnKeyType={"done"}
						value={newToDo}
						onChangeText={this._controlNewToDo}
						autoCorrect={false}
						onSubmitEditing={this._addToDo}
						underlineColorAndroid={"transparent"}
					/>
					<ScrollView contentContainerStyle={styles.todos}>
						{/* Object.values 참고 -> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/values */}
						{/* Array.prototype.map 참고 -> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map */}
						{Object.values(toDos)
							.reverse() // 역순으로 정렬, 즉 최신이 상단쪽으로
							.map(toDo => (
								<ToDo
									key={toDo.id}
									{...toDo}
									deleteToDo={this._deleteToDo}
									uncompletedToDo={this._uncompletedToDo}
									completeToDo={this._completeToDo}
									updateToDo={this._updateToDo}
								/>
							))}
					</ScrollView>
				</View>
			</View>
		);
	}

	_controlNewToDo = text => {
		this.setState({
			newToDo: text,
		});
	};

	_loadToDos = async () => {
		try {
			const toDos = await AsyncStorage.getItem("toDos"); // localStorage 에서 toDos key의 값을 가져옴
			console.log(toDos);
			this.setState({
				loadedToDos: true,
				toDos: JSON.parse(toDos) || {}, // toDos가 객체가 아니기 때문에 JSON.parse
			});
		} catch (error) {
			console.log(error);
		}
	};
	// 새로운 Todo 추가되면
	_addToDo = () => {
		const { newToDo } = this.state; // 새로운 Todo를 상태 객체에 저장
		if (newToDo !== "") {
			this.setState(prevState => {
				// 이전에 상태변수, 즉 이전 Todo를 불러옴
				const ID = uuidv1();
				const newToDoObject = {
					// 새 Todo 객체를 생성
					[ID]: {
						id: ID,
						isCompleted: false,
						text: newToDo,
						createAt: Date.now(),
					},
				};
				// '...' 구문, 객체리더럴 확장 참고
				// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax#%EA%B0%9D%EC%B2%B4_%EB%A6%AC%ED%84%B0%EB%9F%B4%EC%97%90%EC%84%9C%EC%9D%98_%EC%A0%84%EA%B0%9C
				const newState = {
					...prevState, // "loadedToDos": true 상태를 그대로 가져는 효과
					newToDo: "", // Submit 된 Input 텍스트 값을 지움, Reset
					toDos: {
						// 이전 Todo들을 가진 객체에 새로운 Todo가 추가됨, for in 구문을 사용하지 않고도 상태를 저장하고 합치는 효과
						...prevState.toDos,
						...newToDoObject,
					},
				};
				this._saveToDos(newState.toDos);
				// console.log(newState); // 실행결과가 어떻게 나오는지 확인
				return { ...newState };
			});
		}
	};

	_deleteToDo = id => {
		this.setState(prevState => {
			const toDos = prevState.toDos;
			delete toDos[id];
			const newState = {
				...prevState,
				...toDos,
			};
			this._saveToDos(newState.toDos);
			return { ...newState };
		});
	};
	// 비완료된 To Do 작성
	_uncompletedToDo = id => {
		this.setState(prevState => {
			const newState = {
				...prevState,
				toDos: {
					...prevState.toDos, // 기존에 있던 나머지 부분들
					[id]: {
						// 비완료된 To Do
						...prevState.toDos[id], // 해당 id 객체 나머지 유지
						isCompleted: false, // isCompleted 만 변경
					},
				},
			};
			this._saveToDos(newState.toDos);
			return { ...newState };
		});
	};

	_completeToDo = id => {
		this.setState(prevState => {
			const newState = {
				...prevState,
				toDos: {
					...prevState.toDos,
					[id]: {
						...prevState.toDos[id],
						isCompleted: true,
					},
				},
			};
			this._saveToDos(newState.toDos);
			return { ...newState };
		});
	};

	_updateToDo = (id, text) => {
		this.setState(prevState => {
			const newState = {
				...prevState,
				toDos: {
					...prevState.toDos,
					[id]: {
						...prevState.toDos[id],
						text: text,
					},
				},
			};
			this._saveToDos(newState.toDos);
			return { ...newState };
		});
	};

	_saveToDos = newToDos => {
		console.log(newToDos);
		const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos)); // localStorage 저장은 문자열로
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f23657", // app.json -> splash screen(시작화면) 설정과 같다.
		alignItems: "center",
	},
	title: {
		marginTop: 50,
		color: "#fff",
		fontSize: 30,
		fontWeight: "200",
		marginBottom: 30,
	},
	card: {
		backgroundColor: "white",
		flex: 1,
		width: width - 25,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		...Platform.select({
			ios: {
				shadowColor: "rgb(50, 50, 50)",
				shadowOpacity: 0.5,
				shadowRadius: 5,
				shadowOffset: {
					height: -1,
					width: 0,
				},
			},
			android: {
				elevation: 3,
			},
		}),
	},
	input: {
		fontSize: 20,
		padding: 20,
		borderBottomColor: "#ddd",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	todos: {
		alignItems: "center",
	},
});
