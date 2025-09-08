import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { getDatabase, ref, push, set, get, onValue, off, serverTimestamp, DatabaseReference } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    if (import.meta.env.PROD) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// Auth functions
export const signInAnonymouslyUser = () => signInAnonymously(auth);
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);
export const createUserWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

// Database functions
export const createGameRoom = async (user: User, playerName: string) => {
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const gameRoomRef = ref(database, `gameRooms/${roomId}`);
  
  const initialGameState = {
    roomId,
    status: 'lobby',
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
    maxPlayers: 4,
    currentTurn: user.uid,
    diceRoll: null,
    winner: null,
    players: {
      [user.uid]: {
        uid: user.uid,
        name: playerName,
        color: 'red',
        position: 0,
        tokens: [
          { id: 0, position: 'home', boardPosition: -1 },
          { id: 1, position: 'home', boardPosition: -1 },
          { id: 2, position: 'home', boardPosition: -1 },
          { id: 3, position: 'home', boardPosition: -1 }
        ],
        isActive: true,
        joinedAt: serverTimestamp()
      }
    }
  };

  await set(gameRoomRef, initialGameState);
  return roomId;
};

export const joinGameRoom = async (roomId: string, user: User, playerName: string) => {
  const gameRoomRef = ref(database, `gameRooms/${roomId}`);
  const snapshot = await get(gameRoomRef);
  
  if (!snapshot.exists()) {
    throw new Error('Room not found');
  }

  const gameData = snapshot.val();
  const playerCount = Object.keys(gameData.players || {}).length;
  
  if (playerCount >= 4) {
    throw new Error('Room is full');
  }

  if (gameData.players?.[user.uid]) {
    // Player is rejoining
    const playerRef = ref(database, `gameRooms/${roomId}/players/${user.uid}`);
    await set(playerRef, {
      ...gameData.players[user.uid],
      isActive: true,
      name: playerName
    });
  } else {
    // New player joining
    const colors = ['red', 'blue', 'green', 'yellow'];
    const usedColors = Object.values(gameData.players || {}).map((p: any) => p.color);
    const availableColor = colors.find(color => !usedColors.includes(color)) || 'red';

    const playerRef = ref(database, `gameRooms/${roomId}/players/${user.uid}`);
    await set(playerRef, {
      uid: user.uid,
      name: playerName,
      color: availableColor,
      position: playerCount,
      tokens: [
        { id: 0, position: 'home', boardPosition: -1 },
        { id: 1, position: 'home', boardPosition: -1 },
        { id: 2, position: 'home', boardPosition: -1 },
        { id: 3, position: 'home', boardPosition: -1 }
      ],
      isActive: true,
      joinedAt: serverTimestamp()
    });
  }

  // Update last activity
  const lastUpdatedRef = ref(database, `gameRooms/${roomId}/lastUpdated`);
  await set(lastUpdatedRef, serverTimestamp());

  return gameData;
};

export const updateGameState = async (roomId: string, updates: any) => {
  const gameRoomRef = ref(database, `gameRooms/${roomId}`);
  await set(gameRoomRef, {
    ...updates,
    lastUpdated: serverTimestamp()
  });
};

export const listenToGameRoom = (roomId: string, callback: (data: any) => void) => {
  const gameRoomRef = ref(database, `gameRooms/${roomId}`);
  onValue(gameRoomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
  return gameRoomRef;
};

export const stopListening = (ref: DatabaseReference) => {
  off(ref);
};