import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

import routes from './routes/index';
import { initGame } from './game';

const port = process.env.PORT || 4001;

const app = express();
app.use(routes);

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  initGame(io, socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
