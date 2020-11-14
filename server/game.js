const { v4: uuidv4 } = require('uuid');

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

let io;
const games = [];

exports.initGame = function (sio, socket) {
  io = sio;

  socket.on('createGame', () => createGame(socket));
  socket.on('joinGame', (gameId) => joinGame(gameId, socket));
  socket.on('playCell', (cellIndex) => playCell(cellIndex, socket));
  socket.on('leaveGame', (gameId) => leaveGame(gameId, socket));
};

// EVENT HANDLERS
const createGame = (socket) => {
  const game = {
    id: uuidv4(),
    sockets: [],
  };

  games.push(game);

  console.info('Game created.');
  socket.emit('gameCreated', game);
};

const joinGame = (gameId, socket) => {
  const gameIndex = games.findIndex((game) => game.id === gameId);

  if (gameIndex < 0) {
    console.info('Game not found.');
    socket.emit('gameNotJoinable');
    return;
  }

  if (games[gameIndex].sockets.length >= 2) {
    console.info('Game is full.');
    socket.emit('gameNotJoinable');
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

const playCell = (cellIndex, socket) => {
  const game = getGameFromSocket(socket);

  if (!game || game.currentPlayer.socketId !== socket.id) {
    return;
  }

  // Update the game state
  const updatedGameState = game.gameState.slice();
  updatedGameState[cellIndex] = game.currentPlayer.icon;
  game.gameState = updatedGameState;

  // End the game or change player
  if (isGameOver(updatedGameState)) {
    game.isGameActive = false;
  } else {
    game.currentPlayer = {
      socketId:
        game.currentPlayer.socketId === game.sockets[0]
          ? game.sockets[1]
          : game.sockets[0],
      icon: game.currentPlayer.icon === 'X' ? 'O' : 'X',
    };
  }

  io.to(game.id).emit('gameInfo', game);
};

const leaveGame = (gameId, socket) => {
  const gameIndex = games.findIndex((game) => game.id === gameId);

  if (gameIndex < 0) {
    console.log('Room not found.');
    return;
  }

  socket.leave(gameId, () => {
    console.log(`${socket.id} left room ${gameId}.`);
  });
};

// GAME FUNCTIONS
const startGame = (game) => {
  console.log(`Start game: ${game.id}`);

  const gameInfo = {
    ...game,
    gameState: new Array(9).fill(''),
    isGameActive: true,
    currentPlayer: {
      socketId: game.sockets[0],
      icon: 'X',
    },
  };

  // Update game info
  const gameIndex = games.findIndex((g) => g.id === gameInfo.id);
  games[gameIndex] = gameInfo;

  // Emit the new game info to the room
  io.to(gameInfo.id).emit('gameInfo', gameInfo);
};

const isGameOver = (gameState) => {
  const isWinningState = WINNING_STATES.some((winningState) => {
    const a = gameState[winningState[0]];
    const b = gameState[winningState[1]];
    const c = gameState[winningState[2]];

    return a !== '' && b !== '' && c !== '' && a === b && b === c;
  });

  const isDraw = !gameState.includes('');

  return isWinningState || isDraw;
};

// UTILS
const getGameFromSocket = (socket) => {
  const rooms = Object.keys(socket.rooms);
  const gameId = rooms[1]; // rooms[0] is the socket's own id
  const game = games.find((game) => game.id === gameId);

  return game;
};
