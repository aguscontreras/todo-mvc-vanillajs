export class TasksController {
	constructor(tasksView, tasksModel) {
		this.tasksView = tasksView;
		this.tasksModel = tasksModel;

		this.tasksView.bindAddTask((text) => {
			this.tasksModel.create(text);
		});

		this.tasksView.bindCompleteTask((id) => {
			this.tasksModel.toggleSettled(id);
		});

		this.tasksView.bindFavTask((id) => {
			this.tasksModel.toggleFavorite(id);
		});

		this.tasksView.bindDeleteTask((id) => {
			this.tasksModel.delete(id);
		});

		this.tasksModel.bindTaskListChanged((tasks) => {
			this.tasksView.displayTasks(tasks);
			this.onTasksChanged(tasks);
		});
	}

	bindOnTaskChanged(callback) {
		this.onTasksChanged = callback;
	}
}
