// I use express server for this demo. But I'm sure it can work with any other equivalent framework
const express = require('express'); // Bring in express
const app = express(); // initialize express
const server = require('http').Server(app); // Initialize a new server, and pass in the initialized express app
const io = require('socket.io')(server); // Bring in socket.io

// List of users
var users = [];
function showAllUsers() {
  console.log(`${users.length} Users`);
  for (i = 0; i < users.length; i++) {
    console.log(users[i].socket + ' : ' + users[i].userName);
  }
}

function addUser(userName, socketId) {
  const newUser = {
    userName: userName,
    socket: socketId,
  };

  // See if the user is in the list
  let user = users.find((user) => user.userName === userName);

  // If user is in list, delete the old user
  if (user) {
    index = users.indexOf(user);

    users.splice(index, 1);
  }

  // Add new User data
  users.push(newUser);
  showAllUsers();
}

function findUserSocketId(userName) {
  console.log(`USERNAME IN findSocketId: ${userName}`);
  let user = users.find((user) => user.userName == userName);
  if (user) {
    return user.socket;
  }
}

function removeDisconnectedUser(userName) {
  let user = users.find((user) => user.userName === userName);
  index = users.indexOf(user);

  users.splice(index, 1);
}

function getAllUsers() {
  return users;
}

// Home route, for testing purposes on browser or phone
app.get('/', (req, res) => {
  var message = 'You have reached home';
  console.log(message);
  res.send(message);
});

// Receive incoming socket connections
io.on('connection', function (socket) {
  console.log('A user has just connected'); // Prints to console upon new user connections

  socket.on('join', function (data) {
    addUser(data, socket.id);
    //* Get list of all users in the server
    socket.emit('userList', users);
    console.log(users);
  });

  socket.on('counter', function (msg) {
    console.log(msg);
    io.emit('counterResponse', msg);
  });

  socket.on('typing', function (data) {
    console.log(`TYPING ${data}`);
    io.emit('typing', data);
  });

  socket.on('message', function (data) {
    console.log(`MESSAGE RECEIVED ${data}`);
    recipient = findUserSocketId(data.receiver);
    console.log(`RECIPIENT SOCKET ID: ${recipient}`); //TODO CHANGE BACK
    socket.broadcast.to(recipient).emit('message', data);

    //io.emit('message', data);
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected...');
    // handleDisconnect()
  });

  // .. More events can come here ..
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`App started and is running on port ${PORT}`);
});
