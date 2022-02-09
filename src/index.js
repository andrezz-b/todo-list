import "./styles/main.scss";
import PubSub from "pubsub-js";
import { controllerDOM } from "./scripts/controllerDOM";
import { formController } from "./scripts/formController";
import { Project } from "./scripts/factories";
import { storageController } from "./scripts/storageController";
import { displayController } from "./scripts/displayController";

controllerDOM.init();
formController.init();
storageController.init();
displayController.init();
