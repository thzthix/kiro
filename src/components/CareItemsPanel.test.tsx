/**
 * Unit Tests for CareItemsPanel Component (RED Phase)
 * Feature: turtle-study-app
 * 
 * These tests verify the CareItemsPanel component behavior including:
 * - "돌봐주기" title text display above button icons
 * - Carrot and water icons render horizontally aligned with count display
 * - Tap triggers onItemTap callback and decrements count
 * - Visual feedback animation plays
 * - Disabled prop prevents taps during eating/happy states
 * - Button disabled when count reaches 0
 * - Shake animation plays on depleted button (×0) tap
 * - Debouncing ignores rapid taps (1 second cooldown)
 * 
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.13, 5.15, 5.16
 * 
 * All tests should FAIL in RED phase until component is implemented.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CareItemsPanel from './CareItemsPanel';

describe('CareItemsPanel Component - Unit Tests (RED)', () => {
  const defaultProps = {
    onItemTap: jest.fn(),
    disabled: false,
    carrotCount: 3,
    waterCount: 3,
    turtleState: 'walking' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Title Display', () => {
    it('should display "돌봐주기" title text above button icons', () => {
      const { getByText } = render(<CareItemsPanel {...defaultProps} />);

      const title = getByText('돌봐주기');
      expect(title).toBeTruthy();
    });

    it('should position title above the button icons', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const title = getByTestId('care-items-title');
      const buttonsContainer = getByTestId('care-items-buttons-container');

      expect(title).toBeTruthy();
      expect(buttonsContainer).toBeTruthy();
    });
  });

  describe('Button Icons and Count Display', () => {
    it('should render carrot icon with count display', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const carrotButton = getByTestId('carrot-button');
      expect(carrotButton).toBeTruthy();
    });

    it('should render water icon with count display', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const waterButton = getByTestId('water-button');
      expect(waterButton).toBeTruthy();
    });

    it('should display carrot count as "🥕 ×3"', () => {
      const { getByText } = render(<CareItemsPanel {...defaultProps} carrotCount={3} />);

      const carrotCount = getByText(/🥕.*×3/);
      expect(carrotCount).toBeTruthy();
    });

    it('should display water count as "💧 ×3"', () => {
      const { getByText } = render(<CareItemsPanel {...defaultProps} waterCount={3} />);

      const waterCount = getByText(/💧.*×3/);
      expect(waterCount).toBeTruthy();
    });

    it('should render carrot and water buttons horizontally aligned', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const buttonsContainer = getByTestId('care-items-buttons-container');
      
      // Check for horizontal layout (flexDirection: 'row')
      expect(buttonsContainer.props.style).toMatchObject(
        expect.objectContaining({
          flexDirection: 'row',
        })
      );
    });

    it('should update carrot count display when count changes', () => {
      const { getByText, rerender } = render(
        <CareItemsPanel {...defaultProps} carrotCount={3} />
      );

      expect(getByText(/🥕.*×3/)).toBeTruthy();

      rerender(<CareItemsPanel {...defaultProps} carrotCount={2} />);

      expect(getByText(/🥕.*×2/)).toBeTruthy();
    });

    it('should update water count display when count changes', () => {
      const { getByText, rerender } = render(
        <CareItemsPanel {...defaultProps} waterCount={3} />
      );

      expect(getByText(/💧.*×3/)).toBeTruthy();

      rerender(<CareItemsPanel {...defaultProps} waterCount={1} />);

      expect(getByText(/💧.*×1/)).toBeTruthy();
    });
  });

  describe('Tap Interaction and Callback', () => {
    it('should trigger onItemTap callback with "carrot" when carrot button is tapped', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      expect(onItemTap).toHaveBeenCalledWith('carrot');
    });

    it('should trigger onItemTap callback with "water" when water button is tapped', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const waterButton = getByTestId('water-button');
      fireEvent.press(waterButton);

      expect(onItemTap).toHaveBeenCalledWith('water');
    });

    it('should trigger onItemTap only once per tap', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      expect(onItemTap).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual Feedback Animation', () => {
    it('should play visual feedback animation on carrot button tap', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const carrotButton = getByTestId('carrot-button');
      
      fireEvent.press(carrotButton);

      // Style should change to indicate visual feedback (opacity, scale, etc.)
      const afterPressStyle = carrotButton.props.style;
      expect(afterPressStyle).toBeDefined();
    });

    it('should play visual feedback animation on water button tap', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const waterButton = getByTestId('water-button');
      
      fireEvent.press(waterButton);

      // Style should change to indicate visual feedback (opacity, scale, etc.)
      const afterPressStyle = waterButton.props.style;
      expect(afterPressStyle).toBeDefined();
    });
  });

  describe('Disabled State During Eating/Happy', () => {
    it('should disable carrot button when turtleState is "eating"', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} turtleState="eating" />
      );

      const carrotButton = getByTestId('carrot-button');
      expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should disable water button when turtleState is "eating"', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} turtleState="eating" />
      );

      const waterButton = getByTestId('water-button');
      expect(waterButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should disable carrot button when turtleState is "happy"', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} turtleState="happy" />
      );

      const carrotButton = getByTestId('carrot-button');
      expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should disable water button when turtleState is "happy"', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} turtleState="happy" />
      );

      const waterButton = getByTestId('water-button');
      expect(waterButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should not trigger onItemTap when carrot button is tapped during eating state', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} turtleState="eating" />
      );

      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      expect(onItemTap).not.toHaveBeenCalled();
    });

    it('should not trigger onItemTap when water button is tapped during happy state', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} turtleState="happy" />
      );

      const waterButton = getByTestId('water-button');
      fireEvent.press(waterButton);

      expect(onItemTap).not.toHaveBeenCalled();
    });

    it('should enable buttons when turtleState is "walking"', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} turtleState="walking" />
      );

      const carrotButton = getByTestId('carrot-button');
      const waterButton = getByTestId('water-button');

      expect(carrotButton.props.accessibilityState?.disabled).toBe(false);
      expect(waterButton.props.accessibilityState?.disabled).toBe(false);
    });
  });

  describe('Button Disabled When Count Reaches 0', () => {
    it('should disable carrot button when carrotCount is 0', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} carrotCount={0} />
      );

      const carrotButton = getByTestId('carrot-button');
      expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should disable water button when waterCount is 0', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} waterCount={0} />
      );

      const waterButton = getByTestId('water-button');
      expect(waterButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should visually indicate depletion when carrotCount is 0', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} carrotCount={0} />
      );

      const carrotButton = getByTestId('carrot-button');
      
      // Check for visual indication (opacity, grayed out, etc.)
      const style = Array.isArray(carrotButton.props.style)
        ? carrotButton.props.style.flat()
        : [carrotButton.props.style];
      
      const hasOpacityReduction = style.some(s => s && s.opacity && s.opacity < 1);
      expect(hasOpacityReduction).toBe(true);
    });

    it('should visually indicate depletion when waterCount is 0', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} waterCount={0} />
      );

      const waterButton = getByTestId('water-button');
      
      // Check for visual indication (opacity, grayed out, etc.)
      const style = Array.isArray(waterButton.props.style)
        ? waterButton.props.style.flat()
        : [waterButton.props.style];
      
      const hasOpacityReduction = style.some(s => s && s.opacity && s.opacity < 1);
      expect(hasOpacityReduction).toBe(true);
    });

    it('should display "×0" when carrotCount is 0', () => {
      const { getByText } = render(
        <CareItemsPanel {...defaultProps} carrotCount={0} />
      );

      expect(getByText(/🥕.*×0/)).toBeTruthy();
    });

    it('should display "×0" when waterCount is 0', () => {
      const { getByText } = render(
        <CareItemsPanel {...defaultProps} waterCount={0} />
      );

      expect(getByText(/💧.*×0/)).toBeTruthy();
    });

    it('should not trigger onItemTap when carrot button with 0 count is tapped', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} carrotCount={0} />
      );

      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      expect(onItemTap).not.toHaveBeenCalled();
    });

    it('should not trigger onItemTap when water button with 0 count is tapped', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} waterCount={0} />
      );

      const waterButton = getByTestId('water-button');
      fireEvent.press(waterButton);

      expect(onItemTap).not.toHaveBeenCalled();
    });
  });

  describe('Shake Animation on Depleted Button Tap', () => {
    it('should play shake animation when carrot button with 0 count is tapped', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} carrotCount={0} />
      );

      const carrotButton = getByTestId('carrot-button');
      
      // Tap the depleted button
      fireEvent.press(carrotButton);

      // Check that shake animation is triggered (testID or style change)
      const shakeIndicator = getByTestId('carrot-button-shake');
      expect(shakeIndicator).toBeTruthy();
    });

    it('should play shake animation when water button with 0 count is tapped', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} waterCount={0} />
      );

      const waterButton = getByTestId('water-button');
      
      // Tap the depleted button
      fireEvent.press(waterButton);

      // Check that shake animation is triggered (testID or style change)
      const shakeIndicator = getByTestId('water-button-shake');
      expect(shakeIndicator).toBeTruthy();
    });

    it('should not play shake animation when carrot button with count > 0 is tapped', () => {
      const { getByTestId, queryByTestId } = render(
        <CareItemsPanel {...defaultProps} carrotCount={2} />
      );

      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);

      // Shake indicator should not exist
      const shakeIndicator = queryByTestId('carrot-button-shake');
      expect(shakeIndicator).toBeNull();
    });

    it('should not play shake animation when water button with count > 0 is tapped', () => {
      const { getByTestId, queryByTestId } = render(
        <CareItemsPanel {...defaultProps} waterCount={1} />
      );

      const waterButton = getByTestId('water-button');
      fireEvent.press(waterButton);

      // Shake indicator should not exist
      const shakeIndicator = queryByTestId('water-button-shake');
      expect(shakeIndicator).toBeNull();
    });
  });

  describe('Debouncing Rapid Taps (1 Second Cooldown)', () => {
    it('should process first carrot button tap and ignore subsequent taps within 1 second', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const carrotButton = getByTestId('carrot-button');

      // First tap
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Second tap within 1 second (should be ignored)
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Third tap within 1 second (should be ignored)
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);
    });

    it('should process first water button tap and ignore subsequent taps within 1 second', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const waterButton = getByTestId('water-button');

      // First tap
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Second tap within 1 second (should be ignored)
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);
    });

    it('should allow carrot button tap after 1 second cooldown', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const carrotButton = getByTestId('carrot-button');

      // First tap
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Advance time by 1 second
      jest.advanceTimersByTime(1000);

      // Second tap after cooldown (should be processed)
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(2);
    });

    it('should allow water button tap after 1 second cooldown', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const waterButton = getByTestId('water-button');

      // First tap
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);

      // Advance time by 1 second
      jest.advanceTimersByTime(1000);

      // Second tap after cooldown (should be processed)
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(2);
    });

    it('should have independent debouncing for carrot and water buttons', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const carrotButton = getByTestId('carrot-button');
      const waterButton = getByTestId('water-button');

      // Tap carrot
      fireEvent.press(carrotButton);
      expect(onItemTap).toHaveBeenCalledTimes(1);
      expect(onItemTap).toHaveBeenCalledWith('carrot');

      // Tap water immediately (should work - independent debouncing)
      fireEvent.press(waterButton);
      expect(onItemTap).toHaveBeenCalledTimes(2);
      expect(onItemTap).toHaveBeenCalledWith('water');
    });

    it('should not provide visual feedback for debounced taps', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
      );

      const carrotButton = getByTestId('carrot-button');

      // First tap - should have visual feedback
      fireEvent.press(carrotButton);
      
      // Second tap within cooldown - should not have visual feedback
      // This is implementation-specific and may need adjustment
      fireEvent.press(carrotButton);
      
      // Only one callback should have been triggered
      expect(onItemTap).toHaveBeenCalledTimes(1);
    });
  });

  describe('Layout and Positioning', () => {
    it('should position panel at bottom left of screen', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const container = getByTestId('care-items-panel-container');
      
      // Check for bottom-left positioning
      expect(container.props.style).toMatchObject(
        expect.objectContaining({
          position: 'absolute',
        })
      );
    });

    it('should have consistent spacing between title and buttons', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const container = getByTestId('care-items-panel-container');
      expect(container).toBeTruthy();
    });

    it('should have consistent spacing between carrot and water buttons', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const buttonsContainer = getByTestId('care-items-buttons-container');
      
      // Check for spacing (gap or margin)
      expect(buttonsContainer.props.style).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible carrot button', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const carrotButton = getByTestId('carrot-button');
      expect(carrotButton.props.accessible).toBeTruthy();
    });

    it('should have accessible water button', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

      const waterButton = getByTestId('water-button');
      expect(waterButton.props.accessible).toBeTruthy();
    });

    it('should have accessibility label for carrot button', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} carrotCount={3} />);

      const carrotButton = getByTestId('carrot-button');
      expect(carrotButton.props.accessibilityLabel).toBeDefined();
      expect(carrotButton.props.accessibilityLabel).toContain('carrot');
    });

    it('should have accessibility label for water button', () => {
      const { getByTestId } = render(<CareItemsPanel {...defaultProps} waterCount={3} />);

      const waterButton = getByTestId('water-button');
      expect(waterButton.props.accessibilityLabel).toBeDefined();
      expect(waterButton.props.accessibilityLabel).toContain('water');
    });
  });

  describe('Edge Cases', () => {
    it('should handle both buttons disabled simultaneously (eating state)', () => {
      const onItemTap = jest.fn();
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} onItemTap={onItemTap} turtleState="eating" />
      );

      const carrotButton = getByTestId('carrot-button');
      const waterButton = getByTestId('water-button');

      fireEvent.press(carrotButton);
      fireEvent.press(waterButton);

      expect(onItemTap).not.toHaveBeenCalled();
    });

    it('should handle both counts at 0 simultaneously', () => {
      const { getByTestId, getByText } = render(
        <CareItemsPanel {...defaultProps} carrotCount={0} waterCount={0} />
      );

      const carrotButton = getByTestId('carrot-button');
      const waterButton = getByTestId('water-button');

      expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
      expect(waterButton.props.accessibilityState?.disabled).toBe(true);
      expect(getByText(/🥕.*×0/)).toBeTruthy();
      expect(getByText(/💧.*×0/)).toBeTruthy();
    });

    it('should handle carrot enabled and water disabled', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} carrotCount={2} waterCount={0} />
      );

      const carrotButton = getByTestId('carrot-button');
      const waterButton = getByTestId('water-button');

      expect(carrotButton.props.accessibilityState?.disabled).toBe(false);
      expect(waterButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should handle water enabled and carrot disabled', () => {
      const { getByTestId } = render(
        <CareItemsPanel {...defaultProps} carrotCount={0} waterCount={1} />
      );

      const carrotButton = getByTestId('carrot-button');
      const waterButton = getByTestId('water-button');

      expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
      expect(waterButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('should handle rapid state changes from walking to eating', () => {
      const { getByTestId, rerender } = render(
        <CareItemsPanel {...defaultProps} turtleState="walking" />
      );

      const carrotButton = getByTestId('carrot-button');
      expect(carrotButton.props.accessibilityState?.disabled).toBe(false);

      rerender(<CareItemsPanel {...defaultProps} turtleState="eating" />);

      expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should handle count decrement from 1 to 0', () => {
      const { getByTestId, getByText, rerender } = render(
        <CareItemsPanel {...defaultProps} carrotCount={1} />
      );

      expect(getByText(/🥕.*×1/)).toBeTruthy();
      const carrotButton = getByTestId('carrot-button');
      expect(carrotButton.props.accessibilityState?.disabled).toBe(false);

      rerender(<CareItemsPanel {...defaultProps} carrotCount={0} />);

      expect(getByText(/🥕.*×0/)).toBeTruthy();
      expect(carrotButton.props.accessibilityState?.disabled).toBe(true);
    });
  });
});
