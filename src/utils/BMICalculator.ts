export enum BMICategory {
  VerySeverelyUnderweight = 'Very Severely Underweight',
  SeverelyUnderweight = 'Severely Underweight',
  Underweight = 'Underweight',
  Normal = 'Normal',
  Overweight = 'Overweight',
  ModeratelyObese = 'Moderately Obese',
  SeverelyObese = 'Severely Obese',
  VerySeverelyObese = 'Very Severely Obese',
}

export interface BMICategoryRange {
  category: BMICategory;
  range: [number, number];
  color: string;
}

export const BMICategoryRanges: BMICategoryRange[] = [
  { category: BMICategory.VerySeverelyUnderweight, range: [0, 15], color: '#3b82f6' },
  { category: BMICategory.SeverelyUnderweight, range: [15, 16], color: '#60a5fa' },
  { category: BMICategory.Underweight, range: [16, 18.5], color: '#93c5fd' },
  { category: BMICategory.Normal, range: [18.5, 25], color: '#43d06e' },
  { category: BMICategory.Overweight, range: [25, 30], color: '#f59e0b' },
  { category: BMICategory.ModeratelyObese, range: [30, 35], color: '#fb923c' },
  { category: BMICategory.SeverelyObese, range: [35, 40], color: '#ef4444' },
  { category: BMICategory.VerySeverelyObese, range: [40, 100], color: '#dc2626' },
];

export const calculateBMI = (weight: number, height: number, isMetric: boolean): number => {
  // Weight in kg, height in cm for metric
  // Weight in lbs, height in inches for imperial
  if (isMetric) {
    return weight / Math.pow(height / 100, 2);
  } else {
    return (weight * 703) / Math.pow(height, 2);
  }
};

export const getBMICategory = (bmi: number): BMICategoryRange => {
  for (const category of BMICategoryRanges) {
    if (bmi >= category.range[0] && bmi < category.range[1]) {
      return category;
    }
  }
  return BMICategoryRanges[0]; // Default to first category
};

export const calculateNormalWeightRange = (height: number, isMetric: boolean): [number, number] => {
  // Returns [min, max] normal weight
  const normalRange = BMICategoryRanges.find(r => r.category === BMICategory.Normal);
  const [minBMI, maxBMI] = normalRange?.range || [18.5, 25];
  
  if (isMetric) {
    // Height in cm
    const heightInM = height / 100;
    const minWeight = minBMI * Math.pow(heightInM, 2);
    const maxWeight = maxBMI * Math.pow(heightInM, 2);
    return [minWeight, maxWeight];
  } else {
    // Height in inches
    const minWeight = (minBMI * Math.pow(height, 2)) / 703;
    const maxWeight = (maxBMI * Math.pow(height, 2)) / 703;
    return [minWeight, maxWeight];
  }
};

export const getWeightDifference = (weight: number, height: number, isMetric: boolean): string => {
  const bmi = calculateBMI(weight, height, isMetric);
  const [minNormal, maxNormal] = calculateNormalWeightRange(height, isMetric);
  
  const normalBMIRange = BMICategoryRanges.find(r => r.category === BMICategory.Normal);
  const minNormalBMI = normalBMIRange?.range[0] || 18.5;
  const maxNormalBMI = normalBMIRange?.range[1] || 25;
  
  if (bmi < minNormalBMI) {
    // Underweight
    const weightToGain = minNormal - weight;
    return `gain ${weightToGain.toFixed(1)} ${isMetric ? 'kg' : 'lbs'}`;
  } else if (bmi > maxNormalBMI) {
    // Overweight
    const weightToLose = weight - maxNormal;
    return `lose ${weightToLose.toFixed(1)} ${isMetric ? 'kg' : 'lbs'}`;
  }
  
  return 'maintain your current weight';
}; 