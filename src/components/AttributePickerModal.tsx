import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../styles/colors';

export type BMIAttribute = 'weight' | 'height';

interface AttributePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  attribute: BMIAttribute;
  isMetric: boolean;
  initialValue?: string;
}

const AttributePickerModal: React.FC<AttributePickerModalProps> = ({
  visible,
  onClose,
  onSave,
  attribute,
  isMetric,
  initialValue
}) => {
  const [animation] = useState(new Animated.Value(0));
  const [selectedComponent1, setSelectedComponent1] = useState('0');
  const [selectedComponent2, setSelectedComponent2] = useState('0');
  
  // Generate picker items based on attribute and measurement system
  const getPickerItems = (component: number) => {
    if (attribute === 'weight') {
      if (component === 0) {
        // Main component (pounds or kilograms)
        if (isMetric) {
          // Kilograms (40kg to 200kg)
          return Array.from({ length: 161 }, (_, i) => i + 40).map(num => (
            <Picker.Item key={num} label={`${num}`} value={`${num}`} />
          ));
        } else {
          // Pounds (80lbs to 400lbs)
          return Array.from({ length: 321 }, (_, i) => i + 80).map(num => (
            <Picker.Item key={num} label={`${num}`} value={`${num}`} />
          ));
        }
      } else {
        // Decimal component (only for imperial)
        if (!isMetric) {
          // Tenths of pounds (0.0 to 0.9)
          return Array.from({ length: 10 }, (_, i) => i).map(num => (
            <Picker.Item key={num} label={`.${num}`} value={`${num}`} />
          ));
        }
      }
    } else if (attribute === 'height') {
      if (component === 0) {
        if (isMetric) {
          // Centimeters (100cm to 220cm)
          return Array.from({ length: 121 }, (_, i) => i + 100).map(num => (
            <Picker.Item key={num} label={`${num} cm`} value={`${num}`} />
          ));
        } else {
          // Feet (3ft to 7ft)
          return Array.from({ length: 5 }, (_, i) => i + 3).map(num => (
            <Picker.Item key={num} label={`${num} ft`} value={`${num}`} />
          ));
        }
      } else {
        // Inches component (only for imperial)
        if (!isMetric) {
          // Inches (0 to 11)
          return Array.from({ length: 12 }, (_, i) => i).map(num => (
            <Picker.Item key={num} label={`${num} in`} value={`${num}`} />
          ));
        }
      }
    }
    return [<Picker.Item key="0" label="0" value="0" />];
  };
  
  // Parse initial value if provided
  useEffect(() => {
    if (initialValue) {
      if (attribute === 'weight') {
        if (isMetric) {
          // Metric weight is just a number
          setSelectedComponent1(initialValue);
        } else {
          // Imperial weight has format like "150.5"
          const parts = initialValue.split('.');
          setSelectedComponent1(parts[0] || '0');
          setSelectedComponent2(parts.length > 1 ? parts[1] : '0');
        }
      } else if (attribute === 'height') {
        if (isMetric) {
          // Metric height is just cm
          setSelectedComponent1(initialValue);
        } else {
          // Imperial height has format like "5'11"
          const parts = initialValue.split("'");
          setSelectedComponent1(parts[0] || '0');
          setSelectedComponent2(parts.length > 1 ? parts[1].replace('"', '') : '0');
        }
      }
    }
  }, [initialValue, attribute, isMetric]);
  
  // Animate modal on visibility change
  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);
  
  const handleSave = () => {
    let value = '';
    
    if (attribute === 'weight') {
      if (isMetric) {
        value = selectedComponent1;
      } else {
        value = `${selectedComponent1}.${selectedComponent2}`;
      }
    } else if (attribute === 'height') {
      if (isMetric) {
        value = selectedComponent1;
      } else {
        value = `${selectedComponent1}'${selectedComponent2}"`;
      }
    }
    
    onSave(value);
  };
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });
  
  const getAttributeTitle = () => {
    switch (attribute) {
      case 'weight':
        return `What's your weight?`;
      case 'height':
        return `What's your height?`;
      default:
        return 'Select a value';
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.overlay, { opacity }]}
          onTouchEnd={onClose}
        />
        
        <Animated.View style={[styles.pickerContainer, { transform: [{ translateY }] }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>{getAttributeTitle()}</Text>
            
            <TouchableOpacity onPress={handleSave} style={styles.button}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerRow}>
            <View style={isMetric ? styles.fullPicker : styles.halfPicker}>
              <Picker
                selectedValue={selectedComponent1}
                onValueChange={(value: string) => setSelectedComponent1(value)}
                itemStyle={styles.pickerItem}
              >
                {getPickerItems(0)}
              </Picker>
            </View>
            
            {!isMetric && (
              <View style={styles.halfPicker}>
                <Picker
                  selectedValue={selectedComponent2}
                  onValueChange={(value: string) => setSelectedComponent2(value)}
                  itemStyle={styles.pickerItem}
                >
                  {getPickerItems(1)}
                </Picker>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    padding: 5,
  },
  cancelButton: {
    color: Colors.secondaryText,
    fontSize: 16,
  },
  saveButton: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  pickerRow: {
    flexDirection: 'row',
  },
  fullPicker: {
    width: '100%',
  },
  halfPicker: {
    width: '50%',
  },
  pickerItem: {
    fontSize: 22,
  },
});

export default AttributePickerModal; 