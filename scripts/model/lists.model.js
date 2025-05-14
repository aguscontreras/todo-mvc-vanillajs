export class ListsModel {
  _defaultListConfig = {
    color: "#8bd3ce",
    icon: "list",
    ignoreStorage: false,
  };

  constructor() {
    this._initLists();
  }

  _initLists() {
    const myDayList = this._createNewList("Mi dia", {
      id: "1",
      ignoreStorage: true,
      icon: "assignment",
    });

    const favoritesList = this._createNewList("Favoritos", {
      id: "2",
      ignoreStorage: true,
      icon: "star",
      color: "#e2f063",
    });

    setTimeout(() => {
      const storedLists = JSON.parse(localStorage.getItem("lists")) ?? [];
      this.setLists([myDayList, favoritesList, ...storedLists]);
      this.setActiveList(myDayList);
    }, 0);
  }

  bindListsListChanged(callback) {
    this.onListsListChanged = callback;
  }

  bindActiveListChanged(callback) {
    this.onActiveListChanged = callback;
  }

  setLists(lists) {
    this._lists = lists;
    this._commit(this._lists);
  }

  getLists() {
    return this._lists;
  }

  setActiveList(list) {
    this._activeList = list;
    this.onActiveListChanged(this._activeList);
  }

  getActiveList() {
    return this._activeList;
  }

  find(id) {
    return this.getLists().find((e) => e.id === id);
  }

  create(formData) {
    const name = formData.get("name");
    const icon = formData.get("icon");
    const color = formData.get("color");

    this.setLists([
      ...this.getLists(),
      this._createNewList(name, { icon, color }),
    ]);
  }

  _createNewList(name, config) {
    return {
      ...this._defaultListConfig,
      ...config,
      id: config.id ?? crypto.randomUUID(),
      name: name,
    };
  }

  update(id, { name, color, icon }) {
    this.setLists(
      this.getLists().map((list) =>
        list.id === id
          ? {
              ...list,
              name: name ?? list.name,
              color: color ?? list.color,
              icon: icon ?? list.icon,
            }
          : list
      )
    );
  }

  delete(id) {
    this.setLists(this.getLists().filter((list) => list.id !== id));
  }

  deleteAll() {
    this.setLists([]);
  }

  _commit(lists) {
    const storeLists = lists.filter((e) => !e.ignoreStorage);
    localStorage.setItem("lists", JSON.stringify(storeLists));

    if (this.onListsListChanged) {
      this.onListsListChanged(lists, this.activeListId);
    }
  }
}
