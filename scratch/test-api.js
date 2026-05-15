const http = require('http');

http.get('http://localhost:3000/api/analytics/team-performance', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
