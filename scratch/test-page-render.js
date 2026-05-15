const http = require('http');

http.get('http://localhost:3000/team', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  res.resume();
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
