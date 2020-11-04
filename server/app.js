const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// const axios = require('axios');

const port = process.env.PORT || 4001;
const routes = require('./routes/index');

const app = express();
app.use(routes);

const server = http.createServer(app);
const io = socketIo(server);

let interval;

io.on('connection', (socket) => {
  console.log('New client connected');

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    getApiAndEmit(socket);
  }, 1000);

  socket.on('test', (data) => {
    console.log(data)
  })

  socket.on('chat message', msg => console.log(`message:${msg}`) )

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit('FromAPI', response);
};

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
