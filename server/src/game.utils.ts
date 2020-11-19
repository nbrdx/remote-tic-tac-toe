import { Game, GameIcon } from './game.models';
import { WINNING_STATES } from './game.const';

export const getGameFromSocket = (
  socket: SocketIO.Socket,
  games: Game[]
): Game => {
  const rooms = Object.keys(socket.rooms);
  const gameId = rooms[1]; // rooms[0] is the socket's own id
  return games.find((game) => game.id === gameId);
};

export const getGameStatus = (
  gameState: GameIcon[]
): 'play' | 'win' | 'draw' => {
  const isWinningState = WINNING_STATES.some((winningState) => {
    const a = gameState[winningState[0]];
    const b = gameState[winningState[1]];
    const c = gameState[winningState[2]];

    return a !== '' && b !== '' && c !== '' && a === b && b === c;
  });

  if (isWinningState) {
    return 'win';
  }

  const isDraw = !gameState.includes('');
  if (isDraw) {
    return 'draw';
  }

  return 'play';
};
