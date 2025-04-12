# BMI Calculator Migration Plan: Swift to React Native

## Overview
This document outlines the migration strategy for converting the Swift BMI Calculator app to React Native. The goal is to create a cross-platform version that maintains feature parity and visual similarity with the original iOS app.

## Progress Update

### Completed Tasks
- ✅ Basic project structure set up
- ✅ Core UI components implemented (BMISemiCircleProgressView, CircularProgressView, etc.)
- ✅ Main screens scaffolded (BMICalculator, TrackWeight, WeightHistory)
- ✅ Data Context implementation with React Context
- ✅ Modal picker for attributes (weight/height) implemented
- ✅ BMI calculation logic ported to TypeScript
- ✅ Tab-based navigation structure

### In Progress Tasks
- Integration of AsyncStorage for data persistence
- Connecting remaining screens to the data context
- Polishing animations and transitions
- Unit test setup

## Component Mapping
Here's how Swift components map to React Native components:

| Swift Component | React Native Component |
|-----------------|------------------------|
| UITabBarController | React Navigation Tab Navigator |
| UIViewController | React Native Screen Components |
| UIStackView | View with flexbox styling |
| UILabel | Text component |
| UIButton | TouchableOpacity / Button |
| UISegmentedControl | SegmentedControl component |
| UIImageView | Image component |
| UIView (custom) | Custom React Native components |
| UITableView | FlatList component |
| UITableViewCell | Custom cell components |

## Visual Components Migration

### BMISemiCircleProgressView
- Swift: Custom UIView with CAShapeLayer for drawing arcs
- React Native: SVG components for drawing arcs with similar appearance
- Animations: React Native Animated API replaces CABasicAnimation

### CircularProgressView
- Swift: Custom UIView with circular path
- React Native: SVG Circle elements with stroke-dasharray animation

### DotIndicatorView
- Swift: Custom UIView with rounded corners
- React Native: Simple View component with border radius

### TileBackgroundView
- Swift: Extension with shadow and corner styling
- React Native: View with shadow styling and border radius

## Data Management
- Swift: Uses UserDefaults for persistent storage
- React Native: Uses AsyncStorage for storage
- Migration adds a custom hook (useUserData) for unified data management

## Next Steps
1. Complete the TrackWeightScreen implementation with context
2. Complete the WeightHistoryScreen implementation with context
3. Implement AsyncStorage persistence in DataStore
4. Fix remaining type errors and update imports
5. Add unit tests for calculation logic
6. Polish UI and animations

## Testing Plan
1. Verify visual appearance matches on iOS
2. Test all calculations produce the same results
3. Verify UI interactions function similarly
4. Test data persistence works correctly
5. Validate unit conversions (metric/imperial)

## Future Improvements
1. Add modal pickers for weight/height selection ✅
2. Implement premium features toggle and in-app purchase
3. Add cloud backup for weight history
4. Add widget support 
5. Add dark mode support 