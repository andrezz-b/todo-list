import { storageController } from "./storageController";
import PubSub from "pubsub-js";

export const displayController = (() => {
	let activeID = 0;

	const init = () => {
		setActive();
		PubSub.subscribe("change-active-project", updateActive);
	};

	const updateActive = (tag, data) => {
		if (activeID == data.id) return;
		setActive();
		activeID = data.id;
		setActive();
	};

	const setActive = () => {
		const storage = storageController.getStorage();
		storage[activeID].changeActive();
	};

	return {
		init,
	};
})();
