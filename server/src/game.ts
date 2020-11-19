import { v4 as uuidv4 } from 'uuid';
import { Server, Socket } from 'socket.io';

import { getGameFromSocket, getGameStatus } from './game.utils';
import { EmitEvent, Game, OnEvent, Player } from './game.models';

let io: Server;
const games: Game[] = [];
const matchmakingSockets: string[] = [];

export const initGame = (sio: Server, socket: Socket) => {
  io = sio; // store the socket.io server for events

  socket.on(OnEvent.CreatePrivateGame, () => createPrivateGame(socket));
  socket.on(OnEvent.FindOpponent, () => findOpponent(socket));
  socket.on(OnEvent.CancelFindOpponent, () => cancelFindOpponent(socket));
  socket.on(OnEvent.JoinGame, (gameId: string) => joinGame(gameId, socket));
  socket.on(OnEvent.PlayCell, (cellIndex: number) =>
    playCell(cellIndex, socket)
  );
  socket.on(OnEvent.ReplayGame, () => replayGame(socket));
  socket.on(OnEvent.LeaveGame, (gameId: string) => leaveGame(gameId, socket));
};

// Event handlers
const createPrivateGame = (socket: Socket) => {
  const gameId = createGame();
  socket.emit(EmitEvent.GameCreated, gameId);
};

const findOpponent = (socket: Socket) => {
  matchmakingSockets.push(socket.id);

  if (matchmakingSockets.length === 2) {
    const gameId = createGame();

    matchmakingSockets.forEach((socketId) => {
      io.to(socketId).emit(EmitEvent.GameCreated, gameId);
    });
    matchmakingSockets.splice(0, 2);
  }
};

const cancelFindOpponent = (socket: Socket) => {
  const socketIndex = matchmakingSockets.findIndex(
    (socketId) => socketId === socket.id
  );

  if (socketIndex < 0) {
    return;
  }

  matchmakingSockets.splice(socketIndex, 1);
};

const joinGame = (gameId: string, socket: Socket) => {
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

const playCell = (cellIndex: number, socket: Socket) => {
  const game = getGameFromSocket(socket, games);

  if (!game || game.sockets[game.currentPlayer] !== socket.id) {
    return;
  }

  // Update the game state
  const updatedGameState = game.gameState.slice();
  updatedGameState[cellIndex] = game.icons[game.currentPlayer];
  game.gameState = updatedGameState;

  const gameStatus = getGameStatus(updatedGameState);

  if (gameStatus === 'play') {
    game.currentPlayer = game.currentPlayer === 0 ? 1 : 0;
  }

  if (gameStatus === 'win') {
    game.scores[game.currentPlayer] += 1;
  }

  if (gameStatus === 'draw') {
    game.scores[2] += 1;
  }

  game.status = gameStatus;

  io.to(game.id).emit(EmitEvent.GameUpdated, game);
};

const replayGame = (socket: Socket) => {
  const game = getGameFromSocket(socket, games);

  if (game.playAgain.includes(socket.id)) {
    return;
  }

  game.playAgain.push(socket.id);

  if (game.playAgain.length === 2) {
    resetGame(game);
    return;
  }

  io.to(game.id).emit(EmitEvent.GameUpdated, game);
};

const leaveGame = (gameId: string, socket: Socket) => {
  const gameIndex = games.findIndex((game) => game.id === gameId);

  if (gameIndex < 0) {
    console.log('Room not found.');
    return;
  }

  socket.leave(gameId, () => {
    console.log(`${socket.id} left room ${gameId}.`);

    // Remove socket from the game sockets
    games[gameIndex].sockets = games[gameIndex].sockets.filter(
      (s) => s === socket.id
    );
  });
};

// Game functions
const createGame = (): string => {
  const game: Game = {
    id: uuidv4(),
    sockets: [],
    status: 'play',
    gameState: new Array(9).fill(''),
    initialPlayer: null,
    currentPlayer: null,
    scores: [0, 0, 0],
    icons: ['X', 'O'],
    playAgain: [],
  };

  games.push(game);
  console.info('Game created.');

  return game.id;
};

const startGame = (game: Game) => {
  console.log(`Start game: ${game.id}`);

  const initialPlayer = Math.round(Math.random()) as Player;
  const updatedGame: Game = {
    ...game,
    initialPlayer,
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
    status: 'play',
    initialPlayer: newPlayer,
    currentPlayer: newPlayer,
    playAgain: [],
  };

  const gameIndex = games.findIndex((g) => g.id === game.id);
  games[gameIndex] = updatedGame;

  io.to(game.id).emit(EmitEvent.GameUpdated, updatedGame);
};
