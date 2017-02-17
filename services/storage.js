const ItemSearch = require('../model/model');
var client;
class DB {
  constructor(esClient) {
    client = esClient;
    this.Schema = {
      index: 'wolla-meli-item-test-1',
      body: {
        mappings: {
          ItemSearch: {
            properties: {
              id: {
                type: 'string',
                index: "not_analyzed"
              },
              title: {
                type: 'string',
                index: "not_analyzed"
              },
              categories: {
                type: 'array',
                index: "not_analyzed"
              },
              total: {
                type: 'numeric',
                index: "not_analyzed"
              }
            }
          }
        }
      }
    };
    client.indices.create(this.Schema);
  }

  addEntity(entity) {
    var item = new ItemSearch(entity);
    return client.create({index: 'wolla-meli-item-test-1', type: 'ItemSearch', id: item.id, body: item});
  }

  clean() {
    return client.indices.delete({index:'wolla-meli-item-test-1'});
  }
};

module.exports = DB;