import React from 'react';

import './Game.css';
import Cell from './Cell/Cell';

const Game = ({
  gameState,
  isGameActive,
  currentPlayer,
  playerName,
  playerIcon,
  opponentName,
  opponentIcon,
  cellPlayed,
}) => {
  const cellClickedHandler = (cellIndex) => {
    if (!isGameActive || gameState[cellIndex] !== '') {
      return;
    }

    cellPlayed(cellIndex);
  };

  const cells = gameState.map((value, index) => (
    <Cell key={index} value={value} clicked={() => cellClickedHandler(index)} />
  ));

  return (
    <div className='Game'>
      <div className='Main'>
        <div className='Player'>
          <p>{playerName}</p>
          <p>{playerIcon}</p>
          <p>Wins: 0</p>
        </div>
        <div className='GameBoard'>{cells}</div>
        <div className='Player'>
          <p>{opponentName}</p>
          <p>{opponentIcon}</p>
          <p>Wins: 0</p>
        </div>
      </div>

      <p>{`${currentPlayer} to play`}</p>
      <p>{`Draws: 3`}</p>
    </div>
  );
};

export default Game;
