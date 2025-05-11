export class TasksController {
	constructor(tasksView, tasksModel) {
		this.tasksView = tasksView;
		this.tasksModel = tasksModel;

		this.tasksView.bindAddTask((taskText) => {
			this.tasksModel.addTask(taskText);
		});

		this.tasksView.bindCompleteTask((taskId) => {
			this.tasksModel.toggleTaskSettled(taskId);
		});

		this.tasksView.bindFavTask((taskId) => {
			this.tasksModel.toggleTaskFavorite(taskId);
		});

		this.tasksView.bindDeleteTask((taskId) => {
			this.tasksModel.deleteTask(taskId);
		});

		this.tasksModel.bindTaskListChanged((tasks) => {
			this.tasksView.updateTasksList(tasks);
		});
	}
}
