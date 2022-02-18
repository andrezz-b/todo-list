import PubSub from "pubsub-js";
import { controllerDOM } from "./controllerDOM";
import { displayController } from "./displayController";

export const formController = (function () {
	const newTodoForm = document.querySelector("#todo-add");
	const newProjectForm = document.querySelector("#project-add");
	let editId;

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
		if (newTodoForm.getAttribute("data-edit") === "true") {
			data.id = editId;
			PubSub.publish("edit-todo", data);
		} else {
			PubSub.publish("add-new-todo", data);
		}
		controllerDOM.closeForm(newTodoForm)
		resetFormInput(newTodoForm);
	};

	const addNewProject = () => {
		let data = {};
		data.title = newProjectForm.elements["title"].value;
		controllerDOM.closeForm(newProjectForm)
		resetFormInput(newProjectForm);
		PubSub.publish("add-new-project", data);
	};

	const fillFormInput = (form, data) => {
		const formElements = Array.from(form.elements);
		editId = data.id
		formElements.forEach((el) => {
			if (el.type !== "radio") {
				if (data[el.name]) {
					el.value = data[el.name];
				}
			} else {
				if (el.value === data[el.name]) {
					el.checked = true;
				}
			}
		});
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
		fillFormInput,
	};
})();
