export interface Game {
  id: string;
  sockets: string[];
  status: GameStatus;
  gameState: GameIcon[];
  initialPlayer: Player;
  currentPlayer: Player;
  scores: number[];
  icons: GameIcon[];
  playAgain: string[];
}

export type GameStatus = 'play' | 'draw' | 'win';
export type GameIcon = '' | 'X' | 'O';
export type Player = 0 | 1 | null;

export enum OnEvent {
  CreatePrivateGame = 'createPrivateGame',
  FindOpponent = 'findOpponent',
  CancelFindOpponent = 'cancelFindOpponent',
  JoinGame = 'joinGame',
  PlayCell = 'playCell',
  ReplayGame = 'replayGame',
  LeaveGame = 'leaveGame',
}

export enum EmitEvent {
  GameCreated = 'gameCreated',
  OpponentFound = 'opponentFound',
  GameUpdated = 'gameUpdated',
  GameNotJoinable = 'gameNotJoinable',
}
