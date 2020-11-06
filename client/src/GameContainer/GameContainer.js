import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useLastMessage, useSocket } from 'use-socketio';

import GameBoard from '../GameBoard/GameBoard';

const GameContainer = () => {
  const { socket } = useSocket('gameNotJoinable', () => {
    console.log('game not joinable');
    history.push('/');
  });

  useSocket('gameJoined', (game) => {
    console.log('game joined');
  });

  const { data: gameInfo } = useLastMessage('gameInfo');
  const history = useHistory();
  let { gameId } = useParams();

  useEffect(() => {
    console.log('join game');
    socket.emit('joinGame', gameId);
  }, [socket, gameId]);

  const playCellHandler = (cellIndex) => {
    socket.emit('playCell', cellIndex);
  };

  return (
    <React.Fragment>
      <GameBoard {...gameInfo} cellPlayed={playCellHandler} />
      <button onClick={() => history.push('/')}>Home</button>
      <p>{gameInfo?.id}</p>
      <p>{gameInfo?.sockets.join('')}</p>
    </React.Fragment>
  );
};

export default GameContainer;
