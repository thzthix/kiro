/**
 * SessionHeader Component (REFACTOR Phase)
 * Feature: turtle-study-app
 * 
 * Displays timer information in a beige round panel at the top.
 * Shows "남은 시간" label and timer in MM:SS format.
 * 
 * Requirements: 1.1, 1.2, 2.1, 2.2
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../utils/ProgressCalculator';
import { COLORS, LAYOUT, TYPOGRAPHY } from '../constants/theme';

interface SessionHeaderProps {
  remainingSeconds: number;
  progress: number; // 0-100 (kept for compatibility but not displayed)
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  remainingSeconds,
}) => {
  const safeRemainingSeconds = Math.max(0, remainingSeconds);
  const formattedTime = formatTime(safeRemainingSeconds);

  return (
    <View
      style={styles.container}
      testID="session-header"
    >
      <View testID="session-header-container" style={styles.innerContainer}>
        <Text style={styles.label}>남은 시간</Text>
        <Text
          style={styles.timer}
          testID="timer-display"
          accessible={true}
          accessibilityLabel={`남은 시간: ${formattedTime}`}
          accessibilityRole="text"
        >
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightBeige,
    borderRadius: LAYOUT.borderRadiusLarge,
    marginHorizontal: LAYOUT.spacing.large,
    marginTop: LAYOUT.spacing.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  innerContainer: {
    padding: LAYOUT.spacing.xlarge,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginBottom: LAYOUT.spacing.small,
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    textAlign: 'center',
    letterSpacing: 2,
  },
});

export default SessionHeader;
