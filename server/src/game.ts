import { v4 as uuidv4 } from 'uuid';
import { EmitEvent } from './game.consts';

import { getGameFromSocket, isGameOver } from './game.utils';
import { Game, Player } from './types/game';

let io: SocketIO.Server;
const games: Game[] = [];

export const initGame = (sio: SocketIO.Server, socket: SocketIO.Socket) => {
  io = sio; // store the socket.io server for events

  socket.on('createGame', () => createGame(socket));
  socket.on('joinGame', (gameId: string) => joinGame(gameId, socket));
  socket.on('playCell', (cellIndex: number) => playCell(cellIndex, socket));
  socket.on('replayGame', () => replayGame(socket));
  socket.on('leaveGame', (gameId: string) => leaveGame(gameId, socket));
};

// Event handlers
const createGame = (socket: SocketIO.Socket) => {
  const game: Game = {
    id: uuidv4(),
    sockets: [],
    gameState: new Array(9).fill(''),
    isGameActive: false,
    initialPlayer: null,
    currentPlayer: null,
    icons: ['X', 'O'],
    playAgain: 0,
  };

  games.push(game);

  console.info('Game created.');
  socket.emit(EmitEvent.GameCreated, game);
};

const joinGame = (gameId: string, socket: SocketIO.Socket) => {
  const gameIndex = games.findIndex((game) => game.id === gameId);

  if (gameIndex < 0) {
    console.info('Game not found.');
    socket.emit(EmitEvent.GameNotJoinable);
    return;
  }

  if (games[gameIndex].sockets.length >= 2) {
    console.info('Game is full.');
    socket.emit(EmitEvent.GameNotJoinable);
    return;
  }

  socket.join(gameId, () => {
    games[gameIndex].sockets.push(socket.id);
    console.log(`${socket.id} joined room ${gameId}.`);

    if (games[gameIndex].sockets.length === 2) {
      startGame(games[gameIndex]);
    }
  });
};

const playCell = (cellIndex: number, socket: SocketIO.Socket) => {
  const game = getGameFromSocket(socket, games);

  if (!game || game.sockets[game.currentPlayer] !== socket.id) {
    return;
  }

  // Update the game state
  const updatedGameState = game.gameState.slice();
  updatedGameState[cellIndex] = game.icons[game.currentPlayer];
  game.gameState = updatedGameState;

  // End the game or change current player
  if (isGameOver(updatedGameState)) {
    game.isGameActive = false;
  } else {
    game.currentPlayer = game.currentPlayer === 0 ? 1 : 0;
  }

  io.to(game.id).emit(EmitEvent.GameUpdated, game);
};

const replayGame = (socket: SocketIO.Socket) => {
  const game = getGameFromSocket(socket, games);

  game.playAgain = game.playAgain + 1;

  if (game.playAgain === 2) {
    resetGame(game);
  } else {
    io.to(game.id).emit(EmitEvent.GameUpdated, game);
  }
};

const leaveGame = (gameId: string, socket: SocketIO.Socket) => {
  const gameIndex = games.findIndex((game) => game.id === gameId);

  if (gameIndex < 0) {
    console.log('Room not found.');
    return;
  }

  socket.leave(gameId, () => {
    console.log(`${socket.id} left room ${gameId}.`);
  });
};

// Game functions
const startGame = (game: Game) => {
  console.log(`Start game: ${game.id}`);

  const initialPlayer = Math.round(Math.random()) as Player;
  const updatedGame: Game = {
    ...game,
    initialPlayer,
    isGameActive: true,
    currentPlayer: initialPlayer,
  };

  // Update game info
  const gameIndex = games.findIndex((g) => g.id === game.id);
  games[gameIndex] = updatedGame;

  // Emit the new game info to the room
  io.to(game.id).emit(EmitEvent.GameUpdated, updatedGame);
};

const resetGame = (game: Game) => {
  console.log(`Reset game: ${game.id}`);

  const newPlayer = game.initialPlayer === 0 ? 1 : 0;

  const updatedGame: Game = {
    ...game,
    gameState: new Array(9).fill(''),
    isGameActive: true,
    initialPlayer: newPlayer,
    currentPlayer: newPlayer,
    playAgain: 0,
  };

  const gameIndex = games.findIndex((g) => g.id === game.id);
  games[gameIndex] = updatedGame;

  io.to(game.id).emit(EmitEvent.GameUpdated, updatedGame);
};
