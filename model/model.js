const idGenerator = require('shortid');
class ItemSearch {
  constructor(item) {
    this.id = idGenerator.generate()
    this.title = item.title;
    this.categories = item.categories;
    this.total = item.total;
  }
}

module.exports = ItemSearch;
