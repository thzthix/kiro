/**
 * TimerDisplay Component (REFACTOR Phase)
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
import { sanitizeSeconds, createTimeAccessibilityLabel } from '../utils/progressUtils';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

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
  const sanitizedSeconds = sanitizeSeconds(remainingSeconds);
  const formattedTime = formatTime(sanitizedSeconds);
  const accessibilityLabel = createTimeAccessibilityLabel(sanitizedSeconds);

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

const styles = StyleSheet.create({
  timer: {
    fontSize: TYPOGRAPHY.timerFontSize,
    fontWeight: TYPOGRAPHY.timerFontWeight,
    textAlign: 'center',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
});

export default TimerDisplay;
