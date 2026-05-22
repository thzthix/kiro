/**
 * App Root Component
 * Feature: turtle-study-app
 * Task: 17.2 Wire App root with navigation and context (GREEN)
 * 
 * Root component that:
 * - Wraps application with AppProvider context
 * - Implements screen navigation logic (home → session → completion)
 * - Connects all screens with context
 * - Ensures integration tests pass
 * 
 * Navigation flow:
 * - home: HomeScreen with TimeInputPopup
 * - session: StudySessionScreen with timer and turtle
 * - complete: CompletionScreen with session summary
 */

import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { StudySessionScreen } from './src/screens/StudySessionScreen';
import { CompletionScreen } from './src/screens/CompletionScreen';
import { useStudySession } from './src/hooks/useStudySession';
import { COLORS } from './src/constants/theme';

/**
 * AppContent - Internal component that uses context
 * Handles screen navigation based on app state
 */
const AppContent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { startSession, stopSession } = useStudySession();

  /**
   * Handle session start from HomeScreen
   * Transitions to session screen and starts timer
   * Note: startSession already dispatches START_SESSION which sets screen to 'session'
   */
  const handleStartSession = useCallback((durationMinutes: number) => {
    const durationSeconds = durationMinutes * 60;
    startSession(durationSeconds);
  }, [startSession]);

  /**
   * Handle start new session from CompletionScreen
   * Returns to home screen to show TimeInputPopup
   */
  const handleStartNew = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_HOME' });
  }, [dispatch]);

  /**
   * Handle close from CompletionScreen
   * Returns to home screen
   */
  const handleClose = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_HOME' });
  }, [dispatch]);

  /**
   * Handle stop session from StudySessionScreen
   * Returns to home screen
   * Note: stopSession already dispatches STOP_SESSION which sets screen to 'home'
   */
  const handleStopSession = useCallback(() => {
    stopSession();
  }, [stopSession]);

  /**
   * Render appropriate screen based on app state
   */
  const renderScreen = () => {
    switch (state.screen) {
      case 'home':
        return <HomeScreen onStartSession={handleStartSession} />;
      
      case 'session':
        return <StudySessionScreen />;
      
      case 'complete':
        return (
          <CompletionScreen
            totalDuration={state.session?.totalDuration || 0}
            onStartNew={handleStartNew}
            onClose={handleClose}
          />
        );
      
      default:
        return <HomeScreen onStartSession={handleStartSession} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
    </SafeAreaView>
  );
};

/**
 * App - Root component with provider
 * Wraps AppContent with AppProvider for context access
 */
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
});

export default App;
