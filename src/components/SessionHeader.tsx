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
import { COLORS } from '../constants/theme';

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
      <View style={styles.innerContainer} testID="session-header-container">
        <View style={styles.panelBase} testID="timer-panel-base">
          <View style={styles.panelInnerBorder} />
          <View style={styles.labelWrap}>
            <Text style={styles.labelText}>남은 시간</Text>
          </View>
          <View style={styles.textTimerWrap} pointerEvents="none">
            <Text
              style={styles.timerText}
              testID="timer-display-visible"
            >
              {formattedTime}
            </Text>
          </View>
        </View>

        <Text
          style={styles.hiddenTimer}
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
    width: '100%',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 412,
    aspectRatio: 1756 / 895,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 356,
  },
  panelBase: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: '#FFF7E2',
    borderWidth: 1,
    borderColor: 'rgba(228, 206, 150, 0.8)',
    shadowColor: '#C3AA74',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  panelInnerBorder: {
    position: 'absolute',
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(255, 250, 236, 0.75)',
  },
  labelWrap: {
    position: 'absolute',
    top: '15.6%',
    width: '100%',
    alignItems: 'center',
  },
  textTimerWrap: {
    position: 'absolute',
    top: '35.1%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#7B6344',
    letterSpacing: 0.2,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.38)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  timerText: {
    fontFamily: 'Nanum Gothic, Arial, sans-serif',
    fontSize: 84,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 94,
    color: '#7B6344',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.42)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  hiddenTimer: {
    position: 'absolute',
    opacity: 0,
    color: COLORS.darkGray,
  },
});

export default SessionHeader;
