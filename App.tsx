/**
 * App Root Component
 * Feature: turtle-study-app
 * Task: 17.2 Wire App root with navigation and context (GREEN)
 * Refactored: Task 17.6 Refactor integration code (REFACTOR)
 * 
 * Root component that wraps application with AppProvider context
 * and implements screen navigation logic (home → session → completion).
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
   */
  const handleStartSession = useCallback((durationMinutes: number) => {
    const durationSeconds = durationMinutes * 60;
    startSession(durationSeconds);
  }, [startSession]);

  /**
   * Handle navigation to home screen
   */
  const handleNavigateToHome = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_HOME' });
  }, [dispatch]);

  /**
   * Render appropriate screen based on app state
   */
  const renderScreen = () => {
    switch (state.screen) {
      case 'session':
        return <StudySessionScreen />;
      
      case 'complete':
        return (
          <CompletionScreen
            totalDuration={state.session?.totalDuration || 0}
            onStartNew={handleNavigateToHome}
            onClose={handleNavigateToHome}
          />
        );
      
      case 'home':
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
