import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { ExpenseCategory } from '@/types/subscription';

interface ExpenseChartProps {
  categories: ExpenseCategory[];
  totalAmount: number;
}

const { width } = Dimensions.get('window');
const CHART_SIZE = width * 0.5;
const RADIUS = CHART_SIZE / 2 - 20;
const CENTER = CHART_SIZE / 2;

export default function ExpenseChart({ categories, totalAmount }: ExpenseChartProps) {
  const circumference = 2 * Math.PI * RADIUS;
  
  let accumulatedPercentage = 0;
  
  const renderSegments = () => {
    return categories.map((category, index) => {
      const percentage = (category.amount / totalAmount) * 100;
      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedPercentage / 100 * circumference;
      
      accumulatedPercentage += percentage;
      
      return (
        <Circle
          key={category.name}
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={category.color}
          strokeWidth={16}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        {/* Background circle */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="#F3F4F6"
          strokeWidth={16}
          fill="transparent"
        />
        
        {/* Category segments */}
        {renderSegments()}
        
        {/* Center text */}
        <SvgText
          x={CENTER}
          y={CENTER - 15}
          textAnchor="middle"
          fontSize="14"
          fill="#6B7280"
          fontWeight="500"
        >
          Total Expenses
        </SvgText>
        <SvgText
          x={CENTER}
          y={CENTER + 5}
          textAnchor="middle"
          fontSize="12"
          fill="#9CA3AF"
        >
          (in Naira)
        </SvgText>
        <SvgText
          x={CENTER}
          y={CENTER + 25}
          textAnchor="middle"
          fontSize="20"
          fill="#1F2937"
          fontWeight="700"
        >
          ₦{totalAmount.toLocaleString()}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});