/**
 * DecorativeElements Component (REFACTOR Phase)
 * Feature: turtle-study-app
 * Task: 12.5 Refactor background components (REFACTOR)
 * 
 * Renders decorative elements (wooden signs, plants, stones, bushes, trees, flags)
 * positioned across the canvas to enhance the visual atmosphere.
 * 
 * Refactored to use centralized constants and improved code organization.
 * 
 * Requirements: 6.1, 6.2, 6.4
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  DECORATIVE_ELEMENTS,
  DECORATIVE_ELEMENT_BASE_SIZE,
  DecorativeElementConfig,
} from '../constants/decorativeElements';

/**
 * Calculate element style based on configuration
 */
const getElementStyle = (element: DecorativeElementConfig): ViewStyle => ({
  left: element.x,
  top: element.y,
  width: DECORATIVE_ELEMENT_BASE_SIZE * element.scale,
  height: DECORATIVE_ELEMENT_BASE_SIZE * element.scale,
  backgroundColor: element.color,
});

/**
 * DecorativeElements renders decorative visual elements across the canvas.
 * Elements are non-interactive (pointerEvents='none') and not accessible to screen readers.
 */
const DecorativeElements: React.FC = () => {
  return (
    <View
      testID="decorative-elements"
      style={styles.container}
      pointerEvents="none"
    >
      {DECORATIVE_ELEMENTS.map((element, index) => (
        <View
          key={`${element.type}-${index}`}
          testID={`decorative-element-${element.type}-${index}`}
          style={[styles.element, getElementStyle(element)]}
          accessible={false}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  element: {
    position: 'absolute',
    borderRadius: 4,
  },
});

export default DecorativeElements;
