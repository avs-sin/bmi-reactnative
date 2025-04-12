# BMI Calculator - React Native Version

This is a React Native migration of the iOS BMI Calculator app. The React Native version replicates the UI and functionality of the original Swift application.

## Current Status

The migration is a work in progress. Here's what's been implemented so far:

- ✅ Project structure setup
- ✅ React Navigation with tabs
- ✅ Core UI components
- ✅ User data context for state management 
- ✅ BMI calculation logic
- ✅ Modal picker for selecting weight and height
- ✅ BMI visual display with semi-circle gauge

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

## Remaining Tasks

Check the `MIGRATION_PLAN.md` file for a detailed breakdown of completed and remaining tasks. In summary:

1. Implement AsyncStorage for data persistence
2. Complete TrackWeightScreen integration with context
3. Complete WeightHistoryScreen integration with context
4. Fix remaining type errors
5. Add unit tests
6. Polish UI animations

## Architecture

The application follows a context-based architecture:

- `src/components/`: Reusable UI components
- `src/screens/`: Main app screens
- `src/context/`: React Context for state management
- `src/utils/`: Utility functions and calculations
- `src/styles/`: Shared styles and colors

## Known Issues

- Type errors for some external dependencies
- Picker component needs additional styling for Android
- Missing permanent data storage implementation

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