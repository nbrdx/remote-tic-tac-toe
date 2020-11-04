const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { uuidv4 } = require('uuid');

const port = process.env.PORT || 4001;
const routes = require('./routes/index');

const app = express();
app.use(routes);

const server = http.createServer(app);
const io = socketIo(server);

let interval;

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Custom Events
  socket.on('test', (data) => {
    console.log(data);
  });

  socket.on('createRoom', (roomName, cb) => {
    const room = {
      id: uuidv4(),
    };

    console.log(room);
    
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
