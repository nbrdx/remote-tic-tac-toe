import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useLastMessage, useSocket } from 'use-socketio';

import GameBoard from '../GameBoard/GameBoard';

const GameContainer = () => {
  const { socket } = useSocket('gameNotJoinable', () => {
    console.log('game not joinable');
    history.push('/');
  });

  const { data: gameInfo, socket: socketGameInfo } = useLastMessage('gameInfo');
  const history = useHistory();
  let { gameId } = useParams();

  useEffect(() => {
    socket.emit('joinGame', gameId);

    return () => socket.emit('leaveGame', gameId);
  }, [socket, gameId]);

  const playCellHandler = (cellIndex) => {
    socket.emit('playCell', cellIndex);
  };

  return (
    <React.Fragment>
      <GameBoard {...gameInfo} cellPlayed={playCellHandler} />
      <button onClick={() => history.push('/')}>Home</button>
      <p>gameId: {gameInfo?.id}</p>
      <p>socket: {socket.id}</p>
      <p>players sockets:[{gameInfo?.sockets.join(', ')}]</p>
    </React.Fragment>
  );
};

export default GameContainer;
