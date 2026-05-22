/**
 * StudyCanvas Component (REFACTOR Phase)
 * Feature: turtle-study-app
 * Task: 12.5 Refactor background components (REFACTOR)
 * 
 * Composes BackgroundImage, PathComponent, TurtleCharacter, DecorativeElements.
 * Handles non-interactive area touches (completely ignore, no error message).
 * Applies consistent color palette across all child components.
 * 
 * Refactored to use centralized constants, remove unused props, and improve code organization.
 * 
 * Requirements: 5.2, 5.3, 6.1, 6.2, 6.5, 6.7, 8.1
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import BackgroundImage from './BackgroundImage';
import PathComponent from './PathComponent';
import TurtleCharacter from './TurtleCharacter';
import DecorativeElements from './DecorativeElements';
import { DEFAULT_PATH_COORDINATES, COLORS } from '../constants/theme';

interface StudyCanvasProps {
  progress: number; // 0-100
  turtleState: 'walking' | 'eating' | 'happy' | 'sleeping' | 'arrived';
  carrotCount?: number; // 0-3 (optional, for future use)
  waterCount?: number; // 0-3 (optional, for future use)
  onPress?: () => void; // Not used - non-interactive areas are ignored
}

/**
 * StudyCanvas is the main canvas component that composes all visual elements
 * for the study session screen. It renders the watercolor background, path,
 * turtle character, and decorative elements in proper layering order.
 * 
 * Non-interactive area touches are completely ignored (no error message, no visual response).
 * The onPress prop is intentionally not used - non-interactive areas do not respond to touches.
 * 
 * Note: carrotCount and waterCount props are accepted for API compatibility but not currently
 * used by this component. They may be used in future enhancements.
 */
const StudyCanvas: React.FC<StudyCanvasProps> = ({
  progress,
  turtleState,
  // carrotCount and waterCount are intentionally unused in current implementation
  // but kept in props for API compatibility
}) => {
  return (
    <View
      testID="study-canvas"
      style={styles.container}
      accessible={true}
      accessibilityLabel="study canvas"
      accessibilityRole="none"
    >
      {/* Layer 1: Watercolor background (bottom layer) */}
      <BackgroundImage />

      {/* Layer 2: Decorative elements (plants, stones, etc.) */}
      <DecorativeElements />

      {/* Layer 3: Path from START to GOAL */}
      <PathComponent pathCoordinates={DEFAULT_PATH_COORDINATES} />

      {/* Layer 4: Turtle character (top layer) */}
      <TurtleCharacter
        progress={progress}
        state={turtleState}
        pathCoordinates={DEFAULT_PATH_COORDINATES}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.beige, // Fallback color
  },
});

export default StudyCanvas;
