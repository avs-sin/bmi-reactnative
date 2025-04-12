import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { BMICategory, getBMICategory } from '../utils/BMICalculator';
import DotIndicatorView from './DotIndicatorView';
import Colors from '../styles/colors';

interface BMISemiCircleProgressViewProps {
  bmiValue: number;
  width: number;
  height: number;
}

const BMISemiCircleProgressView: React.FC<BMISemiCircleProgressViewProps> = ({ 
  bmiValue, 
  width, 
  height 
}) => {
  const [animatedBMI] = useState(new Animated.Value(0));
  const [displayBMI, setDisplayBMI] = useState("0");
  const [categoryText, setCategoryText] = useState("");
  
  const radius = width / 2 - 10;
  const center = { x: width / 2, y: height - 20 };
  const indicatorSize = 16;
  
  // Create the gradient colors for the arc
  const blendColors = (color1: string, color2: string, ratio: number) => {
    // Simple color blending - production app would use a proper color library
    return color2; // Simplified for demo
  };
  
  // Get colors for the spectrum
  const getSpectrumColors = () => {
    const colors = [
      { start: Colors.underweight, end: Colors.normal },
      { start: Colors.normal, end: Colors.overweight },
      { start: Colors.overweight, end: Colors.obese }
    ];
    
    return colors.flatMap(pair => {
      return Array(33).fill(0).map((_, i) => 
        blendColors(pair.start, pair.end, i / 100)
      );
    });
  };
  
  // Calculate the indicator position based on BMI
  const calculateRotation = (bmi: number) => {
    // Mapping the BMI to an angle between PI and 2*PI + buffer
    // This is simplified - a real implementation would adjust ranges as in Swift
    let angle = Math.PI; // Start at PI (left side)
    
    if (bmi > 0) {
      const category = getBMICategory(bmi);
      
      // Different ranges for different categories
      let buffer = 44.0;
      switch (category.category) {
        case BMICategory.VerySeverelyUnderweight:
          buffer = 125.0;
          break;
        case BMICategory.SeverelyUnderweight:
          buffer = 75.0;
          break;
        case BMICategory.Underweight:
          buffer = 65.0;
          break;
        case BMICategory.Overweight:
          buffer = 35.0;
          break;
        case BMICategory.ModeratelyObese:
          buffer = 33.0;
          break;
        case BMICategory.SeverelyObese:
          buffer = 34.0;
          break;
      }
      
      angle = Math.PI - Math.min(bmi, buffer) / buffer * (Math.PI - 0.17);
      
      if (bmi >= 40) { // Very severely obese
        angle = 0.17;
      }
    }
    
    return angle;
  };
  
  useEffect(() => {
    // Animate the BMI value
    Animated.timing(animatedBMI, {
      toValue: bmiValue,
      duration: 2000,
      useNativeDriver: false,
    }).start();
    
    // Update the display BMI value during animation
    const listener = animatedBMI.addListener(({ value }) => {
      setDisplayBMI(value.toFixed(1));
      
      // Set category when we're close to the final value
      if (value > bmiValue * 0.9) {
        setCategoryText(getBMICategory(bmiValue).category);
      }
    });
    
    return () => {
      animatedBMI.removeListener(listener);
    };
  }, [bmiValue]);
  
  // Draw the arc paths with segments
  const renderSpectrumArcs = () => {
    const spectrumColors = getSpectrumColors();
    const arcLength = Math.PI / spectrumColors.length;
    
    return spectrumColors.map((color, index) => {
      const startAngle = Math.PI + index * arcLength;
      const endAngle = startAngle + arcLength;
      
      const pathData = describeArc(center.x, center.y, radius, startAngle, endAngle);
      
      return (
        <Path
          key={index}
          d={pathData}
          stroke={color}
          strokeWidth={20}
          strokeLinecap="round"
          fill="none"
        />
      );
    });
  };

  // Calculate the SVG arc path
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = {
      x: x + radius * Math.cos(startAngle),
      y: y + radius * Math.sin(startAngle)
    };
    
    const end = {
      x: x + radius * Math.cos(endAngle),
      y: y + radius * Math.sin(endAngle)
    };
    
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
  };
  
  // Calculate indicator position
  const indicatorRotation = calculateRotation(bmiValue);
  const indicatorPosition = {
    x: center.x + radius * Math.cos(indicatorRotation),
    y: center.y + radius * Math.sin(indicatorRotation)
  };
  
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Render spectrum arcs */}
        <G>
          {renderSpectrumArcs()}
        </G>
        
        {/* Indicator */}
        <G transform={`translate(${indicatorPosition.x - indicatorSize/2}, ${indicatorPosition.y - indicatorSize/2})`}>
          <DotIndicatorView size={indicatorSize} />
        </G>
      </Svg>
      
      {/* BMI value and category */}
      <View style={styles.labelContainer}>
        <Text style={styles.titleLabel}>BMI</Text>
        <Text style={styles.valueLabel}>{displayBMI}</Text>
        <Text style={styles.categoryLabel}>{categoryText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.4,
  },
  valueLabel: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  categoryLabel: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default BMISemiCircleProgressView; 