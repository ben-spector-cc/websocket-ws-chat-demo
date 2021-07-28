const http = require('http');
const fs = require('fs');

// Constants
const PORT = process.env.PORT || 8080;

// Create the HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/styles.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' }); // http header
    fs.createReadStream('public/styles.css', 'utf8').pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // http header
    fs.createReadStream('public/index.starter.html', 'utf8').pipe(res);
  }
});

// Start the server listening on localhost:8080
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
