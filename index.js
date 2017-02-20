var express = require('express');
var request = require('request-promise');
var Promise = require('bluebird');
var Byline = require('readline-stream');
var fs = require('fs');
var _ = require('lodash');
//var es = require('elasticsearch');
//var esClient = new es.Client({host: 'localhost:9200', log:'info'});
//var db = new (require('./services/storage'))(esClient);

var log1 = fs.createWriteStream('./public/results.1.txt', {flags: 'a'});
var report1 = fs.createWriteStream('./public/reports.1.txt', {flags: 'a'});

var log2 = fs.createWriteStream('./public/results.2.txt', {flags: 'a'});
var report2 = fs.createWriteStream('./public/reports.2.txt', {flags: 'a'});

var log3 = fs.createWriteStream('./public/results.3.txt', {flags: 'a'});
var report3 = fs.createWriteStream('./public/reports.3.txt', {flags: 'a'});

var log4 = fs.createWriteStream('./public/results.4.txt', {flags: 'a'});
var report4 = fs.createWriteStream('./public/reports.4.txt', {flags: 'a'});

var log5 = fs.createWriteStream('./public/results.5.txt', {flags: 'a'});
var report5 = fs.createWriteStream('./public/reports.5.txt', {flags: 'a'});

var log6 = fs.createWriteStream('./public/results.6.txt', {flags: 'a'});
var report6 = fs.createWriteStream('./public/reports.6.txt', {flags: 'a'});

var log7 = fs.createWriteStream('./public/results.7.txt', {flags: 'a'});
var report7 = fs.createWriteStream('./public/reports.7.txt', {flags: 'a'});

var log8 = fs.createWriteStream('./public/results.8.txt', {flags: 'a'});
var report8 = fs.createWriteStream('./public/reports.8.txt', {flags: 'a'});

var log9 = fs.createWriteStream('./public/results.9.txt', {flags: 'a'});
var report9 = fs.createWriteStream('./public/reports.9.txt', {flags: 'a'});

var log10 = fs.createWriteStream('./public/results.10.txt', {flags: 'a'});
var report10 = fs.createWriteStream('./public/reports.10.txt', {flags: 'a'});

function writeLine(s) {
  this.write(s + '\n');
}
const bindWriteLine = (array) => {
  array.forEach((input) => input.writeLine = writeLine.bind(input));
};

bindWriteLine([log1, report1, log2, report2, log3, report3, log4, report4, log5, report5, log6, report6, log7, report7,
log8, report8, log9, report9, log10, report10]);

var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's',
't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const mock = ['a', 'b', 'c'];

const appendSearchesByQuery = (q, words, log) => {
  return request(`http://suggestgz.mlapps.com/sites/MLA/autosuggest?showFilters=true&limit=20000&api_version=2&q=${q}`)
    .then((body) => {
      var result = JSON.parse(body).suggested_queries;
      var suggests = result
        .filter((suggest) => suggest.match_start === 0)
        .filter((suggest) => suggest.q.split(' ').length === words)
        .map((suggest) => suggest.q);
        suggests.forEach(log.writeLine);
      return suggests.length;
    }).catch(() => 0);
};

const readFile = Promise.promisify(fs.readFile);

const getItems = () => readFile('./public/items.json', 'utf8').then(JSON.parse)

app.get('/write', (req, res) => {
  var promise = Promise.resolve(0);
  var promises = [];
  characters.forEach((c1) => characters.forEach((c2) => {
      promise = promise.then((c) => appendSearchesByQuery(c1 + c2, 1, log1));
      promises.push(promise);
  }));
  Promise.all(promises)
    .then((results) => {
      results.forEach((value) => console.log(value));
      var total = results.reduce((v, n) => v + n, 0);
      console.log('Final: ' + total);
      report1.writeLine('Total: ' + total);
      console.log('Promedio: ' + total/results.length);
      report1.writeLine('Promedio: ' + total/results.length);
    });
  res.send();
});

app.get('/write2', (req, res) => {
  var reader = fs.createReadStream('./public/results.1.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 2, log2).then((num) => {
      count++;
      sum+= num;
      report2.writeLine(`Total: ${sum} -- Promedio: ${sum/count}`);
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/write3', (req, res) => {
  var reader = fs.createReadStream('./public/results.2.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 3, log3).then((num) => {
      count++;
      sum+= num;
      report3.writeLine(`Total: ${sum} -- Promedio: ${sum/count}`);
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/write4', (req, res) => {
  var reader = fs.createReadStream('./public/results.3.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 4, log4).then((num) => {
      count++;
      sum+= num;
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/write5', (req, res) => {
  var reader = fs.createReadStream('./public/results.4.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 5, log5).then((num) => {
      count++;
      sum+= num;
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/write6', (req, res) => {
  var reader = fs.createReadStream('./public/results.5.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 6, log6).then((num) => {
      count++;
      sum+= num;
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/write7', (req, res) => {
  var reader = fs.createReadStream('./public/results.6.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 7, log7).then((num) => {
      count++;
      sum+= num;
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/write8', (req, res) => {
  var reader = fs.createReadStream('./public/results.7.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 8, log8).then((num) => {
      count++;
      sum+= num;
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/write9', (req, res) => {
  var reader = fs.createReadStream('./public/results.8.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 9, log9).then((num) => {
      count++;
      sum+= num;
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/write10', (req, res) => {
  var reader = fs.createReadStream('./public/results.9.txt');
  reader = reader.pipe(new Byline());
  var count = 0;
  var sum = 0;
  reader.on('data', (line) => {
    console.log(line);
    appendSearchesByQuery(line, 10, log10).then((num) => {
      count++;
      sum+= num;
      console.log(`Total: ${sum} -- Promedio: ${sum/count}`);
    });
  });
  res.send();
});

app.get('/', (req, res) => {
  var q = req.query.q;
  request(`http://suggestgz.mlapps.com/sites/MLA/autosuggest?showFilters=true&limit=20000&api_version=2&q=${q}`)
    .then((body) => {
      var result = JSON.parse(body).suggested_queries;
      suggests = result
        .filter((suggest) => suggest.match_start === 0)
        .filter((suggest) => suggest.q.split(' ').length === 1)
        .map((suggest) => suggest.q);
      res.send(suggests);
    });
});

var isPlural = (word) => {
  return word.endsWith('s');
}

var singularize = (word) => {
  if (isPlural(word)) {
    if (word.endsWith('ces')) return _.trimEnd(word, 'ces') + 'z';
    if (word.endsWith('es')) return _.trimEnd(word, 'es');
    if (word.endsWith('s')) return _.trimEnd(word, 's');
  }
  return word;
};

var singularizeAll = (phrase) => {
  var words = phrase.split(' ')
    .map(singularize);
  return _.join(words, ' ');

};

var changecharTo = (word, from, to) => {
  return word.replace(from, to, 'g');
}

var removeTild = (word) => {
  return changecharTo(
    changecharTo(
      changecharTo(
        changecharTo(
          changecharTo(word, 'á', 'a'),
          'é', 'e'),
        'í', 'i'),
      'ó', 'o'),
    'ú', 'u');
};

var normalize = (word) => {
  return removeTild(singularize(word.toLowerCase()));
};

var normalizeAll = (phrase) => {
  var words = phrase.split(' ')
    .map(normalize);
  return _.join(words, ' ');
}

var filterCategory = (title, name) => {
  title = normalizeAll(title);
  name = normalizeAll(name);
  return title.includes(name) || title.includes(name.replace(' ', ''));
};

var webiseQuery = (query) => query.replace(/ñ/g, '%C3%B1').replace(/Ñ/g, '%C3%B1');

var getItemCategoryWords = (categories) => {
  return _.values(categories).map((category) => category.name).reduce((list, name) => {
    return list.concat(name.split(' '));
  }, [])
    .map(normalize);
}

app.post('/load', (req, res) => {
  var index = 0;
  request("https://wolla.herokuapp.com/api/items/active").auth(null, null, true, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3dvbGxhLmF1dGgwLmNvbS8iLCJzdWIiOiJvYXV0aDJ8TWVMaXwyNDI4ODM4NzIiLCJhdWQiOiI5cjM5QkJZamNLbjZ3ejE2TnNON3gyT0I1dk9td2pWRiIsImV4cCI6MTQ4OTg0OTYxNSwiaWF0IjoxNDg3MjU3NjE1fQ.k9ASMI_yfC1Bw1oKjBE5X4CNy69QxuhmTIF3cOEsYQM')
    .then(JSON.parse)
    .map((item) => item.title)
    .each((title) => {
      return request(`https://api.mercadolibre.com/sites/MLA/category_predictor/predict?title=${webiseQuery(title)}`)
        .then(JSON.parse)
        .then((meli) => {
          console.log(++index + ' Processing: ' + title);
          var categories = meli.path_from_root
            .filter((path) => path.prediction_probability > 0.5 || filterCategory(title, path.name));
          items.push({title: title, categories: categories});
        });
    })
    .then(() => res.send(items))
    .catch((err) => res.status(500).send(err));
});

const categoryCache = {};

app.post('/load2', (req, res) => {
  var items = [];
  var index = 0;
  //db.clean();
  request("https://wolla.herokuapp.com/api/items/active").auth(null, null, true, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3dvbGxhLmF1dGgwLmNvbS8iLCJzdWIiOiJvYXV0aDJ8TWVMaXwyNDI0NTQzNTAiLCJhdWQiOiI5cjM5QkJZamNLbjZ3ejE2TnNON3gyT0I1dk9td2pWRiIsImV4cCI6MTQ5MDIwMDQ3NywiaWF0IjoxNDg3NjA4NDc3fQ.ZhQ5-W7rf9KRyUZyLzxosFbo6dp9YfvSZUptvKBBv4I')
    .then(JSON.parse)
    .map((item) => item.title)
    .map((title) => {
      var item = {title: title, categories: {}};
      return request(`https://api.mercadolibre.com/sites/MLA/search?limit=200&q=${webiseQuery(title)}`)
        .then(JSON.parse)
        .then((meli) => {
          item.total = meli.paging.total > meli.paging.limit ? meli.paging.limit : meli.paging.total;
          return meli;
        })
        .then((meli) => meli.results)
        .each((result) => {
          var promise = null;
          if (categoryCache[result.category_id]) {
            promise = Promise.resolve(categoryCache[result.category_id]);
          } else {
            promise = request(`https://api.mercadolibre.com/categories/${result.category_id}`)
              .then(JSON.parse)
              .then((cat) => {
                categoryCache[result.category_id] = cat;
                return cat;
              });
          }
          return promise
            .then((category) => category.path_from_root)
            .each((cat) => {
              if (item.categories[cat.id]) {
                item.categories[cat.id].cant++;
              } else {
                item.categories[cat.id] = {name:cat.name, cant: 1}
              }
            })
        })
        .then(() => {
          console.log(`${++index} Processing item ${item.title} categories: ${JSON.stringify(item.categories)}`);
          items.push(item);
          //db.addEntity(item);
          return null;
        })
        .thenReturn(item);
    })
    .then((items) => {
      var itemsFileToUpdate = fs.createWriteStream('./public/items.json');
      itemsFileToUpdate.write(JSON.stringify(items))
    })
    .then(() => res.send(items))
    .catch((err) => res.status(400).send(err));
});

app.get('/query2', (req, res) => {
  var query = req.query.q;
  var item = {title: query, categories: {}};
  var first = true;
  request(`https://api.mercadolibre.com/sites/MLA/search?limit=200&q=${webiseQuery(query)}`)
    .then(JSON.parse)
    .then((meli) => {
      item.total = meli.paging.total > meli.paging.limit ? meli.paging.limit : meli.paging.total;
      return meli;
    })
    .then((meli) => meli.results)
    .each((result) => {
      var promise = null;
      if (categoryCache[result.category_id]) {
        promise = Promise.resolve(categoryCache[result.category_id]);
      } else {
        promise = request(`https://api.mercadolibre.com/categories/${result.category_id}`)
          .then(JSON.parse)
          .then((cat) => {
            categoryCache[result.category_id] = cat;
            return cat;
          });
      }
      return promise
        .then((category) => category.path_from_root)
        .each((cat) => {
          if (item.categories[cat.id]) {
            item.categories[cat.id].cant++;
          } else {
            item.categories[cat.id] = {name:cat.name, cant: 1, first: first};
          }
          first = false;
        })
    })
    .thenReturn(item)
    .then((item) => {
      var matches = [];
      var percent = .7;
      var percentItem = .2;
      var categories = _.values(item.categories)
        .filter((category) => /*category.first ||*/ category.cant > item.total*percent);
      return getItems()
        .filter((item) => categories.every((category) => _.values(item.categories)
            .filter((cat) => cat.cant > item.total*percentItem)
            .some((cat) => cat.name === category.name)))
        .then((items) => {
          console.log(`items luego de categories: ${JSON.stringify(items.map((item) => item.title))}`);
          return items;
        })
        .filter((item) => {
          var phrase = normalizeAll(query).split(' ');
          var words = getItemCategoryWords(item.categories);
          phrase = phrase.filter((word) => !words.includes(word))
          return phrase.every((word) => normalizeAll(item.title).indexOf(word) >= 0);
        })
        .then((items) => {
          console.log(`items luego de filtro: ${JSON.stringify(items.map((item) => item.title.toLowerCase()))}`);
          return items;
        })
        .each((item) => matches.push(item.title))
        .thenReturn(matches);
    })
    .then((matches) => res.send(matches));
});

app.get('/items', (req, res) => {
    getItems()
      .then(JSON.stringify)
      .then((items) => res.send(items))
      .catch((err) => res.status(500).send(err));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

process.on('exit', () => log.end());

