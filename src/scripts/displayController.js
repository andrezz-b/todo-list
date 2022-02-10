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

		// Test
		printActive()
	};

	const setActive = () => {
		const storage = storageController.getStorage();
		storage[activeID].changeActive();
	};

	const getActiveID = () => {
		return activeID;
	}


	// Test changing active status
	const printActive = () => {
		const storage = storageController.getStorage();
		storage.forEach(el => {
			if (el.getActive()) console.log(el)
		})
	}

	return {
		init,
		getActiveID,
	};
})();
