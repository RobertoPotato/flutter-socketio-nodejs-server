// I use express server for this demo. But I'm sure it can work with any other equivalent framework
const express = require('express'); // Bring in express
const app = express(); // initialize express
const server = require('http').Server(app); // Initialize a new server, and pass in the initialized express app
const io = require('socket.io')(server); // Bring in socket.io

// Home route, for testing purposes on browser or phone
app.get('/', (req, res) => {
  var message = 'You have reached home';
  console.log(message);
  res.send(message);
});

// Receive incoming socket connections
io.on('connection', function (socket) {
  console.log('A user has just connected'); // Prints to console upon new user connections

  // Receive the emitted counter event from flutter app
  socket.on('counter', function (msg) {
    // Log the message associated with the event on the console
    console.log(msg);

    // As a response, emit the same message to connected sockets
    io.emit('counterResponse', msg);
  });

  // .. More events can come here ..
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`App started and is running on port ${PORT}`);
});
