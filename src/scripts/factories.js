import PubSub from "pubsub-js";
import { displayController } from "./displayController";

export const Project = (name, idNum) => {
	const todoItems = [];
	let active = false;
	let id = idNum;

	const addTodoItem = (tag, data) => {
		const activeID = displayController.getActiveID();
		if (activeID != id) return;
		data.id = todoItems.length;
		const todoItem = todo(data);
		todoItems.push(todoItem);
	};

	const changeActive = () => {
		active = active ? false : true;
	};

	const getActive = () => {
		return active;
	};

	const getTodoItems = () => {
		return todoItems;
	};

	const setName = (newName) => {
		name = newName;
	};

	const getName = () => {
		return name;
	};

	PubSub.subscribe("add-new-todo", addTodoItem);

	return { id, getActive, changeActive, getTodoItems, setName, getName };
};

export const todo = (data) => {
	const info = data;
	info.completed = false;

	const getInfo = () => {
		return info;
	};

	return {
		getInfo,
	};
};
