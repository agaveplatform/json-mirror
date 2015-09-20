var request = require('request');
request.post({
  url: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    a: 1,
    b: 2,
    c: 3
  })
}, function(error, response, body) {
  console.log(body);
});
