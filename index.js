var express = require('express'),
  bodyParser = require('body-parser'),
  isObject = require('isobject'),
app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res) {
  if (!req.body) return res.status(400).status('No JSON body found in the POST request');

  // here is the input
  // console.log(req.body);

  var mirror = req.body

  // add proper return type header
  res.setHeader('Content-Type', 'text/plain')

  // if there is a query provided, apply it to the body
  if (req.query.q) {
    var lastPathTerm = '';

    function index(obj, i) {
      var matches = [];
      i.replace(/\[(.*?)\]/, function(g0, g1) {
        matches.push(g1);
      })

      // if they are referencing the previous array, validate and return
      if (i === '[]') {
        if (isObject(obj)) {
          return res.status(400).send('Invalid query path, ' + req.query.q + ' for the POST object');
        } else if (typeof obj === 'object') {
          lastPathTerm = i;
          return obj;
        } else {
          return res.status(400).send('Invalid query path, ' + req.query.q + ' for the POST object');
        }
      // if they are referencing a partial array, recursively complete query and return
      } else if (matches.length) {
        if (i.indexOf("[") !== 0) {
          return res.status(400).send('Invalid query path, ' + req.query.q + ' for the POST object');
        } else {
          lastPathTerm = i;
          return obj[matches[0]];
        }
      }
      else {
        if (lastPathTerm == '[]') {
          if (isObject(obj)) {
            lastPathTerm = i;
            return obj[i];
          } else if (typeof obj === 'object') {
            console.log("Searching for " + i + " in " + JSON.stringify(obj));
            var subquery = [];
            obj.forEach(function (child, n) {
              console.log(child);
              subquery.push(index(child, i));
            });
            lastPathTerm = i;
            return subquery;
          } else {
            lastPathTerm = i;
            return obj[i];
          }
        } else {
          lastPathTerm = i;
          return obj[i];
        }
      }
    }

    mirror = req.query.q.split('.').reduce(index, mirror);
  }

  // prettyprint and echo the result back
  res.send(JSON.stringify(mirror, null, 2));
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('JSON Mirror listening at http://%s:%s', host, port);
});
