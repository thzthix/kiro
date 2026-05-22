/**
 * CompletionScreen Component
 * Feature: turtle-study-app
 * Task: 13.4 Create CompletionScreen (GREEN)
 * Refactored: Task 13.5 Refactor screens (REFACTOR)
 * 
 * Displays completion screen when study session ends.
 * Shows turtle in arrived state (static, NO bouncing), GOAL flag,
 * session summary in MM:SS format, and action buttons.
 * 
 * Uses ScreenLayout for common background and decorative elements.
 * Button presses are debounced to prevent rapid repeated taps.
 * 
 * Requirements: 4.7, 5.9, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import { formatTime } from '../utils/ProgressCalculator';
import { useButtonDebounce } from '../hooks/useButtonDebounce';
import { COLORS, LAYOUT } from '../constants/theme';
import turtleArrived from '../../assets/images/turtle/turtle_arrived.png';
import startGoal from '../../assets/images/markers/start-goal.png';

interface CompletionScreenProps {
  totalDuration?: number;
  onStartNew?: (payload?: { action: string }) => void;
  onClose?: (payload?: { action: string }) => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  totalDuration = 0,
  onStartNew,
  onClose,
}) => {
  const { handlePress } = useButtonDebounce(500);

  const handleStartNew = useCallback(() => {
    handlePress('startNew', onStartNew, { action: 'openTimeInput' });
  }, [handlePress, onStartNew]);

  const handleClose = useCallback(() => {
    handlePress('close', onClose, { action: 'returnHome' });
  }, [handlePress, onClose]);

  const formattedDuration = formatTime(totalDuration);

  return (
    <ScreenLayout testID="completion-screen" contentStyle={styles.centeredContent}>
      {/* Turtle and GOAL flag section */}
      <View style={styles.turtleSection}>
        <Image
          testID="completion-turtle"
          source={Platform.OS === 'web' ? turtleArrived : require('../../assets/images/turtle/turtle_arrived.png')}
          style={styles.turtleImage}
          // @ts-ignore - Custom props for testing
          state="arrived"
          animated={false}
          resizeMode="contain"
          accessibilityLabel="Turtle arrived at goal"
        />
        <Image
          testID="goal-flag"
          source={Platform.OS === 'web' ? startGoal : require('../../assets/images/markers/start-goal.png')}
          style={styles.goalFlag}
          resizeMode="contain"
          accessibilityLabel="Goal flag"
        />
      </View>

      {/* Session summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.completionMessage}>완료!</Text>
        <Text style={styles.congratsText}>수고하셨습니다</Text>
        <Text testID="completion-duration" style={styles.durationText}>
          {formattedDuration}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          testID="start-new-button"
          style={styles.button}
          onPress={handleStartNew}
          accessible={true}
          accessibilityLabel="새로운 세션 시작"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>새로운 세션 시작</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="close-button"
          style={[styles.button, styles.closeButton]}
          onPress={handleClose}
          accessible={true}
          accessibilityLabel="홈으로 돌아가기"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.spacing.large,
  },
  turtleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: LAYOUT.spacing.extraLarge,
  },
  turtleImage: {
    width: LAYOUT.image.turtleArrived,
    height: LAYOUT.image.turtleArrived,
    marginRight: LAYOUT.spacing.large,
  },
  goalFlag: {
    width: LAYOUT.image.goalFlag,
    height: LAYOUT.image.goalFlagHeight,
  },
  summaryContainer: {
    alignItems: 'center',
    marginBottom: LAYOUT.spacing.extraLarge,
    backgroundColor: COLORS.beige,
    paddingVertical: LAYOUT.spacing.large,
    paddingHorizontal: 30,
    borderRadius: LAYOUT.borderRadiusLarge,
  },
  completionMessage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.oliveGreen,
    marginBottom: 10,
  },
  congratsText: {
    fontSize: 18,
    color: COLORS.oliveGreen,
    marginBottom: LAYOUT.spacing.large,
  },
  durationText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.mint,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    backgroundColor: COLORS.mint,
    paddingVertical: LAYOUT.button.paddingVertical,
    paddingHorizontal: LAYOUT.button.paddingHorizontal,
    borderRadius: LAYOUT.button.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: LAYOUT.button.minHeight,
    minWidth: LAYOUT.button.minWidth,
  },
  closeButton: {
    backgroundColor: COLORS.oliveGreen,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
