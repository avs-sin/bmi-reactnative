import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../styles/colors';

interface WeightTableViewCellProps {
  date: string;
  weight: string;
}

const WeightTableViewCell: React.FC<WeightTableViewCellProps> = ({ date, weight }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.weightText}>{weight}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  weightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
});

export default WeightTableViewCell; 