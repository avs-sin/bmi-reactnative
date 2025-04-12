# BMI Calculator - React Native Version

This is a React Native migration of the iOS BMI Calculator app. The React Native version replicates the UI and functionality of the original Swift application.

## Current Status

The migration is now complete. Here's what's been implemented:

- ✅ Project structure setup
- ✅ React Navigation with tabs
- ✅ Core UI components
- ✅ User data context for state management 
- ✅ BMI calculation logic
- ✅ Modal picker for selecting weight and height
- ✅ BMI visual display with semi-circle gauge
- ✅ AsyncStorage for data persistence
- ✅ TrackWeightScreen integration with context
- ✅ WeightHistoryScreen integration with context
- ✅ Type errors fixed
- ✅ Unit tests added
- ✅ Polished UI animations
- ✅ Enhanced visual feedback, animations, and smooth transitions

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator

### Installation

1. Install dependencies:
```bash
cd ReactNativeBMICalculator
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open on iOS or Android:
```bash
npm run ios
# or
npm run android
```

## Customizable Themes

The app now supports customizable themes. Users can switch between light and dark modes and save their preferences using AsyncStorage.

### Switching Themes

1. Open the app.
2. Navigate to the BMI Calculator screen.
3. Scroll down to the Theme Selector section.
4. Choose between Light and Dark themes.

The selected theme will be saved and applied across sessions.

## Architecture

The application follows a context-based architecture:

- `src/components/`: Reusable UI components
- `src/screens/`: Main app screens
- `src/context/`: React Context for state management
- `src/utils/`: Utility functions and calculations
- `src/styles/`: Shared styles and colors

## Known Issues

- Picker component needs additional styling for Android

## Contributing

If you'd like to contribute to this migration project, please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original Swift application by Apps4World
- React Native and Expo team 
