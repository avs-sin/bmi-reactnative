import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserDataProvider } from './src/context/UserDataContext';
import BMICalculatorScreen from './src/screens/BMICalculatorScreen';
import TrackWeightScreen from './src/screens/TrackWeightScreen';
import WeightHistoryScreen from './src/screens/WeightHistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <UserDataProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'calculator';

                if (route.name === 'BMI Calculator') {
                  iconName = focused ? 'calculator' : 'calculator-outline';
                } else if (route.name === 'Track Weight') {
                  iconName = focused ? 'analytics' : 'analytics-outline';
                } else if (route.name === 'Weight History') {
                  iconName = focused ? 'list' : 'list-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="BMI Calculator" component={BMICalculatorScreen} />
            <Tab.Screen name="Track Weight" component={TrackWeightScreen} />
            <Tab.Screen name="Weight History" component={WeightHistoryScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </UserDataProvider>
    </SafeAreaProvider>
  );
} 