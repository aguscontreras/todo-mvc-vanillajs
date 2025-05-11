import { TasksController } from './controller/tasks.controller.js';
import { TasksModel } from './model/tasks.model.js';
import { TaskView } from './view/tasks.view.js';

const tasksView = new TaskView();
const tasksModel = new TasksModel();

const app = {
	tasksController: new TasksController(tasksView, tasksModel),
};
