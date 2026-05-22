/**
 * ProgressBar Component (GREEN Phase)
 * Feature: turtle-study-app
 * 
 * Displays a horizontal progress bar with:
 * - Filled portion (mint color) representing progress
 * - Unfilled portion (light beige background)
 * - Mini turtle icon slider that moves rightward with progress
 * 
 * Requirements: 1.3, 1.4, 1.5, 1.6, 3.5
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Clamp progress to 0-100 range and handle invalid values
  const clampedProgress = (() => {
    if (typeof progress !== 'number' || isNaN(progress)) {
      return 0;
    }
    return Math.max(0, Math.min(100, progress));
  })();

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
      
      {/* Mini turtle icon slider */}
      <View
        testID="progress-bar-turtle-slider"
        style={[
          styles.turtleSlider,
          { left: `${clampedProgress}%` },
        ]}
      >
        <Text style={styles.turtleIcon}>🐢</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#F5F1E8', // Light beige for unfilled portion
    borderRadius: 4,
    position: 'relative',
    overflow: 'visible', // Allow turtle icon to overflow
    width: '100%',
  },
  filledPortion: {
    height: '100%',
    backgroundColor: '#A8D5BA', // Mint color for filled portion
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  turtleSlider: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: -8, // Center vertically on the bar
    marginLeft: -12, // Center horizontally on the position
    justifyContent: 'center',
    alignItems: 'center',
  },
  turtleIcon: {
    fontSize: 20,
  },
});

export default ProgressBar;
