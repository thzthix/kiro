/**
 * CareItemsPanel Component (GREEN - Task 14.3)
 * Feature: turtle-study-app
 * 
 * Displays "돌봐주기" title with carrot and water buttons for immediate care item placement.
 * Features:
 * - Title text "돌봐주기" above button icons
 * - Carrot and water buttons horizontally aligned with count display
 * - Tap triggers onItemTap callback
 * - Visual feedback within 100ms (Requirement 11.1)
 * - Care item visual feedback 300-1000ms (Requirement 11.2)
 * - Debouncing (1 second cooldown, independent per button)
 * - Disabled during eating/happy states
 * - Disabled when count reaches 0
 * - Shake animation on depleted button tap
 * - Optimized animations using useNativeDriver: true
 * 
 * Validates: Requirements 5.1-5.8, 5.13, 5.14, 5.15, 5.16, 9.7, 9.8
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Image,
  Platform,
  ViewStyle,
} from 'react-native';
import carePanelIcons from '../../assets/care-panel-icons.png';

// Constants
const DEBOUNCE_DURATION_MS = 1000;
const SHAKE_ANIMATION_DURATION_MS = 200;
const SHAKE_DISTANCE = 10;
const SHOULD_USE_NATIVE_DRIVER = Platform.OS !== 'web';
const PANEL_BASE_RATIO = 2110 / 745;
const ICON_VIEWPORT_WIDTH = 138;
const ICON_VIEWPORT_HEIGHT = 118;

type ItemType = 'carrot' | 'water';
type TurtleState = 'walking' | 'eating' | 'happy' | 'sleeping' | 'arrived';

interface CareItemsPanelProps {
  onItemTap: (itemType: ItemType) => void;
  disabled: boolean;
  carrotCount: number;
  waterCount: number;
  turtleState: TurtleState;
  style?: ViewStyle;
}

/**
 * Custom hook for managing debounced button taps
 */
const useDebounce = () => {
  const debounceRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const executeDebouncedAction = useCallback((action: () => void) => {
    if (debounceRef.current) {
      return false;
    }

    debounceRef.current = true;
    action();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      debounceRef.current = false;
      timeoutRef.current = null;
    }, DEBOUNCE_DURATION_MS);

    return true;
  }, []);

  return { executeDebouncedAction };
};

/**
 * Custom hook for managing shake animation
 */
const useShakeAnimation = () => {
  const [isShaking, setIsShaking] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const playShakeAnimation = useCallback(() => {
    setIsShaking(true);
    shakeAnim.setValue(0);

    if (Animated.sequence) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: SHAKE_DISTANCE,
          duration: 50,
          useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
        }),
        Animated.timing(shakeAnim, {
          toValue: -SHAKE_DISTANCE,
          duration: 50,
          useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
        }),
        Animated.timing(shakeAnim, {
          toValue: SHAKE_DISTANCE,
          duration: 50,
          useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
        }),
      ]).start(() => {
        setIsShaking(false);
      });
    } else {
      // Fallback for test environment
      setTimeout(() => {
        setIsShaking(false);
      }, SHAKE_ANIMATION_DURATION_MS);
    }
  }, [shakeAnim]);

  return { isShaking, shakeAnim, playShakeAnimation };
};

/**
 * Custom hook for managing touch feedback animation (< 100ms visual feedback)
 */
const useTouchFeedback = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const animateTouchFeedback = useCallback(() => {
    // Reset animations
    scaleAnim.setValue(1);
    opacityAnim.setValue(1);

    // Animate scale down and opacity within 100ms for immediate feedback
    // Then animate back over 300-1000ms range (using 400ms)
    if (Animated.parallel && Animated.sequence) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 100, // Visual feedback within 100ms
            useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400, // Return to normal within 300-1000ms range
            useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 100, // Visual feedback within 100ms
            useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 400, // Return to normal within 300-1000ms range
            useNativeDriver: SHOULD_USE_NATIVE_DRIVER,
          }),
        ]),
      ]).start();
    } else {
      // Fallback for test environment - just set values directly
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0.7);
      setTimeout(() => {
        scaleAnim.setValue(1);
        opacityAnim.setValue(1);
      }, 500);
    }
  }, [scaleAnim, opacityAnim]);

  return { scaleAnim, opacityAnim, animateTouchFeedback };
};

/**
 * Reusable CareItemButton component
 */
interface CareItemButtonProps {
  itemType: ItemType;
  count: number;
  isDisabled: boolean;
  onPress: () => void;
  isShaking: boolean;
  shakeAnim: Animated.Value;
  onTouchFeedback: () => void;
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
  slotStyle: ViewStyle;
}

const CareItemButton: React.FC<CareItemButtonProps> = ({
  itemType,
  count,
  isDisabled,
  onPress,
  isShaking,
  shakeAnim,
  onTouchFeedback,
  scaleAnim,
  opacityAnim,
  slotStyle,
}) => {
  const handlePressIn = () => {
    if (!isDisabled || count === 0) {
      onTouchFeedback();
    }
  };

  const handlePress = () => {
    // Always call onPress, let the parent handle the logic
    // The parent will trigger shake animation if count is 0
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.itemHitArea,
        slotStyle,
        { transform: [{ translateX: shakeAnim }] },
      ]}
    >
      <Animated.View
        style={[
          styles.buttonWrap,
          {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          },
        ]}
      >
        <Pressable
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          accessible={true}
          accessibilityLabel={`${itemType} button, ${count} remaining`}
          accessibilityState={{ disabled: isDisabled }}
          testID={`${itemType}-button`}
        >
          <View style={styles.buttonOverlay}>
            <View style={styles.iconViewport}>
              <Image
                testID={`${itemType}-icon-sheet`}
                source={
                  Platform.OS === 'web'
                    ? carePanelIcons
                    : require('../../assets/care-panel-icons.png')
                }
                style={[
                  styles.iconSheet,
                  {
                    left: itemType === 'water' ? 0 : -ICON_VIEWPORT_WIDTH,
                    top: 0,
                  },
                ]}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>
      <View style={styles.countWrap}>
        <Text style={styles.countX}>x</Text>
        <Text style={styles.countText} testID={`${itemType}-count`}>
          {count}
        </Text>
      </View>
      {isShaking && <View testID={`${itemType}-button-shake`} />}
    </Animated.View>
  );
};

const CareItemsPanel: React.FC<CareItemsPanelProps> = ({
  onItemTap,
  disabled,
  carrotCount,
  waterCount,
  turtleState,
  style,
}) => {
  // Custom hooks for debouncing
  const carrotDebounce = useDebounce();
  const waterDebounce = useDebounce();

  // Custom hooks for shake animations
  const carrotShake = useShakeAnimation();
  const waterShake = useShakeAnimation();

  // Custom hooks for touch feedback animations
  const carrotFeedback = useTouchFeedback();
  const waterFeedback = useTouchFeedback();

  // Determine if buttons should be disabled based on turtle state
  const isButtonsDisabledByState = turtleState === 'eating' || turtleState === 'happy';

  // Calculate disabled state for each button
  const isCarrotDisabled = disabled || carrotCount === 0 || isButtonsDisabledByState;
  const isWaterDisabled = disabled || waterCount === 0 || isButtonsDisabledByState;

  // Handle button tap with debouncing and shake animation
  const handleItemTap = useCallback(
    (
      itemType: ItemType,
      count: number,
      isDisabled: boolean,
      shake: ReturnType<typeof useShakeAnimation>,
      debounce: ReturnType<typeof useDebounce>,
      feedback: ReturnType<typeof useTouchFeedback>
    ) => {
      // If count is 0, play shake animation
      if (count === 0) {
        shake.playShakeAnimation();
        return;
      }

      // If disabled for other reasons, do nothing
      if (isDisabled) {
        return;
      }

      // Trigger visual feedback animation (< 100ms)
      feedback.animateTouchFeedback();

      // Execute debounced action
      debounce.executeDebouncedAction(() => {
        onItemTap(itemType);
      });
    },
    [onItemTap]
  );

  const handleCarrotTap = useCallback(() => {
    handleItemTap('carrot', carrotCount, isCarrotDisabled, carrotShake, carrotDebounce, carrotFeedback);
  }, [carrotCount, isCarrotDisabled, carrotShake, carrotDebounce, carrotFeedback, handleItemTap]);

  const handleWaterTap = useCallback(() => {
    handleItemTap('water', waterCount, isWaterDisabled, waterShake, waterDebounce, waterFeedback);
  }, [waterCount, isWaterDisabled, waterShake, waterDebounce, waterFeedback, handleItemTap]);

  return (
    <View 
      style={[styles.container, style]}
      testID="care-items-panel-container"
      // @ts-ignore - Adding disabled prop for testing
      disabled={disabled || isButtonsDisabledByState}
      carrotCount={carrotCount}
      waterCount={waterCount}
    >
      <View style={styles.panelBase} testID="care-panel-base">
        <View style={styles.panelInnerBorder} />
        <Text style={styles.titleText} testID="care-items-title">
          돌봐주기
        </Text>
        <View style={[styles.slotCircle, styles.waterCircle]} />
        <View style={[styles.slotCircle, styles.carrotCircle]} />
      </View>

      <View style={styles.buttonsContainer} testID="care-items-buttons-container">
        <CareItemButton
          itemType="water"
          count={waterCount}
          isDisabled={isWaterDisabled}
          onPress={handleWaterTap}
          isShaking={waterShake.isShaking}
          shakeAnim={waterShake.shakeAnim}
          onTouchFeedback={waterFeedback.animateTouchFeedback}
          scaleAnim={waterFeedback.scaleAnim}
          opacityAnim={waterFeedback.opacityAnim}
          slotStyle={styles.waterSlot}
        />
        <CareItemButton
          itemType="carrot"
          count={carrotCount}
          isDisabled={isCarrotDisabled}
          onPress={handleCarrotTap}
          isShaking={carrotShake.isShaking}
          shakeAnim={carrotShake.shakeAnim}
          onTouchFeedback={carrotFeedback.animateTouchFeedback}
          scaleAnim={carrotFeedback.scaleAnim}
          opacityAnim={carrotFeedback.opacityAnim}
          slotStyle={styles.carrotSlot}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 860,
    aspectRatio: PANEL_BASE_RATIO,
    position: 'relative',
  },
  panelBase: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: 'rgba(227, 205, 164, 0.95)',
    shadowColor: '#D8C18A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
    overflow: 'hidden',
  },
  panelInnerBorder: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 251, 240, 0.85)',
  },
  titleText: {
    position: 'absolute',
    left: '5.7%',
    top: '29.5%',
    fontFamily: 'Nanum Gothic, Arial, sans-serif',
    fontSize: 44,
    fontWeight: '700',
    color: '#6F4A2D',
    letterSpacing: -1.1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  slotCircle: {
    position: 'absolute',
    width: '16.9%',
    aspectRatio: 1,
    top: '11.8%',
    borderRadius: 999,
    backgroundColor: '#FFF6D6',
    borderWidth: 1,
    borderColor: 'rgba(236, 215, 166, 0.95)',
  },
  waterCircle: {
    left: '47.9%',
  },
  carrotCircle: {
    left: '78%',
  },
  buttonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  button: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  itemHitArea: {
    position: 'absolute',
    top: '16.2%',
    width: '21.2%',
    height: '54%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  waterSlot: {
    left: '35.7%',
  },
  carrotSlot: {
    left: '63.5%',
  },
  buttonOverlay: {
    flex: 1,
    borderRadius: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrap: {
    width: '71%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconViewport: {
    width: ICON_VIEWPORT_WIDTH,
    height: ICON_VIEWPORT_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  iconSheet: {
    position: 'absolute',
    width: ICON_VIEWPORT_WIDTH * 2,
    height: ICON_VIEWPORT_HEIGHT,
  },
  countWrap: {
    marginLeft: 6,
    marginTop: -1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
  },
  countX: {
    fontFamily: 'Nanum Gothic, Arial, sans-serif',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 38,
    color: '#7B6344',
    marginRight: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  countText: {
    fontFamily: 'Nanum Gothic, Arial, sans-serif',
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.3,
    color: '#7B6344',
    textShadowColor: 'rgba(255, 255, 255, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export { CareItemsPanel };
export default CareItemsPanel;
