import React from 'react';

import './GameBoard.css';
import Cell from './Cell/Cell';

const GameBoard = ({ gameState, isGameActive, currentPlayer, cellPlayed }) => {
  const cellClickedHandler = (cellIndex) => {
    if (!isGameActive || gameState[cellIndex] !== '') {
      return;
    }

    cellPlayed(cellIndex);
  };

  const cells = gameState ? gameState.map((value, index) => (
    <Cell
      key={index}
      index={index}
      value={value}
      clicked={() => cellClickedHandler(index)}
    />
  )) : <div>Waiting for game info...</div>;

  return (
    <React.Fragment>
      <div className='game-board'>{cells}</div>
      <p>{`${currentPlayer} to play`}</p>
      <p>{`Game active: ${isGameActive}`}</p>
      {/* <button onClick={restartGameHandler}>New game</button> */}
    </React.Fragment>
  );
};

export default GameBoard;
