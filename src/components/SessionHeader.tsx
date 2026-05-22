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
import timePanelNumber from '../../assets/images/time_pannel_number.jpeg';

interface SessionHeaderProps {
  remainingSeconds: number;
  progress: number; // 0-100 (kept for compatibility but not displayed)
}

const NUMBER_SHEET_COLUMNS = 5;
const NUMBER_SHEET_ROWS = 2;
const NUMBER_SHEET_WIDTH = 1774;
const NUMBER_SHEET_HEIGHT = 887;
const DIGIT_WIDTH = NUMBER_SHEET_WIDTH / NUMBER_SHEET_COLUMNS;
const DIGIT_HEIGHT = NUMBER_SHEET_HEIGHT / NUMBER_SHEET_ROWS;

const DIGIT_INDEX: Record<string, number> = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
};

const TimerDigit: React.FC<{ digit: string }> = ({ digit }) => {
  const index = DIGIT_INDEX[digit] ?? 0;
  const column = index % NUMBER_SHEET_COLUMNS;
  const row = Math.floor(index / NUMBER_SHEET_COLUMNS);

  return (
    <View style={styles.digitViewport}>
      <Image
        source={
          Platform.OS === 'web'
            ? timePanelNumber
            : require('../../assets/images/time_pannel_number.jpeg')
        }
        style={[
          styles.digitSheet,
          {
            left: -column * styles.digitViewport.width,
            top: -row * styles.digitViewport.height,
          },
        ]}
      />
    </View>
  );
};

const SessionHeader: React.FC<SessionHeaderProps> = ({
  remainingSeconds,
}) => {
  const safeRemainingSeconds = Math.max(0, remainingSeconds);
  const formattedTime = formatTime(safeRemainingSeconds);
  const [minuteTens, minuteOnes, secondTens, secondOnes] = formattedTime.replace(':', '');

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

        <View style={styles.spriteTimerRow} pointerEvents="none">
          <TimerDigit digit={minuteTens} />
          <TimerDigit digit={minuteOnes} />
          <TimerDigit digit={secondTens} />
          <TimerDigit digit={secondOnes} />
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
    ...(Platform.OS === 'web' && {
      maxWidth: '28vw',
      minWidth: 280,
    }),
  },
  panelBase: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  spriteTimerRow: {
    position: 'absolute',
    top: '34.5%',
    width: '55%',
    height: '38%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '2.5%',
  },
  digitViewport: {
    width: 42,
    height: 54,
    overflow: 'hidden',
    position: 'relative',
  },
  digitSheet: {
    position: 'absolute',
    width: DIGIT_WIDTH > 0 ? (NUMBER_SHEET_WIDTH / DIGIT_WIDTH) * 42 : 42,
    height: DIGIT_HEIGHT > 0 ? (NUMBER_SHEET_HEIGHT / DIGIT_HEIGHT) * 54 : 54,
  },
  hiddenTimer: {
    position: 'absolute',
    opacity: 0,
    color: COLORS.darkGray,
  },
});

export default SessionHeader;
