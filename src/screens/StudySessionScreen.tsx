/**
 * StudySessionScreen Component
 * Feature: turtle-study-app
 * Task: 13.3 Create StudySessionScreen (GREEN)
 * Refactored: Task 13.5, 17.6 Refactor screens and integration (REFACTOR)
 * 
 * Main screen for active study session with:
 * - SessionHeader (timer + progress bar) at top
 * - StudyCanvas (background, path, turtle, decorative elements) in center
 * - CareItemsPanel (돌봐주기 with carrot/water buttons) at bottom left
 * - SessionControls (pause/resume/stop buttons) at bottom right
 * 
 * State management via useStudySession hook.
 * Non-interactive areas completely ignore touches.
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
import { TurtleState, SessionStatus } from '../types';
import { COLORS } from '../constants/theme';

/**
 * Determines if care items panel should be disabled
 */
const shouldDisableCareItems = (
  status: SessionStatus,
  turtleState: TurtleState
): boolean => {
  return (
    status === 'paused' ||
    turtleState === 'eating' ||
    turtleState === 'happy'
  );
};

export const StudySessionScreen: React.FC = () => {
  const { session, pauseSession, resumeSession, stopSession, provideItem } = useStudySession();
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  const elapsedSeconds = session ? session.totalDuration - session.remainingTime : 0;
  const progress = useMemo(
    () => session ? calculateProgress(elapsedSeconds, session.totalDuration) : 0,
    [session, elapsedSeconds]
  );

  const careItemsDisabled = useMemo(
    () => session ? shouldDisableCareItems(session.status, session.turtleState) : false,
    [session]
  );

  const handleStopConfirm = useCallback(() => {
    setShowStopConfirmation(false);
    stopSession();
  }, [stopSession]);

  if (!session) {
    return <View testID="study-session-screen" style={styles.container} />;
  }

  return (
    <View testID="study-session-screen" style={styles.container}>
      <SessionHeader
        remainingSeconds={session.remainingTime}
        progress={progress}
      />

      <StudyCanvas
        progress={progress}
        turtleState={session.turtleState}
        carrotCount={session.carrotCount}
        waterCount={session.waterCount}
      />

      <CareItemsPanel
        onItemTap={provideItem}
        disabled={careItemsDisabled}
        carrotCount={session.carrotCount}
        waterCount={session.waterCount}
        turtleState={session.turtleState}
      />

      {(session.status === 'running' || session.status === 'paused') && (
        <SessionControls
          status={session.status}
          onPause={pauseSession}
          onResume={resumeSession}
          onStop={() => setShowStopConfirmation(true)}
        />
      )}

      <ConfirmationDialog
        visible={showStopConfirmation}
        title="세션을 종료하시겠습니까?"
        message="진행 중인 공부 세션이 종료됩니다."
        confirmText="종료"
        cancelText="취소"
        onConfirm={handleStopConfirm}
        onCancel={() => setShowStopConfirmation(false)}
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
