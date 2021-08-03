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
  const filePath = ( req.url === '/' ) ? '/public/index.html' : req.url;

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

// include a socket if you want to leave it out, otherwise broadcast to every open socket
function broadcast(data, socketToOmit) {
  // All connected sockets can be found at wsServer.clients
  wsServer.clients.forEach((client) => {
    // Send to all clients in the open readyState, excluding the socketToOmit if provided
    if (client.readyState === WebSocket.OPEN && client !== socketToOmit) {
      client.send(JSON.stringify(data));
    }
  });
}

// a new socket will be created for each individual client
wsServer.on('connection', (socket) => {
  console.log('new connection!');

  socket.on('message', (data) => {
    const { type, payload } = JSON.parse(data);
    
    console.log(type, payload);
    
    switch (type) {
      case CLIENT.MESSAGE.NEW_USER:
        const time = new Date().toLocaleString();
        broadcast({
          type: SERVER.BROADCAST.NEW_USER,
          payload: { name: payload.name, time }
        })
        break;
      case CLIENT.MESSAGE.NEW_MESSAGE:
        broadcast({
          type: SERVER.BROADCAST.NEW_MESSAGE,
          payload: { name: payload.name, message: payload.message }
        }, socket)
        break;
      default:
        break;
    }
  });
});

// Start the server listening on localhost:8080
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
