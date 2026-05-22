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
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { formatTime } from '../utils/ProgressCalculator';
import { COLORS } from '../constants/theme';
import timerPanelBase from '../../assets/images/timer_pannel_base.jpeg';

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
        <Image
          source={
            Platform.OS === 'web'
              ? timerPanelBase
              : require('../../assets/images/timer_pannel_base.jpeg')
          }
          style={styles.panelBase}
          resizeMode="contain"
        />

        <View style={styles.textTimerWrap} pointerEvents="none">
          <Text style={styles.timerText}>{formattedTime}</Text>
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
    maxWidth: 320,
    aspectRatio: 1756 / 895,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 280,
  },
  panelBase: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textTimerWrap: {
    position: 'absolute',
    top: '33.5%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 76,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 84,
    color: '#7B6344',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hiddenTimer: {
    position: 'absolute',
    opacity: 0,
    color: COLORS.darkGray,
  },
});

export default SessionHeader;
