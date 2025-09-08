import React from 'react';
import { Toaster } from 'react-hot-toast';
import { GameProvider, useGame } from './contexts/GameContext';
import JoinCreateRoom from './components/JoinCreateRoom';
import GameBoard from './components/GameBoard';
import PlayerPanel from './components/PlayerPanel';
import GameControls from './components/GameControls';
import { Wifi, WifiOff } from 'lucide-react';

const GameInterface: React.FC = () => {
  const { gameState, isConnected } = useGame();

  if (!gameState) {
    return <JoinCreateRoom />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50 flex items-center justify-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Reconnecting to game...</span>
        </div>
      )}

      {/* Main Game Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CloudLudo</h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span>Room: {gameState.roomId}</span>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="capitalize">{gameState.status}</span>
          </div>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Panel - Players */}
          <div className="order-2 lg:order-1">
            <PlayerPanel />
          </div>

          {/* Center - Game Board */}
          <div className="order-1 lg:order-2">
            <GameBoard />
          </div>

          {/* Right Panel - Controls */}
          <div className="order-3">
            <GameControls />
          </div>
        </div>

        {/* Mobile Layout Adjustments */}
        <div className="block lg:hidden mt-6">
          <div className="text-center text-sm text-gray-500">
            Rotate your device for better experience
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="App">
        <GameInterface />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '10px',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </div>
    </GameProvider>
  );
};

export default App;