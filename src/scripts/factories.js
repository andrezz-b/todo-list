import PubSub from "pubsub-js";
import { displayController } from "./displayController";

export const Project = (name, idNum) => {
	const _todoItems = [];
	let _active = false;
	let _id = idNum;

	const addTodoItem = (tag, data) => {
		const activeID = displayController.getActiveID();
		if (activeID != _id) return;
		data.id = _todoItems.length;
		const todoItem = todo(data);
		_todoItems.push(todoItem);
	};

	const removeTodoItem = (tag, data) => {
		const activeID = displayController.getActiveID();
		if (activeID != _id) return;
		_todoItems.splice(data.id, 1);
		_todoItems.forEach((todoItem, i) => {
			todoItem.setID(i);
		});
	};

	const checkedTodoItem = (tag, data) => {
		const activeID = displayController.getActiveID();
		if (activeID != _id) return;
		_todoItems.forEach(todo => {
			if (todo.getInfo().id == data.id) {
				todo.changeChecked();
			}
		})
	}

	const changeActive = () => {
		_active = _active ? false : true;
	};

	const getActive = () => {
		return _active;
	};

	const getTodoItems = () => {
		return _todoItems;
	};

	const setName = (newName) => {
		name = newName;
	};

	const getName = () => {
		return name;
	};

	const getId = () => {
		return _id;
	};

	const setId = (newId) => {
		_id = newId;
	};
	PubSub.subscribe("add-new-todo", addTodoItem);
	PubSub.subscribe("remove-todo", removeTodoItem)
	PubSub.subscribe("checked-todo", checkedTodoItem)

	return { name, getId, setId, getActive, changeActive, getTodoItems, setName, getName };
};

export const todo = (data) => {
	const info = data;
	info.completed = false;

	const getInfo = () => {
		return info;
	};

	const setID = (newID) => {
		info.id = newID;
	};

	const changeChecked = () => {
		info.completed = info.completed ? false : true;
	}

	return {
		getInfo,
		setID,
		changeChecked,
	};
};
