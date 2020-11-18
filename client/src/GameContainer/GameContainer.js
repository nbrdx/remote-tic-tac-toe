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

  const playCellHandler = (cellIndex) => {
    socket.emit('playCell', cellIndex);
  };

  const replayHandler = () => {
    socket.emit('replayGame');
  };

  if (!gameUpdate) {
    return (
      <div className='Waiting'>
        <p>Share the URL with a friend !</p>
        <Loader />
      </div>
    );
  }

  const playerSocketIndex = gameUpdate.sockets.findIndex(
    (s) => s === socket.id
  );
  const playerIcon = gameUpdate.icons[playerSocketIndex];

  const isPlayerTurn =
    gameUpdate.sockets[gameUpdate.currentPlayer] === socket.id;

  return (
    <React.Fragment>
      <Game
        gameState={gameUpdate.gameState}
        isGameActive={gameUpdate.isGameActive}
        currentPlayer={gameUpdate.icons[gameUpdate.currentPlayer]}
        isPlayerTurn={isPlayerTurn}
        playerName={'You'}
        playerIcon={playerIcon}
        opponentName={'Opponent'}
        opponentIcon={playerIcon === 'X' ? 'O' : 'X'}
        cellPlayed={playCellHandler}
      />

      {!gameUpdate.isGameActive && (
        <div className='Actions'>
          <Button onClick={replayHandler}>
            Replay {gameUpdate.playAgain.length > 0 && `(${gameUpdate.playAgain.length}/2)`}
          </Button>
          <Button onClick={() => history.push('/')}>Back to Home</Button>
        </div>
      )}

      <div className='game-info'>
        <h2>Debug Game Info TO REMOVE</h2>
        <p>gameId: {gameUpdate?.id}</p>
        <p>socket: {socket.id}</p>
        <p>players sockets:[{gameUpdate?.sockets.join(', ')}]</p>
      </div>
    </React.Fragment>
  );
};

export default GameContainer;
