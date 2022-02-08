import PubSub from "pubsub-js";

export const formController = (function () {
	const newTodoForm = document.querySelector("#todo-add");

    
    const init = () => {
        newTodoForm.addEventListener("submit", addNewTodo);
    }
    
    const addNewTodo = () => {
        let data = {};

        for (let i = 0; i < 3; i++) {
            data[newTodoForm.elements[i].name] = newTodoForm.elements[i].value;
        }
        Array.from(newTodoForm.elements["priority"]).forEach(el => {
            if (el.checked) {
                data.priority = el.value;
            }
        })
        
        PubSub.publish("add-new-todo", data);
    }
    
    init();

})();
