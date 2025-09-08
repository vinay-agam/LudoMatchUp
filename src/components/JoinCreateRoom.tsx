import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { Plus, Users, ArrowRight, Gamepad2 } from 'lucide-react';
import toast from 'react-hot-toast';

const JoinCreateRoom: React.FC = () => {
  const { createRoom, joinRoom } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsCreating(true);
    try {
      await createRoom(playerName.trim());
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      toast.error('Please enter room code');
      return;
    }

    setIsJoining(true);
    try {
      await joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Gamepad2 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CloudLudo</h1>
          <p className="text-gray-600">Play Ludo with friends online!</p>
        </div>

        {/* Player Name Input */}
        <div className="mb-6">
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            maxLength={20}
          />
        </div>

        {/* Create Room Section */}
        <div className="mb-6">
          <motion.button
            onClick={handleCreateRoom}
            disabled={isCreating || !playerName.trim()}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all ${
              !playerName.trim() || isCreating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
            }`}
            whileHover={playerName.trim() && !isCreating ? { scale: 1.02 } : {}}
            whileTap={playerName.trim() && !isCreating ? { scale: 0.98 } : {}}
          >
            <Plus className="w-5 h-5" />
            <span>{isCreating ? 'Creating Room...' : 'Create New Room'}</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or join existing room</span>
          </div>
        </div>

        {/* Join Room Section */}
        <div className="mb-6">
          <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
            Room Code
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-center text-lg"
              maxLength={6}
            />
            <motion.button
              onClick={handleJoinRoom}
              disabled={isJoining || !playerName.trim() || !roomCode.trim()}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all ${
                !playerName.trim() || !roomCode.trim() || isJoining
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
              }`}
              whileHover={playerName.trim() && roomCode.trim() && !isJoining ? { scale: 1.05 } : {}}
              whileTap={playerName.trim() && roomCode.trim() && !isJoining ? { scale: 0.95 } : {}}
            >
              {isJoining ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Game Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Real-time multiplayer (2-4 players)
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Instant synchronization
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
              Automatic reconnection
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
              No downloads required
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinCreateRoom;