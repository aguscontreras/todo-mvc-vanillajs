import { appIconsMap } from '../../constants/svg/svg_constants.js';
import { createElement, getElement } from '../helpers/dom.js';

export class TaskView {
	constructor() {
		this.showingInput = false;
		this._initStructure();
		this._initLocalListeners();
	}

	bindAddTask(handler) {
		this.onAddTask = handler;
	}

	bindCompleteTask(handler) {
		this.onCompleteTask = handler;
	}

	bindFavTask(handler) {
		this.onFavTask = handler;
	}

	bindDeleteTask(handler) {
		this.onDeleteTask = handler;
	}

	setTitle(title) {
		this.title.textContent = title;
	}

	setActiveList(list) {
		this._activeList = list;
	}

	getActiveList() {
		return this._activeList;
	}

	_initLocalListeners() {
		document.addEventListener('click', (event) => {
			if (
				this.showingInput &&
				!this.input.contains(event.target) &&
				!this.input.value
			) {
				this._toggleButtonAndInputView();
			}
		});

		this.form.addEventListener('submit', (event) => {
			event.preventDefault();

			if (this.input.value) {
				this.onAddTask(this.input.value.trim());
			}

			this.form.reset();
			this._toggleButtonAndInputView();
		});

		this.addTaskButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this._toggleButtonAndInputView();
		});
	}

	_initStructure() {
		this.app = getElement('#app');

		const tasksContainer = createElement('div', 'tasks-container');
		this.title = createElement('h1', 'tasks-title');

		const listContainer = createElement('div', 'tasks-list-container');
		this.tasksList = createElement('ul', 'tasks-list');

		listContainer.append(this.tasksList);

		const footerContainer = createElement('div', 'footer-container');

		this.form = createElement('form', 'task-form');

		this.input = createElement('input', 'input', {
			type: 'text',
			name: 'task',
			id: 'add-task-input',
			placeholder: 'Ingresa una tarea nueva...',
		});

		this.form.append(this.input);

		this.addTaskButton = createElement('button', 'button', {
			type: 'button',
			id: 'add-task-button',
			textContent: 'Agregar una tarea',
		});

		footerContainer.append(this.form, this.addTaskButton);

		tasksContainer.append(this.title, listContainer, footerContainer);
		this.app.append(tasksContainer);
	}

	_toggleButtonAndInputView() {
		if (this.showingInput) {
			this.addTaskButton.style.display = 'block';
			this.input.style.display = 'none';
		} else {
			this.addTaskButton.style.display = 'none';
			this.input.style.display = 'block';
			this.input.focus();
		}

		this.showingInput = !this.showingInput;
	}

	displayTasks(tasks) {
		this.title.textContent = this.getActiveList()?.name;

		const taskListElements = tasks
			.filter((task) =>
				this.getActiveList()?.id === '2'
					? task.favorite
					: task.parentListId === this.getActiveList()?.id
			)
			.map((task) => this._createTaskElement(task));

		this.tasksList.replaceChildren(...taskListElements);
	}

	_createTaskElement(task) {
		// Elemento de lista
		const taskListItem = createElement('li', 'task-item', {
			'data-task-id': task.id,
		});

		taskListItem.addEventListener('click', (event) => {
			event.stopPropagation();
			this.onCompleteTask(task.id);
		});

		if (task.settled) {
			taskListItem.classList.add('settled');
		}

		// Boton Favorito
		const favTaskButton = createElement(
			'button',
			['fav-task-button', 'task-action'],
			{
				innerHTML: task.favorite ? appIconsMap.star_fill : appIconsMap.star,
			}
		);

		favTaskButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.onFavTask(task.id);
		});

		if (task.favorite) {
			favTaskButton.classList.add('active');
		}

		// Boton Borrar
		const deleteTaskButton = createElement(
			'button',
			['delete-task-button', 'task-action'],
			{
				innerHTML: appIconsMap.trash,
			}
		);

		deleteTaskButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.onDeleteTask(task.id);
		});

		taskListItem.innerHTML = `
          <div class="check">
            ${task.settled ? appIconsMap.check : appIconsMap.circle}
          </div>
				  <div class="task">
            <p class="task-title">${task.text}</p>
            <p class="task-parent-list">${this.getActiveList().name}</p>
          </div>
          `;

		taskListItem.appendChild(favTaskButton);
		taskListItem.appendChild(deleteTaskButton);

		return taskListItem;
	}
}
