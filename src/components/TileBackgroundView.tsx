import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Colors from '../styles/colors';

interface TileBackgroundViewProps extends ViewProps {
  children: React.ReactNode;
  inset?: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
}

const TileBackgroundView: React.FC<TileBackgroundViewProps> = ({ 
  children, 
  inset = { top: 15, left: 15, bottom: 15, right: 15 },
  style,
  ...props 
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <View 
        style={[
          styles.tile, 
          { 
            padding: 0,
            paddingTop: inset.top, 
            paddingLeft: inset.left, 
            paddingBottom: inset.bottom, 
            paddingRight: inset.right 
          }
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tile: {
    backgroundColor: Colors.tileBackground,
    borderRadius: 15,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default TileBackgroundView;
