import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../styles/colors';

interface DotIndicatorViewProps {
  size: number;
}

const DotIndicatorView: React.FC<DotIndicatorViewProps> = ({ size }) => {
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size,
        borderRadius: size / 2
      }
    ]}>
      <View style={[
        styles.innerDot, 
        { 
          width: size * 0.6, 
          height: size * 0.6,
          borderRadius: size * 0.3
        }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  innerDot: {
    backgroundColor: Colors.primary,
  },
});

export default DotIndicatorView; 