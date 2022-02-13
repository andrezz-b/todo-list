import { createTodoElement, createProjectElement } from "./createElement";
import { storageController } from "./storageController";
import PubSub from "pubsub-js";
import { displayController } from "./displayController";

export const controllerDOM = (function () {
	const newProjectBtn = document.querySelector("#project-add-btn");
	const cancelBtn = document.querySelectorAll(".cancel");
	const todoList = document.querySelector("#todo-list");
	const projectList = document.querySelector("#project-list");

	const addTodoElement = (tag, data) => {
		const todoElement = createTodoElement(data);
		const id = todoList.childElementCount;
		todoElement.setAttribute("data-id", id);
		todoElement.addEventListener("click", todoExtend);
		todoList.append(todoElement);
	};

	const renderProjectTodo = (tag, data) => {
		Array.from(todoList.children).forEach((el) => {
			el.remove();
		});
		const project = storageController.getProject(data.id);
		project.getTodoItems().forEach((todo) => {
			addTodoElement(undefined, todo.getInfo());
		});
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

	const addProjectElement = (tag, data) => {
		const projectElement = createProjectElement(data);
		const form = projectElement.lastElementChild;
		const projectRenameBtn = projectElement.querySelector(".rename-project");
		const id = projectList.childElementCount;

		projectElement.setAttribute("data-id", id);
		projectRenameBtn.addEventListener("click", openRenameForm);
		projectElement.addEventListener("click", changeActiveProject);
		form.addEventListener("submit", renameProject);
		projectList.append(projectElement);
	};

	const openRenameForm = (e) => {
		const projectItem = e.target.closest(".project-item");
		const form = projectItem.lastElementChild;
		const open = form.getAttribute("data-open");
		projectItem.classList.toggle("active");
		toggleInput(form, open);
	};

	const renameProject = (e) => {
		const form = e.target;
		const projectItem = e.target.closest(".project-item");
		projectItem.classList.toggle("active");
		toggleInput(form, form.getAttribute("data-open"));

		let data = {};
		data.title = form["title"].value;
		data.id = projectItem.getAttribute("data-id");
		PubSub.publish("change-project-name", data);

		const titleElement = projectItem.querySelector(".subtitle--project");
		titleElement.textContent = data.title;
	};

	const changeActiveProject = (e) => {
		if (
			e.target.getAttribute("class") !== "project-item" &&
			e.target.getAttribute("class") !== "subtitle--project"
		)
			return;
		let data = {};
		const projectDiv = e.target.closest(".project-item");
		data.id = projectDiv.getAttribute("data-id");
		data.title = storageController.getProject(data.id).getName();
		PubSub.publish("change-active-project", data);
	};

	const updateProjectTitle = (tag, data) => {
		const titleMain = document.querySelector(".title--main");
		if (tag === "change-active-project") {
			if (data.title == titleMain.textContent) return;
			titleMain.textContent = data.title;
		} else if (tag === "change-project-name") {
			if (data.id != displayController.getActiveID()) return;
			titleMain.textContent = data.title;
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
		PubSub.subscribe("add-new-todo", addTodoElement);
		PubSub.subscribe("add-new-project", addProjectElement);
		PubSub.subscribe("change-active-project", updateProjectTitle);
		PubSub.subscribe("change-project-name", updateProjectTitle);
		PubSub.subscribe("new-active-project", renderProjectTodo);

		cancelBtn.forEach((btn) => {
			btn.addEventListener("click", function (e) {
				const form = e.target.closest("form");
				const open = form.getAttribute("data-open");
				toggleInput(form, open);
			});
		});
		newProjectBtn.addEventListener("click", displayInput);
		addProjectElement(undefined, { title: "Project 1" });
	};

	return {
		init,
		toggleInput,
	};
})();
