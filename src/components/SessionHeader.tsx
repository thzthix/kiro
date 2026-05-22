/**
 * SessionHeader Component (REFACTOR Phase)
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
import { COLORS, LAYOUT, TYPOGRAPHY } from '../constants/theme';
import { clampProgress } from '../utils/progressUtils';

interface SessionHeaderProps {
  remainingSeconds: number;
  progress: number; // 0-100
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  remainingSeconds,
  progress,
}) => {
  const clampedProgress = clampProgress(progress);
  const safeRemainingSeconds = Math.max(0, remainingSeconds);
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
    backgroundColor: COLORS.beige,
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
    padding: LAYOUT.spacing.large,
    alignItems: 'center',
  },
  timer: {
    fontSize: TYPOGRAPHY.timerFontSize,
    fontWeight: TYPOGRAPHY.timerFontWeight,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: LAYOUT.spacing.medium,
  },
  progressBarContainer: {
    width: '100%',
    height: LAYOUT.turtleSliderSize,
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: LAYOUT.progressBarHeight,
    backgroundColor: COLORS.lightGray,
    borderRadius: LAYOUT.borderRadiusSmall,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.mint,
    borderRadius: LAYOUT.borderRadiusSmall,
  },
  turtleSlider: {
    position: 'absolute',
    top: 0,
    marginLeft: -LAYOUT.turtleSliderSize / 2,
    width: LAYOUT.turtleSliderSize,
    height: LAYOUT.turtleSliderSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turtleIcon: {
    fontSize: TYPOGRAPHY.turtleIconSize,
  },
});

export default SessionHeader;
