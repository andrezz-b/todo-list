import PubSub from "pubsub-js";
import { Project } from "./factories";

export const storageController = (() => {
	const storage = [Project("Project 1", 0)];

	const init = () => {
		//PubSub.publish("add-new-project", { title: "Project 1" });
		PubSub.subscribe("add-new-project", addProject);
	};

	const getProject = (id) => {
		let project;
		storage.forEach((el) => {
			project = (el.id == id) ? el : project;
		});
		return project;
	};

	const addProject = (tag, data) => {
		const project = Project(data.title, storage.length);
		storage.push(project);
	};

	const getStorage = () => {
		return storage;
	};

	return {
		init,
		getStorage,
		getProject,
	};
})();
