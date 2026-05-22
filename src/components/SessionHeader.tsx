/**
 * SessionHeader Component
 * Feature: turtle-study-app
 * 
 * Displays timer and progress information in a beige round panel at the top.
 * 
 * Requirements:
 * - Beige-colored round panel container
 * - Large timer in MM:SS format centered horizontally
 * - Progress bar directly below timer
 * - Mini turtle icon on progress bar slider head that moves rightward
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../utils/ProgressCalculator';

interface SessionHeaderProps {
  remainingSeconds: number;
  progress: number; // 0-100
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  remainingSeconds,
  progress,
}) => {
  // Clamp progress to [0, 100] range
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Handle negative remainingSeconds gracefully
  const safeRemainingSeconds = Math.max(0, remainingSeconds);
  
  // Format time using ProgressCalculator utility
  const formattedTime = formatTime(safeRemainingSeconds);

  return (
    <View
      style={styles.container}
      testID="session-header"
    >
      <View testID="session-header-container" style={styles.innerContainer}>
        <Text
          style={styles.timer}
          testID="timer-display"
          accessible={true}
          accessibilityLabel={`Remaining time: ${formattedTime}`}
          accessibilityRole="text"
        >
          {formattedTime}
        </Text>
        
        <View
          style={styles.progressBarContainer}
          testID="progress-bar"
          accessible={true}
          accessibilityLabel={`Progress: ${clampedProgress.toFixed(0)} percent`}
          accessibilityRole="progressbar"
          // @ts-ignore - Adding progress prop for testing
          progress={clampedProgress}
        >
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${clampedProgress}%` },
              ]}
            />
          </View>
          
          <View
            style={[
              styles.turtleSlider,
              { left: `${clampedProgress}%` },
            ]}
            testID="progress-bar-turtle-slider"
          >
            <Text style={styles.turtleIcon}>🐢</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F1E8', // Beige color from design assets
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  innerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 24,
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A8D5BA', // Mint color from design assets
    borderRadius: 4,
  },
  turtleSlider: {
    position: 'absolute',
    top: 0,
    marginLeft: -12, // Center the turtle icon on the progress position
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turtleIcon: {
    fontSize: 20,
  },
});

export default SessionHeader;
