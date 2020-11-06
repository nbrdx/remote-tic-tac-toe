import React from 'react';

import './GameBoard.css';
import Cell from './Cell/Cell';

const WINNING_STATES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const GameBoard = () => {
  const [gameState, setGameState] = React.useState(new Array(9).fill(''));
  const [isGameActive, setIsGameActive] = React.useState(true);
  const [currentPlayer, setCurrentPlayer] = React.useState('X');

  const cellClickedHandler = (cellIndex) => {
    if (!isGameActive || gameState[cellIndex] !== '') {
      return;
    }

    playCell(cellIndex, currentPlayer);
  };

  const playCell = (cellIndex, player) => {
    const updatedGameState = gameState.slice();
    updatedGameState[cellIndex] = player;

    setGameState(updatedGameState);
    validateResult(updatedGameState);
  };

  const validateResult = (updatedGameState) => {
    const isWinningState = WINNING_STATES.some((winningState) => {
      const a = updatedGameState[winningState[0]];
      const b = updatedGameState[winningState[1]];
      const c = updatedGameState[winningState[2]];

      return a !== '' && b !== '' && c !== '' && a === b && b === c;
    });

    const isDraw = !updatedGameState.includes('');

    console.log(isWinningState, isDraw);

    if (isWinningState || isDraw) {
      setIsGameActive(false);
      return; // can i return the method directly ?
    }

    setIsGameActive(true);
    changePlayer();
  };

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === 'X' ? '0' : 'X');
  };

  const restartGameHandler = () => {
    setGameState(new Array(9).fill(''));
    setIsGameActive(true);
    changePlayer();
  };

  const cells = gameState.map((value, index) => (
    <Cell
      key={index}
      index={index}
      value={value}
      clicked={() => cellClickedHandler(index)}
    />
  ));

  return (
    <React.Fragment>
      <div className='game-board'>{cells}</div>
      <p>{`${currentPlayer} to play`}</p>
      <p>{`Game active: ${isGameActive}`}</p>
      <button onClick={restartGameHandler}>New game</button>
    </React.Fragment>
  );
};

export default GameBoard;
