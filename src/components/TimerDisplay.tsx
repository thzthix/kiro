/**
 * TimerDisplay Component
 * Feature: turtle-study-app
 * 
 * Displays remaining time in MM:SS format with large, bold, centered typography.
 * 
 * Requirements:
 * - 1.2: Display timer in MM:SS format
 * - 2.1: Timer updates every second
 * - 2.2: Timer displays remaining time accurately
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatTime } from '../utils/ProgressCalculator';

interface TimerDisplayProps {
  remainingSeconds: number;
}

/**
 * TimerDisplay component renders the study session timer.
 * 
 * @param remainingSeconds - Remaining time in seconds
 * @returns Text component displaying formatted time
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingSeconds }) => {
  // Handle edge cases: negative, NaN, or decimal values
  const sanitizedSeconds = sanitizeSeconds(remainingSeconds);
  
  // Format time to MM:SS
  const formattedTime = formatTime(sanitizedSeconds);
  
  // Create accessibility label with readable time
  const accessibilityLabel = createAccessibilityLabel(sanitizedSeconds);

  return (
    <Text
      testID="timer-display"
      style={styles.timer}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="timer"
    >
      {formattedTime}
    </Text>
  );
};

/**
 * Sanitize seconds input to handle edge cases.
 * - Negative values → 0
 * - NaN → 0
 * - Decimals → floor to integer
 * 
 * @param seconds - Raw seconds value
 * @returns Sanitized non-negative integer seconds
 */
function sanitizeSeconds(seconds: number): number {
  // Handle NaN
  if (isNaN(seconds)) {
    return 0;
  }
  
  // Handle negative values
  if (seconds < 0) {
    return 0;
  }
  
  // Floor decimal values
  return Math.floor(seconds);
}

/**
 * Create accessibility label with readable time information.
 * 
 * @param seconds - Time in seconds
 * @returns Accessibility label string
 */
function createAccessibilityLabel(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} seconds remaining`;
  }
  
  if (remainingSeconds === 0) {
    return `${minutes} minutes remaining`;
  }
  
  return `${minutes} minutes and ${remainingSeconds} seconds remaining`;
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2C3E50', // Dark color for readability
    letterSpacing: 2,
  },
});

export default TimerDisplay;
