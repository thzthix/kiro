import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet, Platform } from 'react-native';
import { PathCoordinates, TurtleState } from '../types';
import { calculatePosition } from '../utils/ProgressCalculator';
import { handleAnimationError, handleImageLoadError } from '../utils/ErrorHandler';
import { CANVAS_REFERENCE } from '../constants/theme';

// Import images for web compatibility
import turtleWalking from '../../assets/images/turtle/turtle_walking.png';
import turtleEating from '../../assets/images/turtle/turtle_eating.png';
import turtleHappy from '../../assets/images/turtle/turtle_happy.png';
import turtleSleeping from '../../assets/images/turtle/turtle_sleeping.png';
import turtleArrived from '../../assets/images/turtle/turtle_arrived.png';
import turtleWalkingSheetDisplay from '../../assets/images/turtle_walking_sheet_display.png';

interface TurtleCharacterProps {
  progress: number; // 0-100
  state: TurtleState;
  pathCoordinates: PathCoordinates;
  canvasSize?: {
    width: number;
    height: number;
  };
}

// Animation constants
const ANIMATION_DURATION = 250; // 250ms is within 200-300ms range for battery efficiency
const WALK_CYCLE_INTERVAL_MS = 140;
const WALK_BOB_OFFSET = 4;
const TURTLE_SIZE = 116;
const SHOULD_USE_NATIVE_DRIVER = Platform.OS !== 'web';
const WALKING_SPRITE_COLUMNS = 6;
const WALKING_SPRITE_ROWS = 4;
const WALKING_FRAME_COUNT = WALKING_SPRITE_COLUMNS * WALKING_SPRITE_ROWS;
const WALKING_FRAME_WIDTH = TURTLE_SIZE;
const WALKING_FRAME_HEIGHT = TURTLE_SIZE;
const WALKING_FRAME_GAP_X = 16;
const WALKING_FRAME_GAP_Y = 16;
const WALKING_VIEWPORT_HEIGHT = TURTLE_SIZE;
const WALKING_FRAME_STEP_X = WALKING_FRAME_WIDTH + WALKING_FRAME_GAP_X;
const WALKING_FRAME_STEP_Y = WALKING_FRAME_HEIGHT + WALKING_FRAME_GAP_Y;

// Sprite mapping for each turtle state
const TURTLE_SPRITES: Record<TurtleState, any> = Platform.OS === 'web' ? {
  walking: turtleWalking,
  eating: turtleEating,
  happy: turtleHappy,
  sleeping: turtleSleeping,
  arrived: turtleArrived,
} : {
  walking: require('../../assets/images/turtle/turtle_walking.png'),
  eating: require('../../assets/images/turtle/turtle_eating.png'),
  happy: require('../../assets/images/turtle/turtle_happy.png'),
  sleeping: require('../../assets/images/turtle/turtle_sleeping.png'),
  arrived: require('../../assets/images/turtle/turtle_arrived.png'),
};

// Heart SVG for happy state effect
const HEART_SVG_URI =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

const TurtleCharacter: React.FC<TurtleCharacterProps> = ({
  progress,
  state,
  pathCoordinates,
  canvasSize,
}) => {
  // Animated values for smooth position transitions
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const walkBob = useRef(new Animated.Value(0)).current;
  const [frameIndex, setFrameIndex] = useState(0);

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

  const scaleX =
    canvasSize && canvasSize.width > 0
      ? canvasSize.width / CANVAS_REFERENCE.width
      : 1;
  const scaleY =
    canvasSize && canvasSize.height > 0
      ? canvasSize.height / CANVAS_REFERENCE.height
      : 1;

  // Update turtle position based on progress along the path
  useEffect(() => {
    try {
      const position = calculatePosition(validProgress, validPathCoordinates);
      const scaledPosition = {
        x: position.x * scaleX,
        y: position.y * scaleY,
      };

      // Animate position smoothly for fluid movement
      Animated.parallel([
        Animated.timing(animatedX, {
          toValue: scaledPosition.x,
          duration: ANIMATION_DURATION,
          useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
        }),
        Animated.timing(animatedY, {
          toValue: scaledPosition.y,
          duration: ANIMATION_DURATION,
          useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
        }),
      ]).start();
    } catch (error) {
      // Fallback: set position directly without animation
      handleAnimationError(
        error,
        () => {
          const position = calculatePosition(validProgress, validPathCoordinates);
          animatedX.setValue(position.x * scaleX);
          animatedY.setValue(position.y * scaleY);
        },
        {
          component: 'TurtleCharacter',
          operation: 'position-update',
          metadata: { progress: validProgress },
        }
      );
    }
  }, [validProgress, validPathCoordinates, animatedX, animatedY, scaleX, scaleY]);

  useEffect(() => {
    if (validState !== 'walking') {
      if ('stopAnimation' in walkBob && typeof walkBob.stopAnimation === 'function') {
        walkBob.stopAnimation();
      }
      walkBob.setValue(0);
      return;
    }

    if (!Animated.sequence || !Animated.loop) {
      walkBob.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(walkBob, {
          toValue: -WALK_BOB_OFFSET,
          duration: WALK_CYCLE_INTERVAL_MS,
          useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
        }),
        Animated.timing(walkBob, {
          toValue: 0,
          duration: WALK_CYCLE_INTERVAL_MS,
          useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
        }),
      ])
    );

    animation.start();

    return () => {
      if ('stop' in animation && typeof animation.stop === 'function') {
        animation.stop();
      }
      walkBob.setValue(0);
    };
  }, [validState, walkBob]);

  useEffect(() => {
    if (validState !== 'walking') {
      setFrameIndex(0);
      return;
    }

    const intervalId = setInterval(() => {
      setFrameIndex((currentFrame) => (currentFrame + 1) % WALKING_FRAME_COUNT);
    }, WALK_CYCLE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [validState]);

  const frameColumn = frameIndex % WALKING_SPRITE_COLUMNS;
  const frameRow = Math.floor(frameIndex / WALKING_SPRITE_COLUMNS);

  return (
    <Animated.View
      testID={`turtle-character-${validState}`}
      style={[
        styles.container,
        {
          transform: [
            { translateX: animatedX },
            { translateY: animatedY },
            { translateY: walkBob },
          ],
        },
      ]}
    >
      {validState === 'walking' ? (
        <View style={styles.spriteViewport}>
          <Image
            testID="turtle-image"
            source={
              Platform.OS === 'web'
                ? turtleWalkingSheetDisplay
                : require('../../assets/images/turtle_walking_sheet_display.png')
            }
            style={[
              styles.walkingSpriteSheet,
              {
                left: -frameColumn * WALKING_FRAME_STEP_X,
                top: -frameRow * WALKING_FRAME_STEP_Y,
              },
            ]}
            onError={(error) => {
              handleImageLoadError(error, 'turtle-walking-sheet-display', {
                component: 'TurtleCharacter',
                metadata: { frameIndex, state: validState },
              });
            }}
          />
        </View>
      ) : (
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
      )}

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
    width: TURTLE_SIZE,
    height: TURTLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -TURTLE_SIZE / 2,
    marginTop: -TURTLE_SIZE / 2,
  },
  turtleImage: {
    width: TURTLE_SIZE,
    height: TURTLE_SIZE,
  },
  spriteViewport: {
    width: TURTLE_SIZE,
    height: WALKING_VIEWPORT_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  walkingSpriteSheet: {
    position: 'absolute',
    width:
      WALKING_SPRITE_COLUMNS * TURTLE_SIZE +
      (WALKING_SPRITE_COLUMNS - 1) * WALKING_FRAME_GAP_X,
    height:
      WALKING_SPRITE_ROWS * WALKING_VIEWPORT_HEIGHT +
      (WALKING_SPRITE_ROWS - 1) * WALKING_FRAME_GAP_Y,
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
