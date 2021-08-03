const CONSTANTS = require('./utils/constants.js');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Constants
const { PORT, CLIENT, SERVER } = CONSTANTS;

// Create the HTTP server
const server = http.createServer((req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  const filePath = ( req.url === '/' ) ? '/public/index.echo.html' : req.url;

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  if (extname === '.js') contentType = 'text/javascript';
  else if (extname === '.css') contentType = 'text/css';

  // pipe the proper file to the res object
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(`${__dirname}/${filePath}`, 'utf8').pipe(res);
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
