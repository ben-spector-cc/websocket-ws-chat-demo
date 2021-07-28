const http = require('http');
const WebSocket = require('ws');
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
    fs.createReadStream('public/index.echo.html', 'utf8').pipe(res);
  }
});

// Create the WebSocket Server (ws) using the HTTP server
const wsServerOptions = { server };
const wsServer = new WebSocket.Server(wsServerOptions);

// a new socket will be created for each individual client
wsServer.on('connection', (socket) => {

  console.log('new connection!');
  socket.send('Welcome to the server!');

  socket.on('message', (message) => {
    console.log(`received: ${message}`);
    socket.send(`received: ${message}`)
  });
});

// Start the server listening on localhost:8080
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
