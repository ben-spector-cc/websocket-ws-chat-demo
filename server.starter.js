///////////////////////////////////////////////
///////////// IMPORTS + VARIABLES /////////////
///////////////////////////////////////////////

// TODO
// Exercise 10: Upgrade http package to https

// Node Modules
const http = require('http'); 
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// You may choose to use the constants defined in the file below
const CONSTANTS = require('./utils/constants.js');
const { PORT, CLIENT, SERVER } = CONSTANTS;

// TODO
// Exercise 10: Generate certificates for a secure HTTP connection.

///////////////////////////////////////////////
///////////// HTTP SERVER LOGIC ///////////////
///////////////////////////////////////////////

// TODO
// Exercise 10: Pass the credentials to the https server

// Create the HTTP server
const server = http.createServer((req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  const filePath = ( req.url === '/' ) ? '/public/index.starter.html' : req.url;

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

// TODO
// Exercise 3: Create the WebSocket Server using the HTTP server
// Exercise 10: Use the secure HTTPS server to  create your WebSocket Server


// TODO
// Exercise 8: Implement the broadcast pattern. Exclude the emitting socket!


// TODO
// Exercise 5: Respond to connection events 
// Exercise 6: Respond to client messages
// Exercise 7: Send a message back to the client, echoing the message received
// Exercise 8: Broadcast messages received to all other clients
// Exercise 9: Send custom message types to distinguish new users and new messages


// Start the server listening on localhost:8080
server.listen(PORT, () => {
  console.log(`Listening on: https://localhost:${server.address().port}`);
});

