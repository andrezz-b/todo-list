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
		controllerDOM.toggleInput(
			{ input: newTodoForm, open: "true" },
			{ input: document.querySelector(".overlay"), open: "true" }
		);

		resetFormInput(newTodoForm);
		PubSub.publish("add-new-todo", data);
	};

	const addNewProject = () => {
		let data = {};
		data.title = newProjectForm.elements["title"].value;
		controllerDOM.toggleInput({ input: newProjectForm, open: "true" });
		resetFormInput(newProjectForm);
		PubSub.publish("add-new-project", data);
	};

	const resetFormInput = (form) => {
		const formElements = Array.from(form.elements);
		formElements.forEach((el) => {
			if (el.type === "text" || el.type === "date") {
				el.value = "";
			} else if (el.type === "radio" && el.value === "medium") {
				el.checked = true;
			}
		});
	};

	return {
		init,
		resetFormInput,
	};
})();
