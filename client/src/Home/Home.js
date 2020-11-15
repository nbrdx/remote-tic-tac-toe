import React from 'react';
import { useHistory } from 'react-router-dom';

import { useSocket } from 'use-socketio';

const Home = () => {
  const { socket } = useSocket('gameCreated', (game) => {
    history.push(`/game/${game.id}`);
  });
  const history = useHistory();

  const createRoomHandler = () => {
    socket.emit('createGame');
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <button onClick={createRoomHandler}>Create game</button>
    </div>
  );
};

export default Home;
