var express = require('express');
var request = require('request-promise');
var fs = require('fs');
var log = fs.createWriteStream('./public/results.txt', {flags: 'a'});
log.writeLine = (s) => log.write(s + '\n');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's',
't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const appendSearchesByQuery = (q) => {
  console.log('query: ' + q);
  return request(`http://suggestgz.mlapps.com/sites/MLA/autosuggest?showFilters=true&limit=20000&api_version=2&q=${q}`)
    .then((body) => {
      var result = JSON.parse(body).suggested_queries;
      var suggests = result
        .filter((suggest) => suggest.match_start === 0)
        .filter((suggest) => suggest.q.split(' ').length === 1)
        .map((suggest) => suggest.q)
        .forEach(log.writeLine);
      console.log('lenght: ' + suggests.length);
      return suggests.length;
    }).catch(() => 0);
};

app.get('/write', (req, res) => {
  var count = 0;
  var promise = Promise.resolve(0);
  characters.forEach((c1) => characters.forEach((c2) =>
    promise = promise.then((c) => {
      count+= c;
      console.log('Sum: ' + count);
      return appendSearchesByQuery(c1 + c2)
    })));
  res.send();
});

app.get('/write2', (req, res) => {
  var promise = Promise.resolve();

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

