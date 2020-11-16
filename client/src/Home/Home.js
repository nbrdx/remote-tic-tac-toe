import React from 'react';
import { useHistory } from 'react-router-dom';

import { useSocket } from 'use-socketio';

const Home = () => {
  const { socket } = useSocket('gameCreated', (gameId) =>
    history.push(`/game/${gameId}`)
  );

  const history = useHistory();

  const createPrivateGameHandler = () => {
    socket.emit('createPrivateGame');
  };

  const findOpponentHandler = () => {
    socket.emit('findOpponent');
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <button onClick={createPrivateGameHandler}>Create a private game</button>
      <button onClick={findOpponentHandler}>Find an opponent</button>
    </div>
  );
};

export default Home;
