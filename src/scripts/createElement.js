export const createTodoElement = (data) => {
	const todoEl = createDiv("todo-item");

	const container = createDiv("container");
	const priority = createDiv("priority", data.priority);

	const label = document.createElement("label");
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	label.append(checkbox);

	const title = document.createElement("h3");
	title.classList.add("todo-title");
	title.textContent = data.title;

	const dueDate = createDiv("due-date");
	dueDate.textContent = data.date;

	const trashIcon = document.createElement("i");
	trashIcon.setAttribute("class", "far fa-trash-alt");

	container.append(priority, label, title, dueDate, trashIcon);
	const expanded = createExpanded(data.desc);

	todoEl.append(container, expanded);
	todoEl.setAttribute("data-expand", "false");

	return todoEl;
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
