const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

// Constants
const PORT = process.env.PORT || 8080;
const CLIENT_MESSAGE = {
  NEW_USER: 'NEW_USER',
  NEW_MESSAGE: 'NEW_MESSAGE'
};
const SERVER_BROADCAST = {
  NEW_USER: 'NEW_USER',
  NEW_MESSAGE: 'NEW_MESSAGE'
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/styles.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' }); // http header
    fs.createReadStream('public/styles.css', 'utf8').pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // http header
    fs.createReadStream('public/index.html', 'utf8').pipe(res);
  }
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
      case CLIENT_MESSAGE.NEW_USER:
        const time = new Date().toLocaleString();
        broadcast({
          type: SERVER_BROADCAST.NEW_USER,
          payload: { name: payload.name, time }
        })
        break;
      case CLIENT_MESSAGE.NEW_MESSAGE:
        broadcast({
          type: SERVER_BROADCAST.NEW_MESSAGE,
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
