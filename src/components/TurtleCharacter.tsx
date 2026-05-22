import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import { PathCoordinates, TurtleState } from '../types';
import { calculatePosition } from '../utils/ProgressCalculator';
import { handleAnimationError, handleImageLoadError } from '../utils/ErrorHandler';

interface TurtleCharacterProps {
  progress: number; // 0-100
  state: TurtleState;
  pathCoordinates: PathCoordinates;
}

// Animation constants
const ANIMATION_DURATION = 250; // 250ms is within 200-300ms range for battery efficiency

// Sprite mapping for each turtle state
const TURTLE_SPRITES: Record<TurtleState, any> = {
  walking: require('../../assets/images/turtle/turtle_walking.jpeg'),
  eating: require('../../assets/images/turtle/turtle_eating.jpeg'),
  happy: require('../../assets/images/turtle/turtle_happy.jpeg'),
  sleeping: require('../../assets/images/turtle/turtle_sleeping.jpeg'),
  arrived: require('../../assets/images/turtle/turtle_arrived.png'),
};

// Heart SVG for happy state effect
const HEART_SVG_URI =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

const TurtleCharacter: React.FC<TurtleCharacterProps> = ({
  progress,
  state,
  pathCoordinates,
}) => {
  // Animated values for smooth position transitions
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;

  // Validate and clamp progress to 0-100 range
  const validProgress = Math.max(0, Math.min(100, progress || 0));

  // Validate state - fallback to 'walking' if invalid
  const validState = TURTLE_SPRITES[state] ? state : 'walking';

  // Validate pathCoordinates - use default if missing
  const validPathCoordinates = pathCoordinates || {
    start: { x: 50, y: 300 },
    goal: { x: 350, y: 300 },
    waypoints: [],
  };

  // Update turtle position based on progress along the path
  useEffect(() => {
    try {
      const position = calculatePosition(validProgress, validPathCoordinates);

      // Animate position smoothly for fluid movement
      Animated.parallel([
        Animated.timing(animatedX, {
          toValue: position.x,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(animatedY, {
          toValue: position.y,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      // Fallback: set position directly without animation
      handleAnimationError(
        error,
        () => {
          const position = calculatePosition(validProgress, validPathCoordinates);
          animatedX.setValue(position.x);
          animatedY.setValue(position.y);
        },
        {
          component: 'TurtleCharacter',
          operation: 'position-update',
          metadata: { progress: validProgress },
        }
      );
    }
  }, [validProgress, validPathCoordinates, animatedX, animatedY]);

  return (
    <Animated.View
      testID={`turtle-character-${validState}`}
      style={[
        styles.container,
        {
          transform: [{ translateX: animatedX }, { translateY: animatedY }],
        },
      ]}
    >
      {/* Turtle sprite - always faces rightward toward GOAL */}
      <Image
        testID="turtle-image"
        source={TURTLE_SPRITES[validState]}
        style={styles.turtleImage}
        resizeMode="contain"
        onError={(error) => {
          handleImageLoadError(error, `turtle-sprite-${validState}`, {
            component: 'TurtleCharacter',
            metadata: { state: validState },
          });
        }}
      />

      {/* Heart effect displayed above turtle during happy state */}
      {validState === 'happy' && (
        <View testID="heart-effect" style={styles.heartEffect}>
          <Image
            source={{ uri: HEART_SVG_URI }}
            style={styles.heartIcon}
            onError={(error) => {
              handleImageLoadError(error, 'heart-icon', {
                component: 'TurtleCharacter',
                operation: 'heart-effect',
              });
            }}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turtleImage: {
    width: 60,
    height: 60,
  },
  heartEffect: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    width: 24,
    height: 24,
  },
});

export default TurtleCharacter;
