import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { Star, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GameBoard: React.FC = () => {
  const { gameState, moveToken, currentUser } = useGame();

  if (!gameState) return null;

  const currentPlayer = currentUser ? gameState.players[currentUser.uid] : null;
  const isCurrentPlayerTurn = currentPlayer && gameState.currentTurn === currentUser.uid;

  // Board configuration - 15x15 grid
  const BOARD_SIZE = 15;
  const HOME_SIZE = 6;
  const PATH_WIDTH = 3;

  // Generate board path positions (clockwise from red starting position)
  const generateBoardPath = () => {
    const path = [];
    
    // Red to Green (bottom row, left to right)
    for (let x = 1; x <= 5; x++) {
      path.push({ x, y: 8 });
    }
    
    // Green column (bottom to top)
    for (let y = 7; y >= 2; y--) {
      path.push({ x: 6, y });
    }
    
    // Green to Blue (top row, left to right)
    for (let x = 7; x <= 13; x++) {
      path.push({ x, y: 1 });
    }
    
    // Blue column (top to bottom)
    for (let y = 2; y <= 7; y++) {
      path.push({ x: 14, y });
    }
    
    // Blue to Yellow (right column, top to bottom)
    for (let y = 8; y <= 13; y++) {
      path.push({ x: 13, y });
    }
    
    // Yellow row (right to left)
    for (let x = 12; x >= 8; x--) {
      path.push({ x, y: 14 });
    }
    
    // Yellow to Red (bottom row, right to left)
    for (let x = 7; x >= 2; x--) {
      path.push({ x, y: 13 });
    }
    
    // Red column (bottom to top)
    for (let y = 12; y >= 8; y--) {
      path.push({ x: 1, y });
    }

    return path;
  };

  const boardPath = generateBoardPath();

  // Safe zone paths for each color
  const getSafeZonePath = (color: string) => {
    switch (color) {
      case 'red':
        return [
          { x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, 
          { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }
        ];
      case 'green':
        return [
          { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, 
          { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }
        ];
      case 'blue':
        return [
          { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, 
          { x: 10, y: 8 }, { x: 9, y: 8 }, { x: 8, y: 8 }
        ];
      case 'yellow':
        return [
          { x: 8, y: 13 }, { x: 8, y: 12 }, { x: 8, y: 11 }, 
          { x: 8, y: 10 }, { x: 8, y: 9 }, { x: 8, y: 8 }
        ];
      default:
        return [];
    }
  };

  const getTokenPosition = (token: any, playerColor: string) => {
    if (token.position === 'home') {
      return null; // Handled separately in home areas
    }
    
    if (token.position === 'safe') {
      const safeZone = getSafeZonePath(playerColor);
      const safeIndex = token.boardPosition - 56;
      return safeZone[safeIndex] || { x: 8, y: 8 };
    }
    
    if (token.position === 'finish') {
      return { x: 8, y: 8 }; // Center finish area
    }
    
    // Regular board position
    return boardPath[token.boardPosition] || { x: 8, y: 8 };
  };

  const getColorClasses = (color: string) => {
    const colors = {
      red: { bg: 'bg-red-500', border: 'border-red-600', home: 'bg-red-400' },
      green: { bg: 'bg-green-500', border: 'border-green-600', home: 'bg-green-400' },
      blue: { bg: 'bg-blue-500', border: 'border-blue-600', home: 'bg-blue-400' },
      yellow: { bg: 'bg-yellow-400', border: 'border-yellow-500', home: 'bg-yellow-300' }
    };
    return colors[color as keyof typeof colors] || colors.red;
  };

  const handleTokenClick = (tokenId: number) => {
    if (!isCurrentPlayerTurn || !gameState.diceRoll) return;
    moveToken(tokenId);
  };

  const renderCell = (x: number, y: number) => {
    const isHomeArea = (x <= 6 && y <= 6) || (x >= 9 && y <= 6) || 
                      (x <= 6 && y >= 9) || (x >= 9 && y >= 9);
    const isPath = boardPath.some(pos => pos.x === x && pos.y === y);
    const isSafeZone = ['red', 'green', 'blue', 'yellow'].some(color => 
      getSafeZonePath(color).some(pos => pos.x === x && pos.y === y)
    );
    const isCenter = x === 8 && y === 8;
    const isStartingPosition = (x === 2 && y === 8) || (x === 8 && y === 2) || 
                              (x === 13 && y === 8) || (x === 8 && y === 13);

    let cellClass = 'w-8 h-8 border border-gray-300 flex items-center justify-center relative';
    
    if (isCenter) {
      cellClass += ' bg-gradient-to-br from-yellow-200 to-orange-200 border-2 border-orange-400';
    } else if (isPath) {
      cellClass += ' bg-white';
      if (isStartingPosition) {
        cellClass += ' bg-gray-100';
      }
    } else if (isSafeZone) {
      if (x === 8 || y === 8) {
        if (x <= 8 && y === 8) cellClass += ' bg-red-100';
        else if (x === 8 && y <= 8) cellClass += ' bg-green-100';
        else if (x >= 8 && y === 8) cellClass += ' bg-blue-100';
        else if (x === 8 && y >= 8) cellClass += ' bg-yellow-100';
      }
    } else if (!isHomeArea) {
      cellClass += ' bg-gray-50';
    }

    return (
      <div key={`${x}-${y}`} className={cellClass}>
        {/* Starting position stars */}
        {isStartingPosition && (
          <Star className="w-4 h-4 text-gray-600 fill-current" />
        )}
        
        {/* Direction arrows */}
        {x === 8 && y === 0 && <ArrowDown className="w-4 h-4 text-gray-600" />}
        {x === 8 && y === 14 && <ArrowUp className="w-4 h-4 text-gray-600" />}
        {x === 0 && y === 8 && <ArrowRight className="w-4 h-4 text-gray-600" />}
        {x === 14 && y === 8 && <ArrowLeft className="w-4 h-4 text-gray-600" />}
        
        {/* Center finish area */}
        {isCenter && (
          <div className="text-xs font-bold text-orange-700">FINISH</div>
        )}
      </div>
    );
  };

  const renderHomeArea = (color: string, startX: number, startY: number) => {
    const colorClasses = getColorClasses(color);
    const player = gameState.players && Object.values(gameState.players).find((p: any) => p.color === color);
    const homeTokens = player?.tokens.filter((token: any) => token.position === 'home') || [];

    return (
      <div 
        className={`absolute ${colorClasses.home} border-4 ${colorClasses.border}`}
        style={{
          left: `${(startX / BOARD_SIZE) * 100}%`,
          top: `${(startY / BOARD_SIZE) * 100}%`,
          width: `${(HOME_SIZE / BOARD_SIZE) * 100}%`,
          height: `${(HOME_SIZE / BOARD_SIZE) * 100}%`,
        }}
      >
        <div className="w-full h-full p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg p-3 w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-3 w-full h-full">
              {[0, 1, 2, 3].map((tokenIndex) => {
                const token = homeTokens.find((t: any) => t.id === tokenIndex);
                const hasToken = !!token;
                const canMove = isCurrentPlayerTurn && 
                               currentPlayer?.color === color && 
                               hasToken && 
                               gameState.diceRoll === 6;

                return (
                  <div
                    key={tokenIndex}
                    className={`aspect-square rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      hasToken 
                        ? `${colorClasses.bg} ${colorClasses.border} shadow-lg ${canMove ? 'hover:scale-110 ring-2 ring-white' : ''}` 
                        : 'border-gray-300 border-dashed'
                    }`}
                    onClick={() => hasToken && canMove && handleTokenClick(tokenIndex)}
                  >
                    {hasToken && (
                      <motion.div
                        className="w-full h-full rounded-full bg-white border-2 border-gray-200 shadow-inner"
                        layoutId={`token-${color}-${tokenIndex}`}
                        whileHover={canMove ? { scale: 1.1 } : {}}
                        whileTap={canMove ? { scale: 0.95 } : {}}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
      {/* Main Board Grid */}
      <div className="relative aspect-square bg-gray-100 rounded-xl border-4 border-gray-300 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-15 grid-rows-15">
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);
            return renderCell(x, y);
          })}
        </div>

        {/* Home Areas */}
        {renderHomeArea('red', 0, 0)}
        {renderHomeArea('green', 9, 0)}
        {renderHomeArea('blue', 9, 9)}
        {renderHomeArea('yellow', 0, 9)}

        {/* Board Tokens */}
        {gameState.players && Object.values(gameState.players).map((player: any) => 
          player.tokens
            .filter((token: any) => token.position !== 'home')
            .map((token: any) => {
              const position = getTokenPosition(token, player.color);
              if (!position) return null;

              const colorClasses = getColorClasses(player.color);
              const canMove = isCurrentPlayerTurn && 
                             player.uid === currentUser?.uid && 
                             gameState.diceRoll !== null;

              return (
                <motion.div
                  key={`${player.uid}-${token.id}`}
                  className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer ${colorClasses.bg} ${canMove ? 'hover:scale-110 ring-2 ring-yellow-300' : ''}`}
                  style={{
                    left: `${(position.x / BOARD_SIZE) * 100}%`,
                    top: `${(position.y / BOARD_SIZE) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                  layoutId={`token-${player.color}-${token.id}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={canMove ? { scale: 1.2 } : {}}
                  whileTap={canMove ? { scale: 0.9 } : {}}
                  onClick={() => canMove && handleTokenClick(token.id)}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              );
            })
        )}

        {/* Connection Status Indicator */}
        <div className="absolute top-2 right-2 z-20">
          <div className={`w-3 h-3 rounded-full ${gameState ? 'bg-green-400' : 'bg-red-400'} animate-pulse shadow-lg`}></div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;