# CloudLudo - Real-time Multiplayer Ludo Game

A beautiful, real-time multiplayer Ludo game built with React, TypeScript, and Firebase. Play the classic board game with friends online without any downloads or complex setup.

## 🎯 Features

- **Real-time Multiplayer**: Play with 2-4 players simultaneously
- **Instant Synchronization**: All moves are synchronized across all players in real-time
- **Simple Room System**: Create or join games with easy 6-digit room codes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Graceful Reconnection**: Automatic reconnection handling for network interruptions
- **Anonymous Play**: No registration required - jump right into the game
- **Beautiful UI**: Modern design with smooth animations and micro-interactions

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- A Firebase project

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Realtime Database
3. Set up the following database rules:

```json
{
  "rules": {
    "gameRooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

4. Enable Authentication with Anonymous sign-in
5. Get your Firebase config object from Project Settings > General > Your apps > Firebase SDK snippet > Config

### Environment Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### GitHub Secrets Setup (for deployment)

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following repository secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT_LUDOMATCHUP` (for Firebase deployment)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Update Firebase configuration in `src/config/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

4. Start the development server:
```bash
npm run dev
```

## 🎮 How to Play

1. **Create a Room**: Enter your name and click "Create New Room"
2. **Share Room Code**: Share the generated 6-digit code with friends
3. **Join Game**: Friends can enter the code to join your room
4. **Start Playing**: Once 2-4 players have joined, the room creator can start the game
5. **Take Turns**: Roll dice and move tokens according to classic Ludo rules
6. **Win**: First player to get all 4 tokens to the finish area wins!

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth (Anonymous)
- **Build Tool**: Vite
- **UI Icons**: Lucide React

### File Structure
```
src/
├── components/          # React components
│   ├── GameBoard.tsx   # Main game board
│   ├── PlayerPanel.tsx # Player status panel
│   ├── GameControls.tsx # Game controls (dice, buttons)
│   └── JoinCreateRoom.tsx # Room creation/joining interface
├── contexts/           # React contexts
│   └── GameContext.tsx # Game state management
├── config/            # Configuration
│   └── firebase.ts    # Firebase setup and utilities
├── types/             # TypeScript types
│   └── game.ts        # Game state interfaces
└── App.tsx            # Main application component
```

### Game State Management
- Centralized state management using React Context
- Real-time synchronization via Firebase Realtime Database
- Optimistic updates for better user experience
- Automatic conflict resolution for simultaneous actions

## 🔒 Security & Performance

### Database Rules
The application uses Firebase Realtime Database rules that allow read/write access to game rooms. In production, you might want to implement more restrictive rules.

### Performance Optimizations
- Efficient re-renders using React.memo and useCallback
- Optimized Firebase listeners to minimize data transfer
- Lazy loading of game components
- Responsive images and icons

### Cost Efficiency
Designed to work within Firebase's free tier:
- Minimal database writes (only on actual game actions)
- Efficient data structure to reduce storage costs
- Automatic cleanup of inactive rooms (can be implemented)

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom color themes for each player. You can customize the appearance by modifying:
- Player colors in `src/index.css`
- Component styles in individual component files
- Global styles and animations

### Game Rules
Game logic is implemented in the `GameContext`. You can customize:
- Starting positions
- Movement rules
- Win conditions
- Special dice roll effects

## 📱 Mobile Support

The game is fully responsive and includes:
- Touch-optimized controls
- Mobile-first design approach
- Landscape orientation recommendations
- Appropriate font sizes for mobile screens

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Features

The modular architecture makes it easy to add new features:
1. Add new components in the `components/` directory
2. Extend game state in `types/game.ts`
3. Update Firebase utilities in `config/firebase.ts`
4. Add new context methods in `GameContext.tsx`

## 🐛 Known Issues & Limitations

- Game rooms don't have automatic cleanup (can be added)
- No spectator mode
- Limited to 4 players per game
- No game replay functionality
- No AI players

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or building your own games!

## 🙏 Acknowledgments

- Firebase for real-time database capabilities
- Tailwind CSS for the beautiful styling system
- Framer Motion for smooth animations
- Lucide React for the icon set