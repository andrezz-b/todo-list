import PubSub from "pubsub-js";
import { Project } from "./factories";

export const storageController = (() => {
	const storage = [];

	const init = () => {
		PubSub.subscribe("add-new-project", addProject);
	};

	const addProject = (tag, data) => {
		const project = Project(data.title);
		storage.push(project);
	};

	init();
})();
