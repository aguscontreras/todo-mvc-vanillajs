import { appIconsMap, iconsMap } from "../../constants/svg/svg_constants.js";
import { hexColors } from "../../constants/theme/colors.js";
import { createElement, getElement, getElements } from "../helpers/dom.js";

export class ListsView {
  _showAddListForm = false;

  constructor() {
    this._initStructure();
    this._initLocalListeners();
  }

  setActiveList(list) {
    this._activeList = list;
  }

  getActiveList() {
    return this._activeList;
  }

  bindOnListClick(handler) {
    this.onActiveListChanged = handler;
  }

  selectList(list, event) {
    getElements(".list-item").forEach((e) => {
      if (event.target.closest("li") === e) {
        e.classList.add("active");
      } else {
        e.classList.remove("active");
      }
    });

    const root = getElement(":root");
    root.style.setProperty("--active-color", list.color);
    this.onActiveListChanged(list);
  }

  _handleIconSelect(input, icon, event) {
    event.stopPropagation();
    input.value = icon;

    getElements(".icon-selector").forEach((e) => {
      e.classList.remove("active");

      if (e.dataset.icon === input.value) {
        e.classList.add("active");
      }
    });
  }

  _handleColorSelect(input, color, event) {
    event.stopPropagation();
    input.value = color;

    getElement(":root").style.setProperty("--temp-color", color);

    getElements(".color-selector").forEach((e) => {
      e.classList.remove("active");

      if (e.dataset.color === input.value) {
        e.classList.add("active");
      }
    });
  }

  bindOnAddList(handler) {
    this.onAddList = handler;
  }

  displayLists(lists) {
    const listElements = lists.map((list) => this._createListElement(list));
    this.listsContainer.replaceChildren(...listElements);
  }

  _initStructure() {
    this.app = getElement("#app");
    this.asideContainer = createElement("aside", "lists-container");
    this.listsContainer = createElement("ul", "lists-list");

    const createListContainer = createElement("div", "create-list-container");

    this.createListButton = createElement(
      "button",
      ["create-list", "button", "button-text", "button-neutral", "button-sm"],
      { textContent: "Nueva lista" }
    );

    this.formContainer = createElement("div", ["form-container", "mb-1"]);

    this.addListForm = createElement("form");

    this._createForm();

    createListContainer.append(this.createListButton);

    this.asideContainer.append(
      this.listsContainer,
      this.formContainer,
      createListContainer
    );

    this.app.prepend(this.asideContainer);
  }

  _createForm() {
    this._nameInput = createElement("input", "input", {
      type: "text",
      name: "name",
      id: "list-name-input",
      placeholder: "Ingresa el nombre de tu lista...",
    });

    this._colorInput = createElement("input", "input", {
      type: "hidden",
      name: "color",
      id: "list-color-input",
    });

    this._iconInput = createElement("input", "input", {
      type: "hidden",
      name: "icon",
      id: "list-icon-input",
    });

    const colorSelectTitle = createElement("h4", "metadata-selector-subtitle", {
      textContent: 'Color'
    });

    const iconSelectTitle = createElement("h4", "metadata-selector-subtitle", {
      textContent: 'Icono'
    });

    const colorSelectorContainer = createElement(
      "div",
      "metadata-selector-container"
    );

    const colorItems = hexColors.map((color) => {
      const outside = createElement("div", [
        "metadata-selector-outside",
        "color-selector",
      ]);

      outside.setAttribute("data-color", color);

      const selector = createElement("div", "metadata-selector");
      selector.style.background = color;

      outside.append(selector);

      outside.addEventListener("click", (event) => {
        this._handleColorSelect(this._colorInput, color, event);
      });

      return outside;
    });

    const iconSelectorContainer = createElement(
      "div",
      "metadata-selector-container"
    );

    const iconsItems = Object.keys(iconsMap).map((icon) => {
      const outside = createElement("div", [
        "metadata-selector-outside",
        "icon-selector",
      ]);

      outside.setAttribute("data-icon", icon);

      const selector = createElement("div", "metadata-selector");
      selector.innerHTML = iconsMap[icon];

      outside.append(selector);

      outside.addEventListener("click", (event) => {
        this._handleIconSelect(this._iconInput, icon, event);
      });

      return outside;
    });

    colorSelectorContainer.append(...colorItems);
    iconSelectorContainer.append(...iconsItems);

    this.addListForm.append(
      this._nameInput,
      colorSelectTitle,
      colorSelectorContainer,
      iconSelectTitle,
      iconSelectorContainer,
      this._colorInput,
      this._iconInput
    );
  }

  _initLocalListeners() {
    document.addEventListener("click", (event) => {
      if (this._showAddListForm && !this.formContainer.contains(event.target)) {
        this._toggleAddListForm();
      }
    });

    this.addListForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const dataForm = new FormData(this.addListForm);

      if (dataForm.get("name")) {
        this.onAddList(dataForm);
        this._toggleAddListForm();
      }
    });

    this.createListButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (this._showAddListForm) {
        this.addListForm.dispatchEvent(new Event("submit"));
      } else {
        this._toggleAddListForm();
      }
    });
  }

  _toggleAddListForm() {
    this.addListForm.reset();
    this._showAddListForm = !this._showAddListForm;
    this._colorInput.value = "";
    this._iconInput.value = "";

    getElements(".metadata-selector-outside").forEach((e) => {
      e.classList.remove("active");
    });

    if (this._showAddListForm) {
      this.formContainer.appendChild(this.addListForm);
      this.formContainer.style.setProperty("display", "block");
      this.createListButton.textContent = "Guardar";
      this._nameInput.focus();
    } else {
      this.formContainer.removeChild(this.addListForm);
      this.formContainer.style.setProperty("display", "none");
      this.createListButton.textContent = "Nueva lista";
    }
  }

  _createListElement(list) {
    const listItem = createElement("li", "list-item");
    const pendingTasks = 0;

    listItem.addEventListener("click", (event) => {
      this.selectList(list, event);
    });

    listItem.innerHTML = `
        <div class="icon-container">${this._getSvgListIcon(list.icon)}</div>
			  <div class="list-name"><p class="name">${list.name}</p></div>
			  <div class="badge-container"><span class="badge">${pendingTasks}</span><div>
        `;

    return listItem;
  }

  _getSvgListIcon(listIcon) {
    switch (listIcon) {
      case "star":
        return appIconsMap.star;
      case "work":
        return iconsMap.work;
      case "shopping":
        return iconsMap.shopping;
      case "school":
        return iconsMap.school;
      case "pet":
        return iconsMap.pet;
      case "payments":
        return iconsMap.payments;
      case "house":
        return iconsMap.house;
      case "fitness":
        return iconsMap.fitness;
      case "computer":
        return iconsMap.computer;
      case "camping":
        return iconsMap.camping;
      case "assignment":
        return appIconsMap.assignment;
      default:
        return iconsMap.list;
    }
  }
}
