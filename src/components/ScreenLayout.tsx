/**
 * ScreenLayout Component
 * Feature: turtle-study-app
 * Task: 13.5 Refactor screens (REFACTOR)
 * 
 * Common layout wrapper for screens with watercolor background
 * and decorative elements. Reduces duplication across HomeScreen,
 * CompletionScreen, and other screens.
 * 
 * Provides:
 * - Watercolor background layer
 * - Optional decorative elements
 * - Centered content container
 * - Consistent beige background color
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import BackgroundImage from './BackgroundImage';
import DecorativeElements from './DecorativeElements';
import { COLORS } from '../constants/theme';

interface ScreenLayoutProps {
  children: React.ReactNode;
  testID?: string;
  showDecorations?: boolean;
  contentStyle?: ViewStyle;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  testID,
  showDecorations = true,
  contentStyle,
}) => {
  return (
    <View testID={testID} style={styles.container}>
      {/* Watercolor background layer */}
      <View style={styles.backgroundContainer}>
        <BackgroundImage />
      </View>

      {/* Decorative elements (clouds, birds, etc.) */}
      {showDecorations && <DecorativeElements />}

      {/* Main content */}
      <View style={[styles.content, contentStyle]}>
        {children}
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
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default ScreenLayout;
