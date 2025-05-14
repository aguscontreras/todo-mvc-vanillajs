import { ListsController } from "./controller/lists.controller.js";
import { TasksController } from "./controller/tasks.controller.js";
import { ListsModel } from "./model/lists.model.js";
import { TasksModel } from "./model/tasks.model.js";
import { ListsView } from "./view/lists.view.js";
import { TaskView } from "./view/tasks.view.js";

const tasksView = new TaskView();
const tasksModel = new TasksModel();
const listsView = new ListsView();
const listsModel = new ListsModel();

export class App {
  constructor(tasksController, listsController) {
    this.tasksController = tasksController;
    this.listsController = listsController;

    listsController.bindOnActiveListChanged((list) => {
      tasksModel.setActiveList(list);
      tasksView.setActiveList(list);
      tasksView.displayTasks(tasksModel.getTasks());
    });
  }
}

export const todoListApp = new App(
  new TasksController(tasksView, tasksModel),
  new ListsController(listsView, listsModel)
);
