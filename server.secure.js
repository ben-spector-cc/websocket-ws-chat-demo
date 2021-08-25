///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

// Node Modules
const https = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// You may choose to use the constants defined in the file below
const CONSTANTS = require('./utils/constants.js');
const { PORT, CLIENT, SERVER } = CONSTANTS;

// ssl cert/key generated using the following terminal command:
// openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 100 -nodes
const privateKey = fs.readFileSync('../sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('../sslcert/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

const httpServer = https.createServer(credentials, (req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  const filePath = ( req.url === '/' ) ? '/public/index.secure.html' : req.url;

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  if (extname === '.js') contentType = 'text/javascript';
  else if (extname === '.css') contentType = 'text/css';

  // pipe the proper file to the res object
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(`${__dirname}/${filePath}`, 'utf8').pipe(res);
});

///////////////////////////////////////////////
////////////////// WS LOGIC ///////////////////
///////////////////////////////////////////////

const wsServerOptions = { server: httpServer };
const wsServer = new WebSocket.Server(wsServerOptions);

// This function should emit a message to every client connected to the server 
// If provided, do not send the message to the client provided by the socketToOmit argument
function broadcast(data, socketToOmit) {
  // All connected sockets can be found at wsServer.clients
  wsServer.clients.forEach((client) => {
    // Send to all clients in the open readyState, excluding the socketToOmit (if provided)
    if (client.readyState === WebSocket.OPEN && client !== socketToOmit) {
      client.send(JSON.stringify(data));
    }
  });
}


// The callback provided to .on() will be executed each time the server detects a 'connection' event. It receives a socket object as an argument
// The callback should print that new connection has been made to the server's terminal.
// Define a callback handler on each client for 'message' events. 
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
httpServer.listen(PORT, () => {
  console.log(`Listening on: https://localhost:${httpServer.address().port}`);
});
