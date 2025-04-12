import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  NativeSyntheticEvent,
  NativeSegmentedControlIOSChangeEvent
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import BMISemiCircleProgressView from '../components/BMISemiCircleProgressView';
import TileBackgroundView from '../components/TileBackgroundView';
import DotIndicatorView from '../components/DotIndicatorView';
import AttributePickerModal, { BMIAttribute } from '../components/AttributePickerModal';
import { useUserDataContext } from '../context/UserDataContext';
import Colors from '../styles/colors';
import { 
  calculateBMI, 
  getBMICategory, 
  calculateNormalWeightRange,
  getWeightDifference,
  BMICategory,
  BMICategoryRanges
} from '../utils/BMICalculator';

const BMICalculatorScreen: React.FC = () => {
  // Get user data from context
  const {
    isMetric,
    setIsMetric,
    weight,
    setWeight,
    height,
    setHeight
  } = useUserDataContext();
  
  // Local state
  const [bmi, setBmi] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState<BMIAttribute>('weight');
  
  // Calculate BMI when inputs change
  useEffect(() => {
    const calculatedBMI = calculateBMI(weight, height, isMetric);
    setBmi(calculatedBMI);
  }, [weight, height, isMetric]);
  
  // Handle showing attribute picker
  const showAttributePicker = (attribute: BMIAttribute) => {
    setCurrentAttribute(attribute);
    setShowPicker(true);
  };
  
  // Handle picker save
  const handlePickerSave = (value: string) => {
    setShowPicker(false);
    
    if (currentAttribute === 'weight') {
      if (isMetric) {
        setWeight(parseInt(value, 10));
      } else {
        const parts = value.split('.');
        const pounds = parseInt(parts[0], 10);
        const tenths = parts.length > 1 ? parseInt(parts[1], 10) : 0;
        setWeight(pounds + tenths / 10);
      }
    } else if (currentAttribute === 'height') {
      if (isMetric) {
        setHeight(parseInt(value, 10));
      } else {
        const parts = value.split("'");
        const feet = parseInt(parts[0], 10);
        const inches = parts.length > 1 ? parseInt(parts[1].replace('"', ''), 10) : 0;
        setHeight(feet * 12 + inches);
      }
    }
  };
  
  // Handle measurement system change
  const handleUnitChange = (value: number) => {
    const newIsMetric = value === 1;
    
    // Convert values when changing units
    if (newIsMetric && !isMetric) {
      // Convert to metric
      setWeight(Math.round(weight * 0.453592));
      setHeight(Math.round(height * 2.54));
    } else if (!newIsMetric && isMetric) {
      // Convert to imperial
      setWeight(Math.round(weight / 0.453592 * 10) / 10);
      setHeight(Math.round(height / 2.54));
    }
    
    setIsMetric(newIsMetric);
  };
  
  // Get BMI category and related data
  const bmiCategory = getBMICategory(bmi);
  const normalWeight = calculateNormalWeightRange(height, isMetric);
  const weightDiff = getWeightDifference(weight, height, isMetric);
  const isNormalWeight = bmiCategory.category === BMICategory.Normal;
  
  // Calculate indicator position for range bar
  const rangeBarPosition = Math.max(0, Math.min(1, (bmi - 15) / 25)) * 100;
  
  // Format the displayed weight and height values
  const displayWeight = isMetric 
    ? `${Math.round(weight)} kg` 
    : `${weight.toFixed(1)} lbs`;
    
  const displayHeight = isMetric 
    ? `${Math.round(height)} cm` 
    : `${Math.floor(height / 12)}' ${Math.round(height % 12)}"`;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.attributesContainer}>
          {/* Weight Button */}
          <View style={styles.attributeItem}>
            <TouchableOpacity 
              style={styles.attributeButton} 
              onPress={() => showAttributePicker('weight')}
            >
              <Text style={styles.attributeButtonText}>
                {displayWeight}
              </Text>
            </TouchableOpacity>
            <Text style={styles.attributeLabel}>Weight</Text>
          </View>
          
          {/* Unit Selector */}
          <View style={styles.attributeItem}>
            <SegmentedControl
              values={['Imperial', 'Metric']}
              selectedIndex={isMetric ? 1 : 0}
              onChange={(event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => {
                handleUnitChange(event.nativeEvent.selectedSegmentIndex);
              }}
              style={styles.segmentedControl}
            />
            <Text style={styles.attributeLabel}>Measurement System</Text>
          </View>
          
          {/* Height Button */}
          <View style={styles.attributeItem}>
            <TouchableOpacity 
              style={styles.attributeButton} 
              onPress={() => showAttributePicker('height')}
            >
              <Text style={styles.attributeButtonText}>
                {displayHeight}
              </Text>
            </TouchableOpacity>
            <Text style={styles.attributeLabel}>Height</Text>
          </View>
        </View>
        
        {/* BMI Semi Circle */}
        <View style={styles.bmiSemiCircleContainer}>
          <BMISemiCircleProgressView 
            bmiValue={bmi} 
            width={323} 
            height={150} 
          />
        </View>
        
        {/* Weight Range Tile */}
        <TileBackgroundView style={styles.weightRangeTile}>
          <View style={styles.weightRangeHeader}>
            <Text style={styles.weightRangeText}>
              {isNormalWeight 
                ? "Your weight is within the normal range" 
                : `Up to normal weight, you must ${weightDiff}`}
            </Text>
            <Image 
              source={{ 
                uri: isNormalWeight 
                  ? 'https://img.icons8.com/ios-filled/50/43d06e/checkmark--v1.png' 
                  : 'https://img.icons8.com/ios-filled/50/ff9500/warning--v1.png' 
              }}
              style={styles.weightRangeIcon}
            />
          </View>
          
          <View style={styles.rangeBar}>
            <View style={[styles.rangeBarSegment, { backgroundColor: Colors.lightGray }]} />
            <View style={[styles.rangeBarSegment, { backgroundColor: Colors.normal }]} />
            <View style={[styles.rangeBarSegment, { backgroundColor: Colors.lightGray }]} />
            
            {/* Range Bar Indicator */}
            <View style={[styles.rangeBarIndicator, { left: `${rangeBarPosition}%` }]}>
              <DotIndicatorView size={12} />
            </View>
          </View>
          
          <View style={styles.normalWeightRow}>
            <Text style={styles.normalWeightLabel}>Normal weight for you</Text>
            <Text style={styles.normalWeightValue}>
              {isMetric
                ? `${normalWeight[0].toFixed(0)}-${normalWeight[1].toFixed(0)} kg`
                : `${normalWeight[0].toFixed(1)}-${normalWeight[1].toFixed(1)} lbs`}
            </Text>
          </View>
        </TileBackgroundView>
        
        {/* BMI Categories */}
        <TileBackgroundView style={styles.categoriesTile}>
          {BMICategoryRanges.map((category, index) => (
            <View key={index} style={styles.categoryRow}>
              <View style={styles.categoryIndicator}>
                <View 
                  style={[
                    styles.categoryDot, 
                    { backgroundColor: category.color }
                  ]} 
                />
                <Text 
                  style={[
                    styles.categoryName,
                    bmiCategory.category === category.category && styles.activeCategoryText
                  ]}
                >
                  {category.category}
                </Text>
              </View>
              <Text 
                style={[
                  styles.categoryRange,
                  bmiCategory.category === category.category && styles.activeCategoryText
                ]}
              >
                {`${category.range[0]} - ${category.range[1]}`}
              </Text>
            </View>
          ))}
        </TileBackgroundView>
      </ScrollView>
      
      {/* Attribute Picker Modal */}
      <AttributePickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSave={handlePickerSave}
        attribute={currentAttribute}
        isMetric={isMetric}
        initialValue={currentAttribute === 'weight' 
          ? weight.toString() 
          : height.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  attributesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  attributeItem: {
    alignItems: 'center',
  },
  attributeButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  attributeButtonText: {
    fontSize: 16,
  },
  attributeLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  segmentedControl: {
    width: 150,
  },
  bmiSemiCircleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  weightRangeTile: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  weightRangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  weightRangeText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '300',
  },
  weightRangeIcon: {
    width: 20,
    height: 20,
  },
  rangeBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  rangeBarSegment: {
    flex: 1,
    height: '100%',
  },
  rangeBarIndicator: {
    position: 'absolute',
    top: -2,
    transform: [{ translateX: -6 }],
  },
  normalWeightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  normalWeightLabel: {
    fontSize: 15,
  },
  normalWeightValue: {
    fontSize: 17,
    fontWeight: '600',
  },
  categoriesTile: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  categoryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: Colors.text,
  },
  categoryRange: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  activeCategoryText: {
    fontWeight: '600',
    color: Colors.text,
  },
});

export default BMICalculatorScreen; 