import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInAnonymouslyUser, createGameRoom, joinGameRoom, listenToGameRoom, stopListening, updateGameState } from '../config/firebase';
import { GameContextType, GameState } from '../types/game';
import { onAuthStateChanged, User } from 'firebase/auth';
import { DatabaseReference } from 'firebase/database';
import toast from 'react-hot-toast';

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [gameRoomRef, setGameRoomRef] = useState<DatabaseReference | null>(null);

  useEffect(() => {
    // Auto sign in anonymously
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        signInAnonymouslyUser().catch((error) => {
          toast.error('Failed to authenticate');
          console.error('Auth error:', error);
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Cleanup game room listener on unmount
    return () => {
      if (gameRoomRef) {
        stopListening(gameRoomRef);
      }
    };
  }, [gameRoomRef]);

  const createRoom = async (playerName: string): Promise<string> => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      const roomId = await createGameRoom(currentUser, playerName);
      
      // Start listening to the created room
      const ref = listenToGameRoom(roomId, (data) => {
        setGameState(data);
        setIsConnected(true);
      });
      setGameRoomRef(ref);
      
      toast.success(`Room created! Code: ${roomId}`);
      return roomId;
    } catch (error) {
      toast.error('Failed to create room');
      throw error;
    }
  };

  const joinRoom = async (roomId: string, playerName: string): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');
    
    try {
      await joinGameRoom(roomId, currentUser, playerName);
      
      // Start listening to the joined room
      const ref = listenToGameRoom(roomId, (data) => {
        setGameState(data);
        setIsConnected(true);
      });
      setGameRoomRef(ref);
      
      toast.success(`Joined room: ${roomId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to join room');
      throw error;
    }
  };

  const rollDice = async (): Promise<void> => {
    if (!gameState || !currentUser || gameState.currentTurn !== currentUser.uid) {
      return;
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;
    
    // Find next player for turn rotation
    const playerIds = Object.keys(gameState.players).filter(
      uid => gameState.players[uid].isActive
    );
    const currentPlayerIndex = playerIds.indexOf(currentUser.uid);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;
    const nextPlayer = playerIds[nextPlayerIndex];

    const updatedGameState = {
      ...gameState,
      diceRoll: diceValue,
      currentTurn: diceValue === 6 ? currentUser.uid : nextPlayer
    };

    await updateGameState(gameState.roomId, updatedGameState);
    toast.success(`Rolled: ${diceValue}`);
  };

  const moveToken = async (tokenId: number): Promise<void> => {
    if (!gameState || !currentUser || !gameState.diceRoll) return;

    const currentPlayer = gameState.players[currentUser.uid];
    if (!currentPlayer) return;

    const token = currentPlayer.tokens[tokenId];
    const diceValue = gameState.diceRoll;

    // Calculate new position
    let newPosition = token.boardPosition;
    let newStatus = token.position;

    if (token.position === 'home' && diceValue === 6) {
      // Token can leave home
      newPosition = currentPlayer.position * 14; // Starting position for each player
      newStatus = 'board';
    } else if (token.position === 'board') {
      // Move on board
      newPosition = (token.boardPosition + diceValue) % 56;
      
      // Check if token reaches safe zone
      const safeZoneStart = currentPlayer.position * 14 + 50;
      if (newPosition >= safeZoneStart && newPosition < safeZoneStart + 6) {
        newStatus = 'safe';
        newPosition = newPosition - safeZoneStart + 56; // 56-61 for safe zone
      }
      
      // Check if token finishes
      if (newPosition >= 62) {
        newStatus = 'finish';
        newPosition = 62;
      }
    }

    // Update token position
    const updatedTokens = [...currentPlayer.tokens];
    updatedTokens[tokenId] = {
      ...token,
      position: newStatus,
      boardPosition: newPosition
    };

    const updatedPlayer = {
      ...currentPlayer,
      tokens: updatedTokens
    };

    // Check win condition
    const isWinner = updatedTokens.every(t => t.position === 'finish');
    
    const updatedGameState = {
      ...gameState,
      diceRoll: null,
      players: {
        ...gameState.players,
        [currentUser.uid]: updatedPlayer
      },
      status: isWinner ? 'finished' : gameState.status,
      winner: isWinner ? currentUser.uid : gameState.winner
    };

    await updateGameState(gameState.roomId, updatedGameState);
    
    if (isWinner) {
      toast.success(`🎉 ${currentPlayer.name} wins!`);
    }
  };

  const startGame = async (): Promise<void> => {
    if (!gameState || Object.keys(gameState.players).length < 2) {
      toast.error('Need at least 2 players to start');
      return;
    }

    const updatedGameState = {
      ...gameState,
      status: 'in-progress' as const
    };

    await updateGameState(gameState.roomId, updatedGameState);
    toast.success('Game started!');
  };

  const leaveRoom = (): void => {
    if (gameRoomRef) {
      stopListening(gameRoomRef);
      setGameRoomRef(null);
    }
    setGameState(null);
  };

  return (
    <GameContext.Provider value={{
      gameState,
      currentUser,
      isConnected,
      createRoom,
      joinRoom,
      rollDice,
      moveToken,
      startGame,
      leaveRoom
    }}>
      {children}
    </GameContext.Provider>
  );
};