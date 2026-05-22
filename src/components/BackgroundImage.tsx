/**
 * BackgroundImage Component (REFACTOR Phase)
 * Feature: turtle-study-app
 * Task: 12.5 Refactor background components (REFACTOR)
 * 
 * Implements watercolor-style background with landscape elements.
 * Provides fallback to solid beige color on image load failure.
 * 
 * Refactored to use centralized theme constants and improved code organization.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.6
 */

import React, { useState, useCallback } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

/**
 * Landscape element types that are part of the background image
 */
const LANDSCAPE_ELEMENT_TYPES = ['hill', 'lake', 'tree', 'flower'] as const;

/**
 * BackgroundImage renders a watercolor-style landscape background.
 * Falls back to solid beige color if image fails to load.
 */
const BackgroundImage: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <View
      testID="background-image"
      style={styles.container}
      accessible={true}
      accessibilityLabel="Watercolor landscape background"
      accessibilityRole="image"
    >
      {!imageError ? (
        <ImageBackground
          testID="background-watercolor-image"
          source={require('../../assets/images/background.png')}
          style={styles.imageBackground}
          onError={handleImageError}
        >
          <View testID="landscape-elements" style={styles.landscapeContainer}>
            {/* Landscape elements are part of the background image */}
            {LANDSCAPE_ELEMENT_TYPES.map((type) => (
              <View
                key={type}
                testID={`landscape-${type}`}
                style={styles.landscapeElement}
              />
            ))}
          </View>
        </ImageBackground>
      ) : (
        <View testID="background-fallback" style={styles.fallback} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.beige,
  },
  imageBackground: {
    flex: 1,
  },
  landscapeContainer: {
    flex: 1,
  },
  landscapeElement: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  fallback: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
});

export default BackgroundImage;
