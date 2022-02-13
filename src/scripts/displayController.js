import { storageController } from "./storageController";
import PubSub from "pubsub-js";

export const displayController = (() => {
	let activeID = 0;

	const init = () => {
		PubSub.subscribe("change-active-project", updateActive);
	};

	const updateActive = (tag, data) => {
		if (activeID == data.id) return;
		const storage = storageController.getStorage();
		storage[activeID].changeActive();
		activeID = data.id;
		storage[activeID].changeActive();
		PubSub.publish("new-active-project", data);
		// Test
		printActive()
	};

	const getActiveID = () => {
		return activeID;
	}

	const setActiveID = (newID) => {
		activeID = newID;
	}


	// Test changing active status
	const printActive = () => {
		const storage = storageController.getStorage();
		storage.forEach(el => {
			if (el.getActive()) console.log(el, activeID)
		})
	}

	return {
		init,
		getActiveID,
		setActiveID,
	};
})();
