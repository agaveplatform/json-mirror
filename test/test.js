var request = require('request'),
    testdata = require('./testdata.js');

request.post({
  url: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testdata))
}, function(error, response, body) {
  console.log(body);
});

request.post({
  url: 'http://localhost:3000/?q=[].tags',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testdata))
}, function(error, response, body) {
  console.log(body);
});

request.post({
  url: 'http://localhost:3000/?q=[].friends.[].name',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testdata))
}, function(error, response, body) {
  console.log(body);
});

request.post({
  url: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testdata))
}, function(error, response, body) {
  console.log(body);
});
