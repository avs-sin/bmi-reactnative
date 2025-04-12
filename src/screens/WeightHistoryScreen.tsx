import React from 'react'; // Removed useState if not needed for loading state
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator // Import ActivityIndicator for loading state
} from 'react-native';
import WeightTableViewCell from '../components/WeightTableViewCell';
import Colors from '../styles/colors';
import { useUserDataContext } from '../context/UserDataContext'; // Import context hook
import { WeightHistory } from '../utils/DataStore'; // Import type

const WeightHistoryScreen: React.FC = () => {
  // Get weight history from context
  const { weightHistory } = useUserDataContext(); 
  // Optional: Add loading state if useUserData doesn't handle it internally
  // const [isLoading, setIsLoading] = React.useState(true); 
  // React.useEffect(() => { if (weightHistory) setIsLoading(false); }, [weightHistory]);

  // Format date (e.g., "April 11, 2025")
  const formatDate = (isoDate: string): string => {
    if (!isoDate) return ''; // Handle potential undefined dates
    try {
      const date = new Date(isoDate);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
          return 'Invalid Date';
      }
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error("Error formatting date:", isoDate, e);
      return 'Invalid Date';
    }
  };

  // Format weight based on the unit stored with the entry
  const formatHistoryWeight = (entry: WeightHistory): string => {
    if (typeof entry?.weight !== 'number') return 'N/A'; // Handle potential invalid entries
    return entry.isMetric 
      ? `${Math.round(entry.weight)} kg` 
      : `${entry.weight.toFixed(1)} lbs`;
  };

  // Sort history data by date, newest first
  const sortedHistory = React.useMemo(() => {
    // Filter out any potentially invalid entries before sorting
    const validHistory = weightHistory.filter(item => item && item.date && typeof item.weight === 'number');
    return [...validHistory].sort((a, b) => {
        // Add checks for valid dates before comparing
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (isNaN(dateA.getTime())) return 1; // Invalid dates go to the end
        if (isNaN(dateB.getTime())) return -1;
        return dateB.getTime() - dateA.getTime(); // Sort newest first
    });
  }, [weightHistory]);

  // Render item function for FlatList
  const renderHistoryItem = ({ item }: { item: WeightHistory }) => (
    <WeightTableViewCell
      date={formatDate(item.date)}
      weight={formatHistoryWeight(item)}
    />
  );

  // // Optional: Loading indicator
  // if (isLoading) { 
  //   return (
  //     <SafeAreaView style={[styles.container, styles.centerContent]}>
  //       <ActivityIndicator size="large" color={Colors.primary} />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {sortedHistory.length > 0 ? (
        <FlatList
          data={sortedHistory} // Use sorted history from context
          keyExtractor={(item, index) => item.date || index.toString()} // Use date or index as key
          renderItem={renderHistoryItem} // Use the render function
          contentContainerStyle={styles.listContent} // Add padding if needed
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Weight Records Yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            Start tracking your weight progress using the 'Track Weight' tab.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: { // Optional padding for the list itself
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30, // Increased padding
  },
  centerContent: { // Style for centering loading indicator
    flex: 1, // Ensure it takes full space for centering
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15, // Increased margin
    color: Colors.text, // Use theme color
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.secondaryText,
    lineHeight: 24, // Improve readability
  },
});

export default WeightHistoryScreen;
