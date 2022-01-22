import { createExpanded } from "./createElement";

export const controllerDOM = (function () {
	const todoItem = document.querySelectorAll(".todo-item");
	const newProjectBtn = document.querySelector("#project-add-btn");
    const cancelBtn = document.querySelectorAll(".cancel")

	function init() {
		addEvents();
	}

	function todoExtend(e) {
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
			// Change to get expanded from todo Object
			todoItem.append(createExpanded());
			todoItem.setAttribute("data-expand", "true");
		}
	}

	function displayInput() {
		const addProjectForm = document.querySelector("#project-add");
		const open = addProjectForm.getAttribute("data-open");
		toggleInput(addProjectForm, open);
	}

	function toggleInput(input, open) {
		if (open === "true") {
			input.classList.remove("open");
			input.setAttribute("data-open", "false");
		} else {
			input.classList.add("open");
			input.setAttribute("data-open", "true");
		}
	}

	function addEvents() {
		todoItem.forEach((item) => {
			item.addEventListener("click", todoExtend);
		});
        cancelBtn.forEach((btn) => {
			btn.addEventListener("click", function(e){
                const form = e.target.closest("form");
                const open = form.getAttribute("data-open")
                toggleInput(form, open);
            });
		});
		newProjectBtn.addEventListener("click", displayInput);

	}

	return {
		init,
	};
})();
