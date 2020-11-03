import React, { Component } from 'react';

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

class GameBoard extends Component {
  state = {
    gameState: new Array(9).fill(''),
    isGameActive: true,
    currentPlayer: 'X',
  };

  cellClickedHandler = (cellIndex) => {
    const { isGameActive, gameState } = this.state;

    if (!isGameActive || gameState[cellIndex] !== '') {
      return;
    }

    console.log(cellIndex);
    this.playCell(cellIndex, this.state.currentPlayer);
    this.validateResult();
  };

  playCell = (cellIndex, player) => {
    const updatedGameState = this.state.gameState.slice();
    updatedGameState[cellIndex] = player;

    this.setState({ gameState: updatedGameState });
  };

  validateResult = () => {
    this.setState((prevState) => {
      const { gameState, currentPlayer } = prevState;

      const isWinningState = WINNING_STATES.some((winningState) => {
        const a = gameState[winningState[0]];
        const b = gameState[winningState[1]];
        const c = gameState[winningState[2]];

        return a !== '' && b !== '' && c !== '' && a === b && b === c;
      });

      const isDraw = !gameState.includes('');

      if (isWinningState || isDraw) {
        return {
          isGameActive: false,
        };
      }

      return {
        isGameActive: true,
        currentPlayer: currentPlayer === 'X' ? '0' : 'X',
      };
    });
  };

  changePlayer = () => {
    this.setState((prevState) => ({
      currentPlayer: prevState.currentPlayer === 'X' ? '0' : 'X',
    }));
  };

  restartGameHandler = () => {
    this.setState({
      gameState: new Array(9).fill(''),
      isGameActive: true,
    });
    this.changePlayer();
  };

  render() {
    const cells = this.state.gameState.map((value, index) => (
      <Cell
        key={index}
        index={index}
        value={value}
        clicked={() => this.cellClickedHandler(index)}
      />
    ));

    return (
      <React.Fragment>
        <div className='game-board'>{cells}</div>
        <p>{`${this.state.currentPlayer} to play`}</p>
        <p>{`Game active: ${this.state.isGameActive}`}</p>
        <button onClick={this.restartGameHandler}>New game</button>
      </React.Fragment>
    );
  }
}

export default GameBoard;
