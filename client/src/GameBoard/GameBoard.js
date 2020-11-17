import React from 'react';

import './GameBoard.css';
import Cell from './Cell/Cell';

const GameBoard = ({
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

  const cells = gameState ? (
    gameState.map((value, index) => (
      <Cell
        key={index}
        value={value}
        clicked={() => cellClickedHandler(index)}
      />
    ))
  ) : (
    <div>Invalid GameBoard props</div>
  );

  return (
    <div className='GameBoard'>
      <div className='Main'>
        <div className='Player'>
          <p>{playerName}</p>
          <p>{playerIcon}</p>
          <p>Wins: 0</p>
        </div>
        <div className='Board'>{cells}</div>
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

export default GameBoard;
