const http = require('http');

const options = {
  host: 'localhost',
  port: 5002,
  path: '/',
  timeout: 2000
};

const request = http.request(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', () => {
  process.exit(1);
});

request.end();
