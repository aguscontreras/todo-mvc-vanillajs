import {
	check,
	circle,
	star,
	star_fill,
	trash,
} from '../../constants/svg/svg_constants.js';
import { createElement, getElement } from '../helpers/dom.js';

export class TaskView {
	constructor() {
		this.showingInput = false;
		this._initStructure();
	}

	bindAddTask(handler) {
		this.form.addEventListener('submit', (event) => {
			event.preventDefault();

			if (this.input.value) {
				handler(this.input.value.trim());
			}

			this.form.reset();
			this._toggleButtonAndInputView();
		});
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
	}

	_initStructure() {
		this.app = this._getElement('#app');

		const tasksContainer = this._createElement('div', 'tasks-container');
		this.title = this._createElement('h1', 'tasks-title');

		const listContainer = this._createElement('div', 'tasks-list-container');
		this.tasksList = this._createElement('ul', 'tasks-list');

		listContainer.append(this.tasksList);

		const footerContainer = this._createElement('div', 'footer-container');

		this.form = this._createElement('form', 'task-form');

		this.input = this._createElement('input', 'input', {
			type: 'text',
			name: 'task',
			id: 'add-task-input',
			placeholder: 'Ingresa una tarea nueva...',
		});

		this.form.append(this.input);

		this.addTaskButton = this._createElement('button', 'button', {
			type: 'button',
			id: 'add-task-button',
			textContent: 'Agregar una tarea',
		});

		this.addTaskButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this._toggleButtonAndInputView();
		});

		footerContainer.append(this.form, this.addTaskButton);

		tasksContainer.append(this.title, listContainer, footerContainer);
		this.app.append(tasksContainer);

		this._initLocalListeners();
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

	updateTasksList(tasks) {
		const taskListElements = tasks.map((task) => {
			return this._createTaskListElement(task);
		});

		this.tasksList.replaceChildren(...taskListElements);
	}

	_createTaskListElement(task) {
		// Elemento de lista
		const taskListItem = this._createElement('li', 'task-item', {
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
		const favTaskButton = this._createElement(
			'button',
			['fav-task-button', 'task-action'],
			{
				innerHTML: task.favorite ? star_fill : star,
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
		const deleteTaskButton = this._createElement(
			'button',
			['delete-task-button', 'task-action'],
			{
				innerHTML: trash,
			}
		);

		deleteTaskButton.addEventListener('click', (event) => {
			event.stopPropagation();
			this.onDeleteTask(task.id);
		});

		taskListItem.innerHTML = `
                <div class="check">
                    ${task.settled ? check : circle}
                </div>
				<div class="task">
				    <p class="task-title">${task.text}</p>
                </div>
            `;

		taskListItem.appendChild(favTaskButton);
		taskListItem.appendChild(deleteTaskButton);

		return taskListItem;
	}

	_createElement(tagName, classList, props) {
		return createElement(tagName, classList, props);
	}

	_getElement(selector) {
		return getElement(selector);
	}
}
