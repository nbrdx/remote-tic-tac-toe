import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSocket } from 'use-socketio';

import './HomeActions.css';
import Button from '../Button/Button';

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
        <div className='LoaderContainer'>
          <div className='Loader'></div>
        </div>
        <Button onClick={cancelFindOpponentHandler}>Cancel</Button>
      </div>
    ) : (
      <React.Fragment>
        <Button onClick={createPrivateGameHandler}>
          Create a private game
        </Button>
        <Button onClick={findOpponentHandler}>Find an opponent</Button>
      </React.Fragment>
    );

  return <div className='HomeActions'>{actions}</div>;
};

export default HomeActions;
