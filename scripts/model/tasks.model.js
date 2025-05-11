export class TasksModel {
	constructor() {
		this.getTasksFromStorage();
	}

	getTasksFromStorage() {
		setTimeout(() => {
			const storedTasks = localStorage.getItem('tasks');
			this.tasks = JSON.parse(storedTasks) ?? [];
			this._commit(this.tasks);
		}, 0);
	}

	bindTaskListChanged(callback) {
		this.onTaskListChanged = callback;
	}

	addTask(taskText) {
		const task = {
			id: crypto.randomUUID(),
			text: taskText,
			settled: false,
			parentListId: null,
			favorite: false,
		};

		this.tasks.push(task);
		this._commit(this.tasks);
	}

	editTaskText(id, updatedText) {
		this.tasks = this.tasks.map((task) =>
			task.id === id ? { ...task, text: updatedText } : task
		);

		this._commit(this.tasks);
	}

	deleteTask(id) {
		this.tasks = this.tasks.filter((task) => task.id !== id);

		this._commit(this.tasks);
	}

	toggleTaskSettled(id) {
		this.tasks = this.tasks.map((task) =>
			task.id === id ? { ...task, settled: !task.settled } : task
		);

		this._commit(this.tasks);
	}

	toggleTaskFavorite(id) {
		this.tasks = this.tasks.map((task) =>
			task.id === id ? { ...task, favorite: !task.favorite } : task
		);

		this._commit(this.tasks);
	}

	setParentListId(taskId, parentListId) {
		this.tasks = this.tasks.map((task) =>
			task.id === taskId ? { ...task, parentListId } : task
		);

		this._commit(this.tasks);
	}

	_commit(tasks) {
		localStorage.setItem('tasks', JSON.stringify(tasks));

		if (this.onTaskListChanged) {
			this.onTaskListChanged(tasks);
		}
	}
}
