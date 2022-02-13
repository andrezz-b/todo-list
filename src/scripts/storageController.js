import PubSub from "pubsub-js";
import { Project } from "./factories";
import { displayController } from "./displayController";

export const storageController = (() => {
	const storage = [Project("Project 1", 0)];

	const init = () => {
		storage[0].changeActive();
		//PubSub.publish("add-new-project", { title: "Project 1" });
		PubSub.subscribe("add-new-project", addProject);
		PubSub.subscribe("change-project-name", renameProject);
		PubSub.subscribe("remove-project", removeProject);
	};

	const getProject = (id) => {
		const project = storage.find((project) => {
			if (project.getId() == id) return project;
		});
		return project;
	};

	const addProject = (tag, data) => {
		const project = Project(data.title, storage.length);
		storage.push(project);
	};

	const renameProject = (tag, data) => {
		const project = getProject(data.id);
		project.setName(data.title);
	};

	const removeProject = (tag, data) => {
		storage.splice(data.id, 1);
		updateProjectId();
		let activeProject = storage.find((project) => {
			if (project.getActive()) return project;
		});
		if (activeProject === undefined) {
			activeProject = getProject(0);
			activeProject.changeActive();
			PubSub.publish("new-active-project", {
				title: activeProject.getName(),
				id: activeProject.getId(),
			});
		}
		let newData = {
			title: activeProject.getName(),
			id: activeProject.getId(),
		};
		PubSub.publish("change-active-project", newData);
		displayController.setActiveID(activeProject.getId());
	};

	const updateProjectId = () => {
		storage.forEach((project, i) => {
			project.setId(i);
		});
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
