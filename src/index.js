import "./styles/main.scss";
import { controllerDOM } from "./scripts/controllerDOM";
import { formController } from "./scripts/formController";
import { Project } from "./scripts/factories";
import { storageController } from "./scripts/storageController"

controllerDOM.init();

const boy = Project("boah");