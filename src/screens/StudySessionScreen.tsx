/**
 * StudySessionScreen Component
 * Feature: turtle-study-app
 * Task: 13.3 Create StudySessionScreen (GREEN)
 * Refactored: Task 13.5 Refactor screens (REFACTOR)
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

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useStudySession } from '../hooks/useStudySession';
import SessionHeader from '../components/SessionHeader';
import StudyCanvas from '../components/StudyCanvas';
import CareItemsPanel from '../components/CareItemsPanel';
import SessionControls from '../components/SessionControls';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { calculateProgress } from '../utils/ProgressCalculator';
import { CareItemType, TurtleState, SessionStatus } from '../types';
import { COLORS } from '../constants/theme';

interface StudySessionScreenProps {
  sessionId?: string;
}

/**
 * Determines if care items panel should be disabled.
 * Disabled when session is paused or turtle is in eating/happy state.
 */
const isCareItemsDisabled = (
  status: SessionStatus,
  turtleState: TurtleState
): boolean => {
  return (
    status === 'paused' ||
    turtleState === 'eating' ||
    turtleState === 'happy'
  );
};

export const StudySessionScreen: React.FC<StudySessionScreenProps> = () => {
  const { session, pauseSession, resumeSession, stopSession, provideItem } = useStudySession();
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  // Calculate progress percentage from elapsed time
  const elapsedSeconds = session ? session.totalDuration - session.remainingTime : 0;
  const progress = useMemo(
    () => session ? calculateProgress(elapsedSeconds, session.totalDuration) : 0,
    [session, elapsedSeconds]
  );

  // Determine if care items panel should be disabled
  const careItemsDisabled = useMemo(
    () => session ? isCareItemsDisabled(session.status, session.turtleState) : false,
    [session]
  );

  const handleItemTap = useCallback(
    (itemType: CareItemType) => {
      provideItem(itemType);
    },
    [provideItem]
  );

  const handlePause = useCallback(() => {
    pauseSession();
  }, [pauseSession]);

  const handleResume = useCallback(() => {
    resumeSession();
  }, [resumeSession]);

  const handleStop = useCallback(() => {
    setShowStopConfirmation(true);
  }, []);

  const handleStopConfirm = useCallback(() => {
    setShowStopConfirmation(false);
    stopSession();
  }, [stopSession]);

  const handleStopCancel = useCallback(() => {
    setShowStopConfirmation(false);
  }, []);

  // If no session exists, render empty screen (should not happen in normal flow)
  if (!session) {
    return <View testID="study-session-screen" style={styles.container} />;
  }

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
        disabled={careItemsDisabled}
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
      <ConfirmationDialog
        visible={showStopConfirmation}
        title="세션을 종료하시겠습니까?"
        message="진행 중인 공부 세션이 종료됩니다."
        confirmText="종료"
        cancelText="취소"
        onConfirm={handleStopConfirm}
        onCancel={handleStopCancel}
        testID="stop-confirmation-dialog"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
    position: 'relative',
  },
});
