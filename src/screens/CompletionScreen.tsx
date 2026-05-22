/**
 * CompletionScreen Component (GREEN Phase)
 * Feature: turtle-study-app
 * Task: 13.4 Create CompletionScreen (GREEN)
 * 
 * Displays completion screen when study session ends.
 * Shows turtle in arrived state (static, NO bouncing), GOAL flag,
 * session summary in MM:SS format, and action buttons.
 * 
 * Requirements: 4.7, 5.9, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import DecorativeElements from '../components/DecorativeElements';
import { formatTime } from '../utils/ProgressCalculator';
import { COLORS } from '../constants/theme';

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
  const lastPressTime = useRef<{ [key: string]: number }>({});

  // Debounce button presses (500ms cooldown)
  const handlePress = useCallback(
    (key: string, callback?: (payload?: { action: string }) => void, payload?: { action: string }) => {
      const now = Date.now();
      const lastPress = lastPressTime.current[key] || 0;

      if (now - lastPress < 500) {
        return; // Ignore rapid presses
      }

      lastPressTime.current[key] = now;
      callback?.(payload);
    },
    []
  );

  const handleStartNew = useCallback(() => {
    handlePress('startNew', onStartNew, { action: 'openTimeInput' });
  }, [handlePress, onStartNew]);

  const handleClose = useCallback(() => {
    handlePress('close', onClose, { action: 'returnHome' });
  }, [handlePress, onClose]);

  const formattedDuration = formatTime(totalDuration);

  return (
    <View testID="completion-screen" style={styles.container}>
      {/* Background with watercolor theme */}
      <View
        testID="completion-background"
        style={styles.backgroundContainer}
      >
        <BackgroundImage />
      </View>

      {/* Decorative elements */}
      <DecorativeElements />

      {/* Main content */}
      <View style={styles.contentContainer}>
        {/* Turtle and GOAL flag section */}
        <View style={styles.turtleSection}>
          <Image
            testID="completion-turtle"
            source={require('../../assets/images/turtle/turtle_arrived.png')}
            style={styles.turtleImage}
            // @ts-ignore - Custom props for testing
            state="arrived"
            animated={false}
            resizeMode="contain"
            accessibilityLabel="Turtle arrived at goal"
          />
          <Image
            testID="goal-flag"
            source={require('../../assets/images/markers/start-goal.png')}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  turtleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  turtleImage: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  goalFlag: {
    width: 60,
    height: 80,
  },
  summaryContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: COLORS.beige,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
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
    marginBottom: 20,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  closeButton: {
    backgroundColor: COLORS.oliveGreen,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
