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

function isArray(obj) {
  return (!isObject(obj) && (typeof obj === 'object'));
}

function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

app.use(function(req, res) {
  if (!req.body) return res.status(400).status('No JSON body found in the POST request');

  // here is the input
  //console.log(req.body);

  var result = req.body

  // add proper return type header
  res.setHeader('Content-Type', 'text/plain')

  var spacing = 2;
  if (req.query.spaces) {
    if (isInt(req.query.spaces)) {
      spacing = parseInt(req.query.spaces);
      if (spacing < 0) {
        return res.status(400).status('Invalid spacing value provided. If specified, spacing should be a positive integer value.');
      }
    } else {
      return res.status(400).status('Invalid spacing value provided. If specified, spacing should be a positive integer value.');
    }
  }

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
        // objects do not have array access
        if (isObject(obj)) {
          return res.status(400).send('Invalid query path, ' + req.query.q + ' for the POST object');
        }
        // arrays return themselves
        else if (isArray(obj)) {
          lastPathTerm = i;
          return obj;
        }
        // primary type cannot have bracket access
        else {
          return res.status(400).send('Invalid query path, ' + req.query.q + ' for the POST object');
        }
      }
      // if they are referencing a partial array, recursively complete query and return
      else if (matches.length) {
        // if they are referencing via standard array access, throw exception
        if (i.indexOf("[") !== 0) {
          return res.status(400).send('Invalid query path, ' + req.query.q + ' for the POST object');
        }
        // otherwise return the value within brachets
        else {
          lastPathTerm = i;
          return obj[matches[0]];
        }
      }
      // no brackets in this term, so we look backwards to determine
      // whether we need to apply the term to all elements of the previous
      // array
      else {
        // was the last term an array?
        if (lastPathTerm === '[]') {
          // if the result was an object...shouldn't happen, but if it does
          // look up by object key
          if (isObject(obj)) {
            //lastPathTerm = i;
            return obj[i];
          }
          // if it is an array
          else if (isArray(obj)) {
            //console.log("Searching for " + i + " in " + JSON.stringify(obj));
            var subquery = [];
            //lastPathTerm = i;
            obj.forEach(function(child) {
              console.log(child);
              subquery.push(index(child, i));
            });

            return subquery;
          }
          // otherwise get the actual index value
          else {
            //lastPathTerm = i;
            return obj[i];
          }
        }
        // last term was not an array, so apply standard lookup
        else {
          lastPathTerm = i;
          console.log(obj);
          console.log(i);
          return obj[i];
        }
      }
    }

    result = req.query.q.split('.').reduce(index, result);
  }

  function stripResponse(obj) {
    if (isArray(obj)) {
      var isStructured = false;
      obj.forEach(function(item) {
        if (isObject(item)) {
          isStructured = true;
          return false;
        }
      });

      if (isStructured) {
        return JSON.stringify(result, null, spacing);
      } else {
        return obj.join("\n");
      }

    } else if (isObject(obj)) {
      return obj.replace(/\\"/g, "\uFFFF").replace(/\"([^"]+)\":/g, "$1:").replace(/\uFFFF/g, "\\\"");
    } else {
      return obj;
    }
  }

  // prettyprint and echo the result back
  if (req.query.strip) {
    res.send(stripResponse(result));
  } else {
    res.send(JSON.stringify(result, null, spacing));
  }

});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('JSON Mirror listening at http://%s:%s', host, port);
});
