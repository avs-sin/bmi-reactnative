import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const SETTINGS_KEY = '@BMICalculator:userSettings';
const HISTORY_KEY = '@BMICalculator:weightHistory';

// Default values
const DEFAULT_WEIGHT_IMPERIAL = 150; // lbs
const DEFAULT_WEIGHT_METRIC = 68; // kg
const DEFAULT_HEIGHT_IMPERIAL = 67; // inches
const DEFAULT_HEIGHT_METRIC = 170; // cm
const DEFAULT_START_WEIGHT = 155; // lbs
const DEFAULT_TARGET_WEIGHT = 145; // lbs

// Default Settings Object
const DEFAULT_SETTINGS = {
  isMetric: false,
  weight: DEFAULT_WEIGHT_IMPERIAL,
  height: DEFAULT_HEIGHT_IMPERIAL,
  startWeight: DEFAULT_START_WEIGHT,
  targetWeight: DEFAULT_TARGET_WEIGHT,
};

export interface WeightHistory {
  date: string; // ISO string format
  weight: number;
  isMetric: boolean;
}

// Save a single weight entry by updating the history array
export const saveWeight = async (weight: number, isMetric: boolean): Promise<void> => {
  try {
    const newEntry: WeightHistory = {
      date: new Date().toISOString(),
      weight,
      isMetric,
    };

    const existingHistory = await loadWeightHistory();
    const updatedHistory = [...existingHistory, newEntry];
    const jsonValue = JSON.stringify(updatedHistory);
    await AsyncStorage.setItem(HISTORY_KEY, jsonValue);
    console.log('Saved weight entry and updated history.');

  } catch (error) {
    console.error('Error saving weight entry:', error);
  }
};

// Load the entire weight history array
export const loadWeightHistory = async (): Promise<WeightHistory[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    if (jsonValue != null) {
      const history = JSON.parse(jsonValue) as WeightHistory[];
      return history;
    } else {
      return []; // No history saved yet
    }
  } catch (error) {
    console.error('Error loading weight history:', error);
    return []; // Return empty array on error
  }
};

// Save all user settings together
export const saveUserSettings = async (
  isMetric: boolean,
  weight: number,
  height: number,
  startWeight: number,
  targetWeight: number
): Promise<void> => {
  try {
    const settings = { isMetric, weight, height, startWeight, targetWeight };
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
    console.log('Saved user settings:', settings);
  } catch (error) {
    console.error('Error saving user settings:', error);
  }
};

// Load all user settings
export const loadUserSettings = async (): Promise<{
  isMetric: boolean;
  weight: number;
  height: number;
  startWeight: number;
  targetWeight: number;
}> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    } else {
      // No settings saved yet, return defaults
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('Error loading user settings:', error);
    // Return defaults on error
    return DEFAULT_SETTINGS;
  }
};

// Hook for app-wide state management
export const useUserData = () => {
  const [isMetric, setIsMetric] = useState(DEFAULT_SETTINGS.isMetric);
  const [weight, setWeight] = useState(DEFAULT_WEIGHT_IMPERIAL);
  const [height, setHeight] = useState(DEFAULT_HEIGHT_IMPERIAL);
  const [startWeight, setStartWeight] = useState(DEFAULT_START_WEIGHT);
  const [targetWeight, setTargetWeight] = useState(DEFAULT_TARGET_WEIGHT);
  const [weightHistory, setWeightHistory] = useState<WeightHistory[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  
  // Load user data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const settings = await loadUserSettings();
      setIsMetric(settings.isMetric);
      setWeight(settings.weight);
      setHeight(settings.height);
      setStartWeight(settings.startWeight);
      setTargetWeight(settings.targetWeight);
      
      const history = await loadWeightHistory();
      setWeightHistory(history);
    };
    
    loadData();
  }, []);
  
  // Save user settings when they change
  useEffect(() => {
    saveUserSettings(isMetric, weight, height, startWeight, targetWeight);
  }, [isMetric, weight, height, startWeight, targetWeight]);
  
  // Add weight tracking entry
  const addWeightEntry = async (newWeight: number) => {
    await saveWeight(newWeight, isMetric);
    const history = await loadWeightHistory();
    setWeightHistory(history);
  };
  
  return {
    isMetric,
    setIsMetric,
    weight,
    setWeight,
    height,
    setHeight,
    startWeight,
    setStartWeight,
    targetWeight,
    setTargetWeight,
    weightHistory,
    addWeightEntry,
    isPremium,
    setIsPremium
  };
};
