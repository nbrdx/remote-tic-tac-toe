import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useLastMessage, useSocket } from 'use-socketio';

import GameBoard from '../GameBoard/GameBoard';

const GameContainer = () => {
  const { socket } = useSocket('gameNotJoinable', () => history.push('/'));
  const { data: gameUpdate } = useLastMessage('gameUpdated');

  const history = useHistory();
  let { gameId } = useParams();

  useEffect(() => {
    socket.emit('joinGame', gameId);

    return () => socket.emit('leaveGame', gameId);
  }, [socket, gameId]);

  const playCellHandler = (cellIndex) => {
    socket.emit('playCell', cellIndex);
  };

  const replayHandler = () => {
    socket.emit('replayGame');
  };

  const playingTurn = gameUpdate ? (
    gameUpdate.sockets[gameUpdate.currentPlayer] === socket.id ? (
      <p>Your turn to play !</p>
    ) : (
      <p>Waiting for your opponent...</p>
    )
  ) : null;

  const gameInfo = gameUpdate ? (
    <div className='game-info'>
      <h2>Game Info</h2>
      <p>gameId: {gameUpdate?.id}</p>
      <p>socket: {socket.id}</p>
      <p>players sockets:[{gameUpdate?.sockets.join(', ')}]</p>
    </div>
  ) : null;

  return (
    <React.Fragment>
      <GameBoard {...gameUpdate} cellPlayed={playCellHandler} />
      {playingTurn}
      {gameInfo}
      <div className='actions'>
        <button onClick={() => history.push('/')}>Home</button>
        <button onClick={replayHandler}>Replay</button>
      </div>
    </React.Fragment>
  );
};

export default GameContainer;
