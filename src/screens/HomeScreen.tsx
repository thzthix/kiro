/**
 * HomeScreen Component (GREEN Phase)
 * Feature: turtle-study-app
 * Task: 13.2 Create HomeScreen (GREEN)
 * 
 * Displays the home screen with app title, subtitle, turtle illustration,
 * watercolor background, and automatically opens TimeInputPopup.
 * 
 * Requirements: 1.1, 6.1, 6.2, 6.5
 */

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import TimeInputPopup from '../components/TimeInputPopup';
import BackgroundImage from '../components/BackgroundImage';
import DecorativeElements from '../components/DecorativeElements';
import { COLORS } from '../constants/theme';

interface HomeScreenProps {
  onStartSession?: (duration: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession }) => {
  const [showPopup, setShowPopup] = useState(true);
  const [backgroundError, setBackgroundError] = useState(false);

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

  const handleBackgroundError = (): void => {
    setBackgroundError(true);
  };

  return (
    <View testID="home-screen" style={styles.container}>
      {/* Watercolor background with landscape elements */}
      <View 
        testID="home-background" 
        style={
          backgroundError 
            ? { ...styles.backgroundContainer, ...styles.backgroundFallback }
            : styles.backgroundContainer
        }
        {...({ onError: handleBackgroundError } as any)}
      >
        <BackgroundImage />
      </View>

      {/* Decorative elements */}
      <DecorativeElements />

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>🐢 Turtle Study</Text>
        <Text style={styles.subtitle}>Focus together, one step at a time.</Text>
        
        {/* Turtle illustration */}
        <Image
          testID="home-turtle-illustration"
          source={require('../../assets/images/turtle/turtle_happy.jpeg')}
          style={styles.turtleIllustration}
          resizeMode="contain"
        />
      </View>

      {/* TimeInputPopup automatically displayed on mount */}
      <TimeInputPopup
        visible={showPopup}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  turtleIllustration: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  backgroundFallback: {
    backgroundColor: COLORS.beige,
  },
});
