import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Play, LogOut } from 'lucide-react';

const GameControls: React.FC = () => {
  const { gameState, currentUser, rollDice, startGame, leaveRoom } = useGame();

  if (!gameState) return null;

  const currentPlayer = currentUser ? gameState.players[currentUser.uid] : null;
  const isCurrentPlayerTurn = currentPlayer && gameState.currentTurn === currentUser.uid;
  const isGameMaster = currentUser && Object.keys(gameState.players)[0] === currentUser.uid;
  const canStartGame = gameState.status === 'lobby' && Object.keys(gameState.players).length >= 2;

  const getDiceIcon = (value: number | null) => {
    const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    if (value === null || value < 1 || value > 6) return Dice1;
    const DiceIcon = diceIcons[value - 1];
    return DiceIcon;
  };

  const DiceIcon = getDiceIcon(gameState.diceRoll);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto">
      {/* Game Controls Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Game Controls</h3>
        {gameState.status === 'lobby' && (
          <p className="text-sm text-gray-600 mt-1">Waiting for players to join...</p>
        )}
      </div>

      {/* Start Game Button (Lobby) */}
      {gameState.status === 'lobby' && isGameMaster && (
        <motion.button
          onClick={startGame}
          disabled={!canStartGame}
          className={`w-full py-3 px-4 rounded-lg font-semibold mb-4 flex items-center justify-center space-x-2 transition-all ${
            canStartGame
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={canStartGame ? { scale: 1.05 } : {}}
          whileTap={canStartGame ? { scale: 0.95 } : {}}
        >
          <Play className="w-5 h-5" />
          <span>Start Game</span>
        </motion.button>
      )}

      {/* Dice Section */}
      {gameState.status === 'in-progress' && (
        <div className="mb-6">
          {/* Dice Display */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <motion.div
                className={`p-4 rounded-xl border-4 shadow-lg ${
                  gameState.diceRoll 
                    ? 'border-orange-400 bg-orange-50' 
                    : 'border-gray-300 bg-gray-50'
                }`}
                animate={gameState.diceRoll ? { 
                  rotate: [0, -10, 10, -5, 5, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.6 }}
              >
                <DiceIcon className={`w-8 h-8 ${
                  gameState.diceRoll ? 'text-orange-600' : 'text-gray-400'
                }`} />
              </motion.div>
            </div>
            
            {gameState.diceRoll && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-orange-600 mb-2"
              >
                {gameState.diceRoll}
              </motion.div>
            )}
          </div>

          {/* Roll Dice Button */}
          <motion.button
            onClick={rollDice}
            disabled={!isCurrentPlayerTurn || gameState.diceRoll !== null}
            className={`w-full py-3 px-4 rounded-lg font-semibold mb-4 transition-all ${
              isCurrentPlayerTurn && gameState.diceRoll === null
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isCurrentPlayerTurn && gameState.diceRoll === null ? { scale: 1.05 } : {}}
            whileTap={isCurrentPlayerTurn && gameState.diceRoll === null ? { scale: 0.95 } : {}}
          >
            {isCurrentPlayerTurn 
              ? (gameState.diceRoll === null ? 'Roll Dice' : 'Move Token') 
              : 'Wait for turn'
            }
          </motion.button>

          {/* Turn Instructions */}
          <div className="text-center text-sm text-gray-600 mb-4">
            {isCurrentPlayerTurn ? (
              gameState.diceRoll === null ? (
                <p>Click "Roll Dice" to roll!</p>
              ) : (
                <p>Click on a token to move it</p>
              )
            ) : (
              <p>Wait for your turn to play</p>
            )}
          </div>
        </div>
      )}

      {/* Game Status */}
      {gameState.status === 'finished' && gameState.winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-300 text-center"
        >
          <div className="text-lg font-bold text-yellow-800 mb-1">🎉 Game Over!</div>
          <div className="text-yellow-700">
            {gameState.players[gameState.winner]?.name} wins!
          </div>
        </motion.div>
      )}

      {/* Leave Room Button */}
      <motion.button
        onClick={leaveRoom}
        className="w-full py-2 px-4 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogOut className="w-4 h-4" />
        <span>Leave Game</span>
      </motion.button>
    </div>
  );
};

export default GameControls;