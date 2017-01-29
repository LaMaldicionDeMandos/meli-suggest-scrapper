var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  var q = req.query.q;
  request(`http://suggestgz.mlapps.com/sites/MLA/autosuggest?showFilters=true&limit=20000&api_version=2&q=${q}`,
    (err, response, body) => {
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


