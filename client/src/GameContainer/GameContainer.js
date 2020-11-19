import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useLastMessage, useSocket } from 'use-socketio';

import './GameContainer.css';
import Game from '../Game/Game';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';

const GameContainer = () => {
  const { socket } = useSocket('gameNotJoinable', () => history.push('/'));
  const { data: gameUpdate } = useLastMessage('gameUpdated');

  const history = useHistory();
  let { gameId } = useParams();

  useEffect(() => {
    socket.emit('joinGame', gameId);

    return () => socket.emit('leaveGame', gameId);
  }, [socket, gameId]);

  if (!gameUpdate) {
    return (
      <div className='Waiting'>
        <p>Share the URL with a friend !</p>
        <Loader />
      </div>
    );
  }

  const playCellHandler = (cellIndex) => {
    socket.emit('playCell', cellIndex);
  };

  const replayHandler = () => {
    socket.emit('replayGame');
  };

  const playerSocketIndex = gameUpdate.sockets.findIndex(
    (s) => s === socket.id
  );

  const player = {
    name: 'You',
    icon: gameUpdate.icons[playerSocketIndex],
    score: gameUpdate.scores[playerSocketIndex],
  };

  const opponent = {
    name: 'Opponent',
    icon: gameUpdate.icons[playerSocketIndex === 1 ? 0 : 1],
    score: gameUpdate.scores[playerSocketIndex === 1 ? 0 : 1],
  };

  return (
    <React.Fragment>
      <Game
        gameState={gameUpdate.gameState}
        status={gameUpdate.status}
        currentPlayer={gameUpdate.icons[gameUpdate.currentPlayer]}
        player={player}
        opponent={opponent}
        drawScore={gameUpdate.scores[2]}
        cellPlayed={playCellHandler}
      />

      {gameUpdate.status !== 'play' && (
        <div className='Actions'>
          <Button onClick={replayHandler}>
            Replay {gameUpdate.playAgain.length > 0 &&
              `(${gameUpdate.playAgain.length}/2)`}
          </Button>
          <Button onClick={() => history.push('/')}>Back to Home</Button>
        </div>
      )}
    </React.Fragment>
  );
};

export default GameContainer;
