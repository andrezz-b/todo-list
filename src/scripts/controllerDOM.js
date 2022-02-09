import { createTodoElement, createProjectElement } from "./createElement";
import PubSub from "pubsub-js";

export const controllerDOM = (function () {
	const newProjectBtn = document.querySelector("#project-add-btn");
	const cancelBtn = document.querySelectorAll(".cancel");
	const todoList = document.querySelector("#todo-list");
	const projectList = document.querySelector("#project-list");

	const renderTodoItem = (tag, data) => {
		const todoElement = createTodoElement(data);
		todoElement.addEventListener("click", todoExtend);
		todoList.append(todoElement);
	};

	const renderProjectSide = (tag, data) => {
		const projectElement = createProjectElement(data);
		projectList.append(projectElement);
	};

	const todoExtend = (e) => {
		if (e.target.getAttribute("type")) return;

		const todoItem = e.target.closest(".todo-item");
		const expandDiv = todoItem.lastElementChild;
		expandDiv.classList.remove("hidden");

		if (todoItem.getAttribute("data-expand") === "true") {
			expandDiv.classList.add("hide");

			expandDiv.addEventListener(
				"animationend",
				function () {
					expandDiv.classList.remove("expanded");
				},
				{ once: true }
			);

			todoItem.setAttribute("data-expand", "false");
		} else {
			expandDiv.classList.remove("hide");
			expandDiv.classList.add("expanded");
			todoItem.setAttribute("data-expand", "true");
		}
	};

	const displayInput = () => {
		const addProjectForm = document.querySelector("#project-add");
		const open = addProjectForm.getAttribute("data-open");
		toggleInput(addProjectForm, open);
	};

	const toggleInput = (input, open) => {
		if (open === "true") {
			input.classList.remove("open");
			input.setAttribute("data-open", "false");
		} else {
			input.classList.add("open");
			input.setAttribute("data-open", "true");
		}
	};

	const init = () => {
		PubSub.subscribe("add-new-todo", renderTodoItem);
		PubSub.subscribe("add-new-project", renderProjectSide);
		cancelBtn.forEach((btn) => {
			btn.addEventListener("click", function (e) {
				const form = e.target.closest("form");
				const open = form.getAttribute("data-open");
				toggleInput(form, open);
			});
		});
		newProjectBtn.addEventListener("click", displayInput);
	};

	return {
		init,
		toggleInput,
	};
})();
