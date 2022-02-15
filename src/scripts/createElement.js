export const createTodoElement = (data) => {
	const todoEl = createDiv("todo-item");

	const container = createDiv("container");
	const priority = createDiv("priority", data.priority);

	const label = document.createElement("label");
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = data.completed;
	label.append(checkbox);

	const title = document.createElement("h3");
	title.classList.add("todo-title");
	title.textContent = data.title;

	const dueDate = createDiv("due-date");
	dueDate.textContent = data.date;

	const trashIcon = createFaIcon("far", "fa-trash-alt");
	trashIcon.classList.add("remove-todo");
	const editIcon = createFaIcon("fas", "fa-edit");
	editIcon.classList.add("rename-todo");

	container.append(priority, label, title, dueDate, editIcon, trashIcon);
	const expanded = createExpanded(data.desc);

	todoEl.append(container, expanded);
	todoEl.setAttribute("data-expand", "false");

	return todoEl;
};

export const createProjectElement = (data) => {
	const projectEl = createDiv("project-item");

	const title = document.createElement("h1");
	title.classList.add("subtitle--project");
	title.textContent = data.title;

	const penEdit = createFaIcon("fas", "fa-edit");
	penEdit.classList.add("rename-project");

	const trashIcon = createFaIcon("far", "fa-trash-alt");
	trashIcon.classList.add("remove-project");

	const form = document.createElement("form");
	form.setAttribute("data-open", "false");
	form.setAttribute("action", "#");
	form.setAttribute("autocomplete", "off");
	form.setAttribute("onsubmit", "return false");
	form.classList.add("project-change-name");

	const inputText = document.createElement("input");
	inputText.type = "text";
	inputText.placeholder = "Name";
	inputText.name = "title";
	inputText.value = data.title;

	const inputSubmit = document.createElement("input");
	inputSubmit.type = "submit";
	inputSubmit.hidden = "true";

	form.append(inputText, inputSubmit);

	projectEl.append(title, penEdit, trashIcon, form);

	return projectEl;
};

const createExpanded = (text) => {
	const divExpanded = document.createElement("div");
	divExpanded.classList.add("hidden");

	const desc = document.createElement("div");
	const subtitle = document.createElement("h1");
	subtitle.classList.add("subtitle--desc");
	subtitle.textContent = "Description";

	const par = document.createElement("p");
	par.classList.add("par--desc");
	par.textContent = text;

	desc.append(subtitle, par);
	divExpanded.append(desc);

	return divExpanded;
};

const createDiv = (...className) => {
	const div = document.createElement("div");
	className.forEach((el) => {
		div.classList.add(el);
	});

	return div;
};

const createFaIcon = (...className) => {
	const span = document.createElement("span");
	const i = document.createElement("i");

	className.forEach((name) => {
		i.classList.add(name);
	});
	span.append(i);
	return span;
};
