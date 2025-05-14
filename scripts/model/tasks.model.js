export class TasksModel {
  constructor() {
    this._initTasks();
  }

  _initTasks() {
    setTimeout(() => {
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
      this.setTasks(storedTasks);
    }, 0);
  }

  bindTaskListChanged(callback) {
    this.onTaskListChanged = callback;
  }

  setActiveList(list) {
    this._activeList = list;
  }

  getActiveList() {
    return this._activeList;
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._commit(this._tasks);
  }

  getTasks() {
    return this._tasks;
  }

  find(id) {
    return this.getTasks().find((e) => e.id === id);
  }

  create(text) {
    const newTask = {
      id: crypto.randomUUID(),
      text,
      settled: false,
      parentListId: this.getActiveList().id,
      favorite: false,
    };

    this.setTasks([...this.getTasks(), newTask]);
  }

  update(id, params) {
    this.setTasks(
      this.getTasks().map((task) =>
        task.id === id ? { ...task, ...params } : task
      )
    );
  }

  delete(id) {
    this.setTasks(this.getTasks().filter((task) => task.id !== id));
  }

  toggleSettled(id) {
    this.setTasks(
      this.getTasks().map((task) =>
        task.id === id ? { ...task, settled: !task.settled } : task
      )
    );
  }

  toggleFavorite(id) {
    this.setTasks(
      this.getTasks().map((task) =>
        task.id === id ? { ...task, favorite: !task.favorite } : task
      )
    );
  }

  _commit(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));

    if (this.onTaskListChanged) {
      this.onTaskListChanged(tasks);
    }
  }
}
