import PubSub from "pubsub-js";
import { Project } from "./factories";

export const storageController = (() => {
	const storage = [Project("Project 1", 0)];

	const init = () => {
        //PubSub.publish("add-new-project", { title: "Project 1" });
		PubSub.subscribe("add-new-project", addProject);
	};

	const addProject = (tag, data) => {
		const project = Project(data.title, storage.length);
		storage.push(project)
        console.log(getStorage())
	};

    const getStorage = () => {
        return storage;
    }


	return {
		init,
        getStorage,
	};
})();
