export interface Game {
  id: string;
  sockets: string[];
  gameState: GameIcon[];
  isGameActive: boolean;
  initialPlayer: Player;
  currentPlayer: Player;
  icons: GameIcon[];
  playAgain: string[];
}

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
