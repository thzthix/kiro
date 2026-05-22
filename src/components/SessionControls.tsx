/**
 * SessionControls Component (REFACTOR Phase)
 * Feature: turtle-study-app
 * 
 * Provides pause/resume and stop buttons for study session control.
 * 
 * Requirements:
 * - Provide pause/resume and stop buttons as round square buttons
 * - Position controls at bottom right of screen
 * - Show pause button (⏸️) when status is 'running'
 * - Show resume button when status is 'paused'
 * - Always show stop button (⏹️)
 * - Handle button taps with visual feedback (< 100ms)
 * - Show confirmation dialog for stop action
 * - Touch targets minimum 44x44 points
 * 
 * Validates: Requirements 9.1, 9.2, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from 'react-native';

// Constants for styling and configuration
const BUTTON_SIZE = 56;
const BUTTON_BORDER_RADIUS = 12;
const BUTTON_GAP = 12;
const BUTTON_BACKGROUND_COLOR = '#A8D5BA';
const DIALOG_BORDER_RADIUS = 16;
const DIALOG_BUTTON_BORDER_RADIUS = 8;
const DIALOG_MAX_WIDTH = 400;
const DIALOG_PADDING = 24;
const CANCEL_BUTTON_COLOR = '#E0E0E0';
const CONFIRM_BUTTON_COLOR = '#FF6B6B';
const MODAL_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';

const BUTTON_ICONS = {
  pause: '⏸️',
  resume: '▶️',
  stop: '⏹️',
} as const;

const CONFIRMATION_MESSAGE = 'Are you sure you want to stop this session?';

/**
 * Custom hook for managing touch feedback animation (< 100ms for buttons)
 */
const useTouchFeedback = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const animateTouchFeedback = useCallback(() => {
    // Reset animations
    scaleAnim.setValue(1);
    opacityAnim.setValue(1);

    // Quick feedback animation (< 100ms total)
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return { scaleAnim, opacityAnim, animateTouchFeedback };
};

interface SessionControlsProps {
  status: 'running' | 'paused';
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

interface ControlButtonProps {
  icon: string;
  onPress: () => void;
  testID: string;
  accessibilityLabel: string;
  onTouchFeedback: () => void;
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
}

interface StopConfirmationDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reusable control button component with touch feedback
 */
const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  onPress,
  testID,
  accessibilityLabel,
  onTouchFeedback,
  scaleAnim,
  opacityAnim,
}) => {
  const handlePressIn = () => {
    onTouchFeedback();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        testID={testID}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>{icon}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Stop confirmation dialog component
 */
const StopConfirmationDialog: React.FC<StopConfirmationDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.dialog} testID="stop-confirmation-dialog">
        <Text style={styles.dialogMessage}>{CONFIRMATION_MESSAGE}</Text>

        <View style={styles.dialogButtons}>
          <Pressable
            style={[styles.dialogButton, styles.cancelButton]}
            onPress={onCancel}
            testID="stop-cancel-button"
            accessible={true}
            accessibilityLabel="cancel stop"
            accessibilityRole="button"
          >
            <Text style={styles.dialogButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.dialogButton, styles.confirmButton]}
            onPress={onConfirm}
            testID="stop-confirm-button"
            accessible={true}
            accessibilityLabel="confirm stop"
            accessibilityRole="button"
          >
            <Text style={styles.dialogButtonText}>Stop</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const SessionControls: React.FC<SessionControlsProps> = ({
  status,
  onPause,
  onResume,
  onStop,
}) => {
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  // Touch feedback hooks for each button
  const pauseResumeFeedback = useTouchFeedback();
  const stopFeedback = useTouchFeedback();

  const handleStopPress = () => {
    setShowStopConfirmation(true);
  };

  const handleStopConfirm = () => {
    setShowStopConfirmation(false);
    onStop();
  };

  const handleStopCancel = () => {
    setShowStopConfirmation(false);
  };

  const isRunning = status === 'running';

  return (
    <>
      <View style={styles.container} testID="session-controls-container">
        {/* Pause/Resume Button */}
        {isRunning ? (
          <ControlButton
            icon={BUTTON_ICONS.pause}
            onPress={onPause}
            testID="pause-button"
            accessibilityLabel="pause session"
            onTouchFeedback={pauseResumeFeedback.animateTouchFeedback}
            scaleAnim={pauseResumeFeedback.scaleAnim}
            opacityAnim={pauseResumeFeedback.opacityAnim}
          />
        ) : (
          <ControlButton
            icon={BUTTON_ICONS.resume}
            onPress={onResume}
            testID="resume-button"
            accessibilityLabel="resume session"
            onTouchFeedback={pauseResumeFeedback.animateTouchFeedback}
            scaleAnim={pauseResumeFeedback.scaleAnim}
            opacityAnim={pauseResumeFeedback.opacityAnim}
          />
        )}

        {/* Stop Button */}
        <ControlButton
          icon={BUTTON_ICONS.stop}
          onPress={handleStopPress}
          testID="stop-button"
          accessibilityLabel="stop session"
          onTouchFeedback={stopFeedback.animateTouchFeedback}
          scaleAnim={stopFeedback.scaleAnim}
          opacityAnim={stopFeedback.opacityAnim}
        />
      </View>

      {/* Stop Confirmation Dialog */}
      {showStopConfirmation && (
        <StopConfirmationDialog
          visible={showStopConfirmation}
          onConfirm={handleStopConfirm}
          onCancel={handleStopCancel}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Container styles
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    gap: BUTTON_GAP,
  },

  // Button styles
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_BORDER_RADIUS,
    backgroundColor: BUTTON_BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 24,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: MODAL_OVERLAY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Dialog styles
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: DIALOG_BORDER_RADIUS,
    padding: DIALOG_PADDING,
    width: '80%',
    maxWidth: DIALOG_MAX_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  dialogMessage: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: DIALOG_BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: CANCEL_BUTTON_COLOR,
  },
  confirmButton: {
    backgroundColor: CONFIRM_BUTTON_COLOR,
  },
  dialogButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SessionControls;
