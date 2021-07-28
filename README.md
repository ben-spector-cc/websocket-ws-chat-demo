# WebSockets-ws Chat Application Demo

## Getting Started

* requires a `../sslcert` folder with `cert.pem` and `key.pem`
* I was able to generate these files using the terminal command below

```sh
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 100 -nodes
```

## Starter vs. Basic vs. Solution Versions

The versions of the application indicate the progression the learner will follow while building this app:

* `server.starter.js` and `index.starter.html` implement:
  * Starts a basic http server listening on port 8080
  * Serves the `index.html` file
  * Renders a basic structure of a chat app that can renders the message the user types
  * Cannot yet establish a WS connection
* `server.echo` and `index.echo.html` implement all of the above plus:
  * Establishing a WebSocket connection
  * Client > Server Messages (send messages to the server)
  * Server > Client Messages (server echoes message back)
  * Cannot yet broadcast messages to other sockets connected to the server
* `server.js` and `index.html` implement all of the above plus:
  * Broadcasting messages from server to all open socket connections
  * Using custom message types to distinguish between `'newUser'` and `'newMessage'` message types
* `server.secure.js` and `index.secure.html` implement all of the above plus:
  * Using a secure HTTPS connection and the `wss://` protocol
  