import PubSub from "pubsub-js";

export const Project = (name) => {
    const todoItems = [];
    let active = false;

    const addTodoItem = (tag, data) => {
        todoItems.push(data);
    }

    PubSub.subscribe("add-new-todo", addTodoItem)

    return {name}
}