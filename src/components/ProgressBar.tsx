/**
 * ProgressBar Component (REFACTOR Phase)
 * Feature: turtle-study-app
 * 
 * Displays a horizontal progress bar with:
 * - Filled portion (mint color) representing progress
 * - Unfilled portion (light beige background)
 * 
 * Requirements: 1.3, 1.4, 1.5, 1.6, 3.5
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, LAYOUT } from '../constants/theme';
import { clampProgress } from '../utils/progressUtils';

interface ProgressBarProps {
  progress: number; // 0-100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = clampProgress(progress);

  return (
    <View
      testID="progress-bar"
      style={styles.container}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`Progress: ${clampedProgress.toFixed(0)} percent`}
      accessibilityValue={{
        now: clampedProgress,
        min: 0,
        max: 100,
      }}
      // @ts-ignore - Adding progress prop for testing
      progress={clampedProgress}
    >
      {/* Hidden progress value for testing */}
      <Text testID="progress-bar-value" style={{ display: 'none' }}>
        {clampedProgress}
      </Text>
      
      {/* Filled portion */}
      <View
        testID="progress-bar-filled"
        style={[
          styles.filledPortion,
          { width: `${clampedProgress}%` },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: LAYOUT.progressBarHeight,
    backgroundColor: COLORS.lightBeige,
    borderRadius: LAYOUT.borderRadiusSmall,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  filledPortion: {
    height: '100%',
    backgroundColor: COLORS.oliveGreen,
    borderRadius: LAYOUT.borderRadiusSmall,
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default ProgressBar;
