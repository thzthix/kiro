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
import carePanelBase from '../../assets/돌봐주기_베이스만.jpeg';
import carePanelIcons from '../../assets/돌봐주기_아이콘만.jpeg';
import timePanelNumber from '../../assets/images/time_pannel_number.jpeg';

// Constants
const DEBOUNCE_DURATION_MS = 1000;
const SHAKE_ANIMATION_DURATION_MS = 200;
const SHAKE_DISTANCE = 10;
const SHOULD_USE_NATIVE_DRIVER = Platform.OS !== 'web';
const PANEL_BASE_RATIO = 2110 / 745;
const PANEL_ICON_SHEET_WIDTH = 1919;
const PANEL_ICON_SHEET_HEIGHT = 820;
const PANEL_ICON_HALF_WIDTH = PANEL_ICON_SHEET_WIDTH / 2;
const PANEL_COUNT_SHEET_COLUMNS = 5;
const PANEL_COUNT_SHEET_ROWS = 2;
const PANEL_COUNT_SHEET_WIDTH = 1774;
const PANEL_COUNT_SHEET_HEIGHT = 887;
const PANEL_COUNT_DIGIT_WIDTH = PANEL_COUNT_SHEET_WIDTH / PANEL_COUNT_SHEET_COLUMNS;
const PANEL_COUNT_DIGIT_HEIGHT = PANEL_COUNT_SHEET_HEIGHT / PANEL_COUNT_SHEET_ROWS;

type ItemType = 'carrot' | 'water';
type TurtleState = 'walking' | 'eating' | 'happy' | 'sleeping' | 'arrived';
const ITEM_ORDER: ItemType[] = ['water', 'carrot'];
const DIGIT_INDEX: Record<string, number> = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
};

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
}

const CountDigit: React.FC<{ digit: string }> = ({ digit }) => {
  const index = DIGIT_INDEX[digit] ?? 0;
  const column = index % PANEL_COUNT_SHEET_COLUMNS;
  const row = Math.floor(index / PANEL_COUNT_SHEET_COLUMNS);

  return (
    <View style={styles.countDigitViewport}>
      <Image
        source={
          Platform.OS === 'web'
            ? timePanelNumber
            : require('../../assets/images/time_pannel_number.jpeg')
        }
        style={[
          styles.countDigitSheet,
          {
            left: -column * styles.countDigitViewport.width,
            top: -row * styles.countDigitViewport.height,
          },
        ]}
      />
    </View>
  );
};

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
        { transform: [{ translateX: shakeAnim }] },
      ]}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
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
                source={
                  Platform.OS === 'web'
                    ? carePanelIcons
                    : require('../../assets/돌봐주기_아이콘만.jpeg')
                }
                style={[
                  styles.iconSheet,
                  {
                    left: itemType === 'water' ? 0 : -styles.iconViewport.width,
                    top: 0,
                  },
                ]}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>
      <View style={styles.countWrap}>
        <Text style={styles.countX}>×</Text>
        <CountDigit digit={String(Math.max(0, Math.min(9, count)))} />
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
      <Image
        source={
          Platform.OS === 'web'
            ? carePanelBase
            : require('../../assets/돌봐주기_베이스만.jpeg')
        }
        style={styles.panelBase}
        resizeMode="contain"
      />

      <Text style={styles.hiddenTitle} testID="care-items-title">
        돌봐주기
      </Text>

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
  },
  hiddenTitle: {
    position: 'absolute',
    opacity: 0,
  },
  buttonsContainer: {
    position: 'absolute',
    left: '32%',
    right: '5.5%',
    top: '10%',
    bottom: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  itemHitArea: {
    width: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOverlay: {
    flex: 1,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconViewport: {
    width: 126,
    height: 104,
    overflow: 'hidden',
    position: 'relative',
  },
  iconSheet: {
    position: 'absolute',
    width: (PANEL_ICON_SHEET_WIDTH / PANEL_ICON_HALF_WIDTH) * 126,
    height: (PANEL_ICON_SHEET_HEIGHT / 104) * 104,
  },
  countWrap: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countX: {
    fontSize: 38,
    fontWeight: '700',
    color: '#8B6B46',
    marginRight: 2,
  },
  countDigitViewport: {
    width: 30,
    height: 42,
    overflow: 'hidden',
    position: 'relative',
  },
  countDigitSheet: {
    position: 'absolute',
    width:
      PANEL_COUNT_DIGIT_WIDTH > 0
        ? (PANEL_COUNT_SHEET_WIDTH / PANEL_COUNT_DIGIT_WIDTH) * 30
        : 30,
    height:
      PANEL_COUNT_DIGIT_HEIGHT > 0
        ? (PANEL_COUNT_SHEET_HEIGHT / PANEL_COUNT_DIGIT_HEIGHT) * 42
        : 42,
  },
});

export { CareItemsPanel };
export default CareItemsPanel;
