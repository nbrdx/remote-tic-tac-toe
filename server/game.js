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
let socket;
const games = [];

exports.initGame = function (sio, soc) {
  io = sio;
  socket = soc;

  socket.on('createGame', createGame);
  socket.on('joinGame', (gameId) => joinGame(gameId));
  socket.on('playCell', (cellIndex) => playCell(cellIndex));
};

const createGame = () => {
  const game = {
    id: uuidv4(),
    sockets: [],
  };

  games.push(game);

  console.info('Game created.');
  socket.emit('gameCreated', game);
};

const joinGame = (gameId) => {
  const gameIndex = games.findIndex((game) => game.id === gameId);

  if (gameIndex < 0) {
    console.info('Game not found.');
    socket.emit('gameNotJoinable');
    return;
  }

  if (games[gameIndex].sockets.length >= 2) {
    // TODO: handle the case where the socket reconnects (socket already exists)
    // if (games[gameIndex].sockets.contains(socket.id))
    console.info('Game is full.');
    socket.emit('gameNotJoinable');
    return;
  }

  socket.join(gameId, () => {
    socket.gameId = gameId;
    games[gameIndex].sockets.push(socket.id);
    console.log(`${socket.id} joined room ${gameId}.`);
    socket.emit('gameJoined', games[gameIndex]);

    if (games[gameIndex].sockets.length === 2) {
      startGame(games[gameIndex]);
    }
  });
};

const startGame = (game) => {
  console.log('start game');

  const gameInfo = {
    ...game,
    gameState: new Array(9).fill(''),
    isGameActive: true,
    currentPlayer: {
      socketId: game.sockets[0],
      icon: 'X',
    },
  };

  const gameIndex = games.findIndex((game) => game.id === socket.gameId);
  games[gameIndex] = gameInfo;

  io.to(gameInfo.id).emit('gameInfo', gameInfo);
};

const playCell = (cellIndex) => {
  console.log('play cell');
  const gameIndex = games.findIndex((game) => game.id === socket.gameId);
  const game = games[gameIndex];
  console.log(game, gameIndex);
  const updatedGameState = game.gameState.slice();

  updatedGameState[cellIndex] = game.currentPlayer.icon;
  game.gameState = updatedGameState;

  const gameOver = isGameOver(updatedGameState);

  if (gameOver) {
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

  console.log('Cell played. Game info:', game);
  io.to(socket.gameId).emit('gameInfo', game);
};

// WIP
const leaveRoom = (socket, gameId) => {
  const gameIndex = games.findIndex((room) => (room.id = gameId));

  if (gameIndex < 0) {
    console.log('Room not found.');
    return;
  }

  socket.leave();
};

// WIP
const ready = () => {
  console.log(socket.id, 'is ready!');

  const game = games[socket.gameId];

  if (game.sockets.length === 2) {
    for (const client of game.sockets) {
      client.emit('initGame');
    }
  }
};

// Game Functions
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
