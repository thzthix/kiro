/**
 * StudySessionScreen Component (GREEN Phase)
 * Feature: turtle-study-app
 * Task: 13.3 Create StudySessionScreen (GREEN)
 * 
 * Main screen for active study session with:
 * - SessionHeader (timer + progress bar) at top
 * - StudyCanvas (background, path, turtle, decorative elements) in center
 * - CareItemsPanel (돌봐주기 with carrot/water buttons) at bottom left
 * - SessionControls (pause/resume/stop buttons) at bottom right
 * 
 * State management via useStudySession hook.
 * Non-interactive areas completely ignore touches (no error message).
 * 
 * Requirements: All session screen requirements from design.md
 */

import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { useStudySession } from '../hooks/useStudySession';
import SessionHeader from '../components/SessionHeader';
import StudyCanvas from '../components/StudyCanvas';
import CareItemsPanel from '../components/CareItemsPanel';
import SessionControls from '../components/SessionControls';
import { calculateProgress } from '../utils/ProgressCalculator';
import { CareItemType } from '../types';

interface StudySessionScreenProps {
  sessionId?: string;
}

export const StudySessionScreen: React.FC<StudySessionScreenProps> = () => {
  const { session, pauseSession, resumeSession, stopSession, provideItem } = useStudySession();
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  // If no session exists, render empty screen (should not happen in normal flow)
  if (!session) {
    return <View testID="study-session-screen" style={styles.container} />;
  }

  // Calculate progress percentage from elapsed time
  const elapsedSeconds = session.totalDuration - session.remainingTime;
  const progress = calculateProgress(elapsedSeconds, session.totalDuration);

  // Determine if care items panel should be disabled
  const isCareItemsDisabled =
    session.status === 'paused' ||
    session.turtleState === 'eating' ||
    session.turtleState === 'happy';

  // Handle care item tap
  const handleItemTap = (itemType: CareItemType) => {
    provideItem(itemType);
  };

  // Handle pause action
  const handlePause = () => {
    pauseSession();
  };

  // Handle resume action
  const handleResume = () => {
    resumeSession();
  };

  // Handle stop action
  const handleStop = () => {
    setShowStopConfirmation(true);
  };

  // Handle stop confirmation
  const handleStopConfirm = () => {
    setShowStopConfirmation(false);
    stopSession();
  };

  // Handle stop cancellation
  const handleStopCancel = () => {
    setShowStopConfirmation(false);
  };

  return (
    <View testID="study-session-screen" style={styles.container}>
      {/* SessionHeader at top with timer and progress bar */}
      <SessionHeader
        remainingSeconds={session.remainingTime}
        progress={progress}
      />

      {/* StudyCanvas in center with background, path, turtle, decorative elements */}
      <StudyCanvas
        progress={progress}
        turtleState={session.turtleState}
        carrotCount={session.carrotCount}
        waterCount={session.waterCount}
      />

      {/* CareItemsPanel at bottom left */}
      <CareItemsPanel
        onItemTap={handleItemTap}
        disabled={isCareItemsDisabled}
        carrotCount={session.carrotCount}
        waterCount={session.waterCount}
        turtleState={session.turtleState}
      />

      {/* SessionControls at bottom right */}
      {(session.status === 'running' || session.status === 'paused') && (
        <SessionControls
          status={session.status}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
        />
      )}

      {/* Stop Confirmation Dialog */}
      {showStopConfirmation && (
        <Modal
          transparent
          visible={showStopConfirmation}
          onRequestClose={handleStopCancel}
        >
          <View style={styles.modalOverlay} testID="stop-confirmation-dialog">
            <View style={styles.dialogContainer}>
              <Text style={styles.dialogTitle}>세션을 종료하시겠습니까?</Text>
              <Text style={styles.dialogMessage}>
                진행 중인 공부 세션이 종료됩니다.
              </Text>
              <View style={styles.dialogButtons}>
                <TouchableOpacity
                  testID="stop-cancel-button"
                  style={[styles.dialogButton, styles.cancelButton]}
                  onPress={handleStopCancel}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="stop-confirm-button"
                  style={[styles.dialogButton, styles.confirmButton]}
                  onPress={handleStopConfirm}
                >
                  <Text style={styles.confirmButtonText}>종료</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8', // Beige background
    position: 'relative',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  dialogMessage: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E8E8E8',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
