import { createTodoElement, createProjectElement } from "./createElement";
import { storageController } from "./storageController";
import PubSub from "pubsub-js";
import { displayController } from "./displayController";
import { formController } from "./formController";

export const controllerDOM = (function () {
	// New project form
	const newProjectBtn = document.querySelector("#project-add-btn");
	const cancelProjectForm = document.querySelector(".cancel");

	// New todo form
	const newTodoBtn = document.querySelector("#new-todo-btn");
	const divOverlay = document.querySelector(".overlay");
	const newTodoForm = document.querySelector("#todo-add");
	const cancelTodoForm = newTodoForm.querySelector(".fas.fa-times");

	//
	const todoList = document.querySelector("#todo-list");
	const projectList = document.querySelector("#project-list");

	const openTodoForm = (data) => {
		if (data === undefined) {
			toggleInput(
				{ input: divOverlay, open: divOverlay.getAttribute("data-open") },
				{ input: newTodoForm, open: newTodoForm.getAttribute("data-open") }
			);
		} else {
			newTodoForm.setAttribute("data-edit", "true");
			formController.fillFormInput(newTodoForm, data);
			toggleInput(
				{ input: divOverlay, open: divOverlay.getAttribute("data-open") },
				{ input: newTodoForm, open: newTodoForm.getAttribute("data-open") }
			);
		}
	};

	const addTodoElement = (tag, data) => {
		const todoElement = createTodoElement(data);
		const removeTodoBtn = todoElement.querySelector(".remove-todo");
		const renameTodoBtn = todoElement.querySelector(".rename-todo");
		const id = todoList.childElementCount;
		const checkbox = todoElement.querySelector("[type='checkbox']");
		todoElement.setAttribute("data-id", id);

		renameTodoBtn.addEventListener("click", function (e) {
			const todoId = e.target.closest(".todo-item").getAttribute("data-id");
			const todoItems = storageController
				.getProject(displayController.getActiveID())
				.getTodoItems();
			const todoData = todoItems.find((todo) => {
				if (todo.getInfo().id == todoId) return todo;
			});
			openTodoForm(todoData.getInfo());
		});
		removeTodoBtn.addEventListener("click", removeTodoElement);
		checkbox.addEventListener("click", todoChecked);
		todoElement.addEventListener("click", todoExtend);

		todoList.append(todoElement);
	};

	const todoChecked = (e) => {
		const todoElement = e.target.closest(".todo-item");
		let data = {
			id: todoElement.getAttribute("data-id"),
		};
		PubSub.publish("checked-todo", data);
	};

	const editTodoElement = (tag, data) => {
		const todoElement = Array.from(todoList.children).find((el) => {
			if (data.id == el.getAttribute("data-id")) return el;
		});

		const priority = todoElement.querySelector(".priority");
		priority.setAttribute("class", `priority ${data.priority}`);

		const title = todoElement.querySelector(".todo-title");
		title.textContent = data.title;

		const date = todoElement.querySelector(".due-date");
		date.textContent = data.date;

		const desc = todoElement.querySelector(".par--desc");
		desc.textContent = data.desc;
	};

	const removeTodoElement = (e) => {
		const todoElement = e.target.closest(".todo-item");
		let data = {
			id: todoElement.getAttribute("data-id"),
		};
		todoElement.remove();
		PubSub.publish("remove-todo", data);
		updateDOMid(todoList);
	};

	const renderProjectTodo = (tag, data) => {
		// Rework
		Array.from(todoList.children).forEach((el) => {
			el.remove();
		});
		const project = storageController.getProject(data.id);
		project.getTodoItems().forEach((todo) => {
			addTodoElement(undefined, todo.getInfo());
		});
	};

	const todoExtend = (e) => {
		if (
			e.target.getAttribute("type") ||
			e.target.getAttribute("class") === "fas fa-edit" ||
			e.target.getAttribute("class") === "far fa-trash-alt"
		)
			return;

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
		const projectRemoveBtn = projectElement.querySelector(".remove-project");
		const id = projectList.childElementCount;

		projectElement.setAttribute("data-id", id);
		projectRenameBtn.addEventListener("click", openRenameForm);
		projectRemoveBtn.addEventListener("click", removeProjectElement);
		projectElement.addEventListener("click", changeActiveProject);
		form.addEventListener("submit", renameProject);
		projectList.append(projectElement);
	};

	const removeProjectElement = (e) => {
		if (storageController.getStorage().length === 1) {
			alert("You must have at least one project!");
			return;
		}
		const projectItem = e.target.closest(".project-item");
		let data = {
			id: projectItem.getAttribute("data-id"),
		};
		projectItem.remove();
		PubSub.publish("remove-project", data);
		updateDOMid(projectList);
	};

	const openRenameForm = (e) => {
		const projectItem = e.target.closest(".project-item");
		const form = projectItem.lastElementChild;
		const open = form.getAttribute("data-open");
		projectItem.classList.toggle("active");
		toggleInput({ input: form, open: open });
	};

	const renameProject = (e) => {
		const form = e.target;
		const projectItem = e.target.closest(".project-item");
		projectItem.classList.toggle("active");
		toggleInput({ input: form, open: form.getAttribute("data-open") });

		let data = {
			title: form["title"].value,
			id: projectItem.getAttribute("data-id"),
		};

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

		const projectItem = e.target.closest(".project-item");
		let data = {
			id: projectItem.getAttribute("data-id"),
		};
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

	const closeForm = (e) => {
		const form = e.target ? e.target.closest("form") : e;
		if (form.getAttribute("data-edit")) form.setAttribute("data-edit", "false");
		toggleInput(
			{
				input: form,
				open: form.getAttribute("data-open"),
			},
			{
				input: divOverlay,
				open: "true",
			}
		);
		formController.resetFormInput(form);
	};

	const displayInput = () => {
		const addProjectForm = document.querySelector("#project-add");
		toggleInput({
			input: addProjectForm,
			open: addProjectForm.getAttribute("data-open"),
		});
	};

	const toggleInput = (...data) => {
		data.forEach((el) => {
			if (el.open === "true") {
				el.input.classList.remove("open");
				el.input.setAttribute("data-open", "false");
			} else {
				el.input.classList.add("open");
				el.input.setAttribute("data-open", "true");
			}
		});
	};

	const updateDOMid = (list) => {
		Array.from(list.children).forEach((item, i) => {
			item.setAttribute("data-id", i);
		});
	};

	const init = () => {
		PubSub.subscribe("add-new-todo", addTodoElement);
		PubSub.subscribe("add-new-project", addProjectElement);
		PubSub.subscribe("change-active-project", updateProjectTitle);
		PubSub.subscribe("change-project-name", updateProjectTitle);
		PubSub.subscribe("new-active-project", renderProjectTodo);
		PubSub.subscribe("edit-todo", editTodoElement);

		newTodoBtn.addEventListener("click", function () {
			openTodoForm();
		});
		[cancelProjectForm, cancelTodoForm].forEach((btn) => {
			btn.addEventListener("click", closeForm);
		});
		newProjectBtn.addEventListener("click", displayInput);
		addProjectElement(undefined, { title: "Project 1" });
	};

	return {
		init,
		closeForm,
	};
})();
