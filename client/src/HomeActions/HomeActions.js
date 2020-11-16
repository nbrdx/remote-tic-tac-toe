import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import './HomeActions.css';
import { useSocket } from 'use-socketio';

const HomeActions = () => {
  const [selectedAction, setSelectedAction] = useState('');
  const { socket } = useSocket('gameCreated', (gameId) =>
    history.push(`/game/${gameId}`)
  );
  const history = useHistory();

  const createPrivateGameHandler = () => {
    setSelectedAction('private');
    socket.emit('createPrivateGame');
  };

  const findOpponentHandler = () => {
    setSelectedAction('public');
    socket.emit('findOpponent');
  };

  const cancelFindOpponentHandler = () => {
    setSelectedAction('');
    socket.emit('cancelFindOpponent');
  };

  const actions =
    selectedAction === 'public' ? (
      <div className='Waiting'>
        <p>Waiting for an opponent</p>
        <div className='Loader'></div>
        <button onClick={cancelFindOpponentHandler}>Cancel</button>
      </div>
    ) : (
      <React.Fragment>
        <button onClick={createPrivateGameHandler}>
          Create a private game
        </button>
        <button onClick={findOpponentHandler}>Find an opponent</button>
      </React.Fragment>
    );

  return <div className='HomeActions'>{actions}</div>;
};

export default HomeActions;
