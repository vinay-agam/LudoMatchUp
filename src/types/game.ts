export interface Token {
  id: number;
  position: 'home' | 'board' | 'safe' | 'finish';
  boardPosition: number; // -1 for home, 0-55 for board positions, 56-61 for safe zone
}

export interface Player {
  uid: string;
  name: string;
  color: 'red' | 'blue' | 'green' | 'yellow';
  position: number;
  tokens: Token[];
  isActive: boolean;
  joinedAt: any;
}

export interface GameState {
  roomId: string;
  status: 'lobby' | 'in-progress' | 'finished';
  createdAt: any;
  lastUpdated: any;
  maxPlayers: number;
  currentTurn: string;
  diceRoll: number | null;
  winner: string | null;
  players: { [uid: string]: Player };
}

export interface GameContextType {
  gameState: GameState | null;
  currentUser: any;
  isConnected: boolean;
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (roomId: string, playerName: string) => Promise<void>;
  rollDice: () => Promise<void>;
  moveToken: (tokenId: number) => Promise<void>;
  startGame: () => Promise<void>;
  leaveRoom: () => void;
}