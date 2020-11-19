import React from 'react';

import './Game.css';
import Cell from './Cell/Cell';

const Game = ({
  gameState,
  status,
  currentPlayer,
  player,
  opponent,
  drawScore,
  cellPlayed,
}) => {
  const cellClickedHandler = (cellIndex) => {
    if (status !== 'play' || gameState[cellIndex] !== '') {
      return;
    }

    cellPlayed(cellIndex);
  };

  const cells = gameState.map((value, index) => (
    <Cell key={index} value={value} clicked={() => cellClickedHandler(index)} />
  ));

  const isPlayerTurn = player.icon === currentPlayer;

  let statusText = `It's a draw !`;

  if (status === 'play') {
    statusText = isPlayerTurn
      ? 'Your turn to play'
      : 'Your opponent is playing';
  }

  if (status === 'win') {
    statusText = isPlayerTurn ? 'You won !' : 'You lost !';
  }

  return (
    <div className='Game'>
      <div className='Main'>
        <div className='Player'>
          <p>{player.name}</p>
          <p className='Icon'>{player.icon}</p>
          <p>Wins: {player.score}</p>
        </div>
        <div className='GameBoard'>{cells}</div>
        <div className='Player'>
          <p>{opponent.name}</p>
          <p className='Icon'>{opponent.icon}</p>
          <p>Wins: {opponent.score}</p>
        </div>
      </div>

      <p>{statusText}</p>
      <p>{`Draws: ${drawScore}`}</p>
    </div>
  );
};

export default Game;
