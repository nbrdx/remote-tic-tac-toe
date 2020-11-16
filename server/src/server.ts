import http from 'http';
import SocketIO from 'socket.io';

import { initGame } from './game';

const PORT = process.env.PORT || 4001;

const server = http.createServer();
const io = SocketIO(server);

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  initGame(io, socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
