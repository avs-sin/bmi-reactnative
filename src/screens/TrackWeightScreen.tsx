import React from 'react'; // Removed useState as it's now managed by context
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Alert // Added Alert for feedback
} from 'react-native';
import TileBackgroundView from '../components/TileBackgroundView';
import CircularProgressView from '../components/CircularProgressView';
import Colors from '../styles/colors';
import { useUserDataContext } from '../context/UserDataContext'; // Import context hook

const TrackWeightScreen: React.FC = () => {
  // Get data and functions from context
  const { 
    weight, 
    setWeight, // Use context setter
    startWeight, 
    targetWeight, 
    isMetric, 
    addWeightEntry // Use context action
  } = useUserDataContext();

  // Calculate progress towards target weight
  const calculateProgress = () => {
    // Handle edge case where start and target are the same
    if (targetWeight === startWeight) return 0; 
    
    const weightChange = startWeight - weight; // How much weight has changed from start
    const totalGoal = startWeight - targetWeight; // Total change needed to reach target

    // Handle gaining weight towards a higher target
    if (totalGoal < 0) { 
      const totalGainGoal = targetWeight - startWeight;
      const weightGained = weight - startWeight;
      return Math.max(0, Math.min(1, weightGained / totalGainGoal));
    }
    
    // Handle losing weight towards a lower target (or maintaining)
    if (totalGoal === 0) return 0; // Or 1 if already at target?
    return Math.max(0, Math.min(1, weightChange / totalGoal));
  };

  const progress = calculateProgress();

  // Format weight display based on metric/imperial
  const formatWeight = (value: number) => {
    return isMetric 
      ? `${Math.round(value)} kg` 
      : `${value.toFixed(1)} lbs`;
  };

  // Handle weight adjustment using context setter
  const adjustWeight = (amount: number) => {
    // Consider metric/imperial sensitivity for amount if needed (e.g., +/- 0.1 for lbs)
    // For now, simple +/- 1 unit
    const newValue = Math.max(0, weight + amount); // Calculate new value using current weight from context
    setWeight(newValue); // Pass the direct value, matching context type
  };

  // Handle saving the current weight using context action
  const handleSaveWeight = async () => {
    try {
      await addWeightEntry(weight); // Use the function from context
      Alert.alert('Success', 'Weight saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save weight.');
      console.error("Error saving weight from screen:", error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Weight Goals - Use context values */}
        <View style={styles.goalsContainer}>
          <TileBackgroundView style={styles.goalTile}>
            <Text style={styles.goalTitle}>Start Weight</Text>
            <Text style={styles.goalValue}>{formatWeight(startWeight)}</Text>
          </TileBackgroundView>
          
          <TileBackgroundView style={styles.goalTile}>
            <Text style={styles.goalTitle}>Target Weight</Text>
            <Text style={styles.goalValue}>{formatWeight(targetWeight)}</Text>
          </TileBackgroundView>
        </View>
        
        {/* Progress Circle - Use calculated progress */}
        <View style={styles.progressContainer}>
          <CircularProgressView progress={progress} size={200} />
          <Text style={styles.progressText}>{`${Math.round(progress * 100)}%`}</Text>
          <Text style={styles.progressSubtitle}>towards target</Text> 
        </View>
        
        {/* Current Weight Adjuster - Use context weight and adjustWeight handler */}
        <View style={styles.weightAdjuster}>
          <Text style={styles.weightLabel}>Log Current Weight</Text>
          <View style={styles.weightControls}>
            <TouchableOpacity 
              style={styles.weightButton} // Use correct style name
              onPress={() => adjustWeight(-1)} // Decrease weight via context
            >
              <Text style={styles.weightButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.weightValue}>{formatWeight(weight)}</Text> {/* Display context weight */}
            
            <TouchableOpacity 
              style={styles.weightButton} // Use correct style name
              onPress={() => adjustWeight(1)} // Increase weight via context
            >
              <Text style={styles.weightButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View> // Correct closing tag
        
        {/* Save Button - Use handleSaveWeight handler */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveWeight}>
          <Text style={styles.saveButtonText}>Save Current Weight</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Corrected StyleSheet definitions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  goalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  goalTile: {
    width: '48%',
  },
  goalTitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 5,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressSubtitle: { 
    fontSize: 14,
    marginTop: 5,
    color: Colors.secondaryText,
  },
  weightAdjuster: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weightLabel: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 15,
  },
  weightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  // Style for the +/- buttons
  weightButton: { // Correctly defined
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10, 
  },
  weightButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  weightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 80, 
    textAlign: 'center',
  },
  // Style for the main save button at the bottom (Single definition)
  saveButton: { 
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TrackWeightScreen;
