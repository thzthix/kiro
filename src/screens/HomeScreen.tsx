/**
 * HomeScreen Component (GREEN Phase)
 * Feature: turtle-study-app
 * Task: 13.2 Create HomeScreen (GREEN)
 * Refactored: Task 13.5 Refactor screens (REFACTOR)
 * 
 * Displays the home screen with app title, subtitle, turtle illustration,
 * watercolor background, and automatically opens TimeInputPopup.
 * 
 * Uses ScreenLayout for common background and decorative elements.
 * 
 * Requirements: 1.1, 6.1, 6.2, 6.5
 */

import React, { useState } from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import TimeInputPopup from '../components/TimeInputPopup';
import ScreenLayout from '../components/ScreenLayout';
import { COLORS, LAYOUT } from '../constants/theme';

interface HomeScreenProps {
  onStartSession?: (duration: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession }) => {
  const [showPopup, setShowPopup] = useState(true);

  const handleSubmit = (duration: number): void => {
    if (onStartSession) {
      onStartSession(duration);
    }
    setShowPopup(false);
  };

  const handleCancel = (): void => {
    // Keep popup open when cancel is pressed (as per requirements)
    // User can dismiss by tapping outside or pressing back
  };

  return (
    <ScreenLayout testID="home-screen" contentStyle={styles.centeredContent}>
      <Text style={styles.title}>🐢 Turtle Study</Text>
      <Text style={styles.subtitle}>Focus together, one step at a time.</Text>
      
      {/* Turtle illustration */}
      <Image
        testID="home-turtle-illustration"
        source={require('../../assets/images/turtle/turtle_happy.jpeg')}
        style={styles.turtleIllustration}
        resizeMode="contain"
      />

      {/* TimeInputPopup automatically displayed on mount */}
      <TimeInputPopup
        visible={showPopup}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: LAYOUT.spacing.large,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text.secondary,
    marginBottom: LAYOUT.spacing.extraLarge,
    textAlign: 'center',
  },
  turtleIllustration: {
    width: LAYOUT.image.turtleIllustration,
    height: LAYOUT.image.turtleIllustration,
    marginTop: LAYOUT.spacing.large,
  },
});
