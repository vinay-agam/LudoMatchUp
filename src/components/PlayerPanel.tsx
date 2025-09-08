import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { Users, Crown, Wifi, WifiOff } from 'lucide-react';

const PlayerPanel: React.FC = () => {
  const { gameState, currentUser, isConnected } = useGame();

  if (!gameState) return null;

  const players = Object.values(gameState.players);
  const currentPlayerColor = currentUser ? gameState.players[currentUser.uid]?.color : null;
  const currentTurnPlayer = gameState.players[gameState.currentTurn];

  const getPlayerStatus = (player: any) => {
    const finishedTokens = player.tokens.filter((token: any) => token.position === 'finish').length;
    const boardTokens = player.tokens.filter((token: any) => token.position === 'board' || token.position === 'safe').length;
    return { finished: finishedTokens, active: boardTokens };
  };

  const getColorClass = (color: string) => {
    const colors = {
      red: 'bg-red-500 text-white',
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-black'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-800">Players ({players.length}/4)</span>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Reconnecting...'}
          </span>
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="text-sm text-gray-600 mb-1">Game Status</div>
        <div className="font-semibold text-blue-700 capitalize">
          {gameState.status === 'in-progress' ? 'In Progress' : gameState.status}
        </div>
        {gameState.status === 'in-progress' && currentTurnPlayer && (
          <div className="mt-2 text-sm">
            <span className="text-gray-600">Current Turn: </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(currentTurnPlayer.color)}`}>
              {currentTurnPlayer.name}
            </span>
          </div>
        )}
      </div>

      {/* Players List */}
      <div className="space-y-3">
        {players.map((player) => {
          const status = getPlayerStatus(player);
          const isCurrentUser = player.uid === currentUser?.uid;
          const isCurrentTurn = player.uid === gameState.currentTurn;
          
          return (
            <motion.div
              key={player.uid}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentTurn 
                  ? 'border-orange-400 bg-orange-50 shadow-md' 
                  : 'border-gray-200 bg-gray-50'
              } ${isCurrentUser ? 'ring-2 ring-blue-300' : ''}`}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClass(player.color)} shadow-sm`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 flex items-center space-x-2">
                      <span>{player.name}</span>
                      {isCurrentUser && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">You</span>
                      )}
                      {gameState.winner === player.uid && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{player.color}</div>
                  </div>
                </div>
                
                {/* Player Status */}
                <div className="text-right">
                  <div className="text-xs text-gray-500">Progress</div>
                  <div className="text-sm font-medium">
                    <span className="text-green-600">{status.finished}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-blue-600">{status.active}</span>
                    <span className="text-gray-400">/4</span>
                  </div>
                  <div className="flex space-x-1 mt-1">
                    {player.tokens.map((token: any, index: number) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          token.position === 'finish' 
                            ? 'bg-green-400' 
                            : token.position === 'home' 
                              ? 'bg-gray-300'
                              : 'bg-blue-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Turn Indicator */}
              {isCurrentTurn && gameState.status === 'in-progress' && (
                <motion.div
                  className="mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-xs text-orange-600 font-medium bg-orange-100 px-3 py-1 rounded-full inline-block">
                    {isCurrentUser ? "Your Turn!" : "Their Turn"}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Room Code */}
      <div className="mt-6 p-3 bg-gray-100 rounded-lg text-center">
        <div className="text-xs text-gray-500 mb-1">Room Code</div>
        <div className="font-mono font-bold text-lg text-gray-800 tracking-wider">
          {gameState.roomId}
        </div>
      </div>
    </div>
  );
};

export default PlayerPanel;