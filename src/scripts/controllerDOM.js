import { createTodoElement, createProjectElement } from "./createElement";
import { storageController } from "./storageController";
import PubSub from "pubsub-js";

export const controllerDOM = (function () {
	const newProjectBtn = document.querySelector("#project-add-btn");
	const cancelBtn = document.querySelectorAll(".cancel");
	const todoList = document.querySelector("#todo-list");
	const projectList = document.querySelector("#project-list");

	const projectRenameBtn = document.querySelector(".rename-project");

	const openRenameForm = (e) => {
		const form = e.target.closest(".project-item").lastElementChild;
		const open = form.getAttribute("data-open");
		form.addEventListener("submit", function(e){
			const form = e.target;
			const open = form.getAttribute("data-open");
			toggleInput(form, open);
		})
		toggleInput(form, open);
	}

	const addTodoElement = (tag, data) => {
		const todoElement = createTodoElement(data);
		const id = todoList.childElementCount;
		todoElement.setAttribute("data-id", id);
		todoElement.addEventListener("click", todoExtend);
		todoList.append(todoElement);
	};

	const renderProjectTodo = (data) => {
		Array.from(todoList.children).forEach((el) => {
			el.remove();
		});
		const project = storageController.getProject(data.id);
		project.getTodoItems().forEach(todo => {
			addTodoElement(undefined, todo.getInfo())
		})
	};

	const addProjectElement = (tag, data) => {
		const projectElement = createProjectElement(data);
		const id = projectList.childElementCount;
		projectElement.setAttribute("data-id", id);
		projectElement.addEventListener("click", changeActiveProject);
		projectList.append(projectElement);
	};

	const changeActiveProject = (e) => {
		if (e.target.getAttribute("class") === "fas fa-cog") return;
		let data = {};
		const projectDiv = e.target.closest(".project-item");
		data.id = projectDiv.getAttribute("data-id");
		data.title = projectDiv.firstElementChild.textContent;
		PubSub.publish("change-active-project", data);
	}

	const updateProjectTitle = (tag, data) => {
		const titleMain = document.querySelector(".title--main");
		if (data.title == titleMain.textContent) return;
		titleMain.textContent = data.title;
		renderProjectTodo(data);
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
		PubSub.subscribe("add-new-todo", addTodoElement);
		PubSub.subscribe("add-new-project", addProjectElement);
		PubSub.subscribe("change-active-project", updateProjectTitle);
	projectRenameBtn.addEventListener("click", openRenameForm);

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
