export class ListsController {
  constructor(listsView, listsModel) {
    this.listsView = listsView;
    this.listsModel = listsModel;

    this.listsModel.bindListsListChanged((lists) => {
      this.listsView.displayLists(lists);
    });

    this.listsView.bindOnListClick((list) => {
      this.listsModel.setActiveList(list);
    });

    this.listsView.bindOnAddList((formData) => {
      this.listsModel.create(formData);
    });

    this.listsModel.bindActiveListChanged((listId) => {
      this.onActiveListChanged(listId);
    });
  }

  bindOnActiveListChanged(callback) {
    this.onActiveListChanged = callback;
  }
}
