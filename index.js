var express = require('express');
var request = require('request-promise');
var Promise = require('bluebird');
var fs = require('fs');
var log1 = fs.createWriteStream('./public/results.1.txt', {flags: 'a'});
var input1 = fs.createReadStream('./public/results.1.txt');
log1.writeLine = (s) => log1.write(s + '\n');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's',
't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const mock = ['a', 'b', 'c'];

const appendSearchesByQuery = (q) => {
  return request(`http://suggestgz.mlapps.com/sites/MLA/autosuggest?showFilters=true&limit=20000&api_version=2&q=${q}`)
    .then((body) => {
      var result = JSON.parse(body).suggested_queries;
      var suggests = result
        .filter((suggest) => suggest.match_start === 0)
        .filter((suggest) => suggest.q.split(' ').length === 1)
        .map((suggest) => suggest.q);
        suggests.forEach(log1.writeLine);
      return suggests.length;
    }).catch(() => 0);
};

app.get('/write', (req, res) => {
  var promise = Promise.resolve(0);
  var promises = [];
  characters.forEach((c1) => characters.forEach((c2) => {
      promise = promise.then((c) => appendSearchesByQuery(c1 + c2));
      promises.push(promise);
  }));
  Promise.all(promises)
    .then((results) => {
      results.forEach((value) => console.log(value));
      var total = results.reduce((v, n) => v + n, 0);
      console.log('Final: ' + total);
      console.log('Promedio: ' + total/results.length);
    });
  res.send();
});

app.get('/write2', (req, res) => {
  input1.

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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

process.on('exit', () => log.end());

