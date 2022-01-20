import "./styles/main.scss";

const todoItem = document.querySelector(".todo-item");
todoItem.addEventListener("click", function (e) {
	if (e.target.getAttribute("type")) return;

	const todoItem = e.target.closest(".todo-item");

	if (todoItem.getAttribute("data-expand") === "true") {
		const expandDiv = todoItem.lastElementChild;
		expandDiv.classList.add("removed");
		expandDiv.addEventListener("animationend", function () {
			expandDiv.remove();

			expandDiv.classList.remove("removed");
		});
		todoItem.setAttribute("data-expand", "false");
	} else {
		todoItem.append(createExpanded());
		todoItem.setAttribute("data-expand", "true");
	}
});

function createExpanded() {
	const divExpanded = document.createElement("div");
	divExpanded.classList.add("expanded");

	const desc = document.createElement("div");
	const subtitle = document.createElement("h1");
	subtitle.classList.add("subtitle--desc");
	subtitle.textContent = "Description";

	const par = document.createElement("p");
	par.classList.add("par--desc");
	par.textContent =
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Id distinctio, velit eaque voluptates ea adipisci itaque repellat vitae minima numquam.";

	desc.append(subtitle, par);
	divExpanded.append(desc);

	return divExpanded;
}
