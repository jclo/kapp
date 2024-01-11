# README

**KApp Server** supports TCP and Web sockets.


## WebSockets

**WebSockets** are used to create a two-way communication between the server and its web client allowing to communicate and exchange data at the same time.

This communication is based on the [WebSockets](https://www.tutorialspoint.com/websockets/index.htm) protocol.


### Server side

The **server/public/_custom/socketservers/websocketserver/main.js** file shows how to listen messages coming from the client and how to send messages.


### Client side

On the client side, KApp implements an example in **public/src/apps/app/router.js**.



## TCP Sockets

**TCP Sockets** are used to create a two-way communication between the server and a client through a socket connection ([example](https://weblianz.com/blog/how-to-create-tcp-socket-server-and-client-in-nodejs)).


### Server Side

The **server/public/_custom/socketservers/tcpsocketserver/main.js** file how to listen messages coming from the client and how to send messages.


### Client Side

the file **./tcpclient/main.js** implements an example of a TCP socket client.


## Résumé

A **WebSocket** must be used when a connection between the server and its web client is required while a **TCP Socket** must be used when a script, running on the same platform as the server, wants to send directives to the server.

That's all!

-- oOo --
