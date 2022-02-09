import PubSub from "pubsub-js";
import { controllerDOM } from "./controllerDOM";

export const formController = (function () {
	const newTodoForm = document.querySelector("#todo-add");
	const newProjectForm = document.querySelector("#project-add");

	const init = () => {
		newTodoForm.addEventListener("submit", addNewTodo);
		newProjectForm.addEventListener("submit", addNewProject);
	};

	const addNewTodo = () => {
		let data = {};

		for (let i = 0; i < 3; i++) {
			data[newTodoForm.elements[i].name] = newTodoForm.elements[i].value;
		}
		Array.from(newTodoForm.elements["priority"]).forEach((el) => {
			if (el.checked) {
				data.priority = el.value;
			}
		});

		PubSub.publish("add-new-todo", data);
	};

	const addNewProject = () => {
		let data = {};
		data.title = newProjectForm.elements["title"].value;
		controllerDOM.toggleInput(newProjectForm, "true");

		PubSub.publish("add-new-project", data);
	};

	return {
		init,
	};
})();
