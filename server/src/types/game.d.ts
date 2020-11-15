export interface Game {
  id: string;
  sockets: string[];
  gameState: GameIcon[];
  isGameActive: boolean;
  initialPlayer: Player;
  currentPlayer: Player;
  icons: GameIcon[];
  playAgain: number;
}

export type GameIcon = '' | 'X' | 'O';
export type Player = 0 | 1 | null;
