import PubSub from "pubsub-js";

export const Project = (name, idNum) => {
	const todoItems = [];
	let active = false;
	let id = idNum;

	const addTodoItem = (tag, data) => {
		data.id = todoItems.length;
		const todoItem = todo(data);
		todoItems.push(todoItem);
		todoItem.logInfo();
	};

	const changeActive = () => {
		active = active ? false : true;
	};

	PubSub.subscribe("add-new-todo", addTodoItem);

	return { name, id, active, changeActive };
};

export const todo = (data) => {
	const info = data;
	let completed = false;

	const logInfo = () => {
		console.table(info);
	};

	return {
		logInfo,
	};
};
