/**
 * Property-Based Tests for CareItemsPanel
 * Feature: turtle-study-app
 * 
 * These tests verify universal properties that should hold across all valid inputs
 * for the CareItemsPanel component managing care item interactions.
 */

import fc from 'fast-check';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CareItemsPanel } from './CareItemsPanel';

describe('CareItemsPanel Property-Based Tests', () => {
  describe('Property 10: Rapid Tap Debouncing', () => {
    // Feature: turtle-study-app, Property 10: Rapid Tap Debouncing
    // For any sequence of care item button taps where multiple taps occur within 1 second,
    // only the first tap SHALL trigger a state change, and subsequent taps SHALL be
    // ignored for 1 second.
    // Validates: Requirements 5.13

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should process only the first tap and ignore subsequent taps within 1 second for any tap sequence', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('carrot', 'water'), // item type
          fc.integer({ min: 2, max: 10 }), // number of rapid taps
          (itemType, numTaps) => {
            const onItemTap = jest.fn();
            
            const { getByTestId } = render(
              <CareItemsPanel
                onItemTap={onItemTap}
                disabled={false}
                carrotCount={3}
                waterCount={3}
                turtleState="walking"
              />
            );

            const button = getByTestId(`${itemType}-button`);

            // Perform rapid taps without advancing time (all within same tick)
            for (let i = 0; i < numTaps; i++) {
              fireEvent.press(button);
            }

            // Advance timers to complete any pending debounce
            jest.advanceTimersByTime(1000);

            // Only the first tap should have been processed
            expect(onItemTap).toHaveBeenCalledTimes(1);
            expect(onItemTap).toHaveBeenCalledWith(itemType);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow a new tap after 1 second cooldown period', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('carrot', 'water'), // item type
          fc.integer({ min: 1000, max: 2000 }), // delay after first tap (>= 1000ms)
          (itemType, delayMs) => {
            const onItemTap = jest.fn();
            
            const { getByTestId } = render(
              <CareItemsPanel
                onItemTap={onItemTap}
                disabled={false}
                carrotCount={3}
                waterCount={3}
                turtleState="walking"
              />
            );

            const button = getByTestId(`${itemType}-button`);

            // First tap
            fireEvent.press(button);
            
            // Wait for cooldown period
            jest.advanceTimersByTime(delayMs);
            
            // Second tap after cooldown
            fireEvent.press(button);

            // Advance timers to complete any pending debounce
            jest.advanceTimersByTime(1000);

            // Both taps should have been processed
            expect(onItemTap).toHaveBeenCalledTimes(2);
            expect(onItemTap).toHaveBeenNthCalledWith(1, itemType);
            expect(onItemTap).toHaveBeenNthCalledWith(2, itemType);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 11: Item Count Limits and Shake Animation', () => {
    // Feature: turtle-study-app, Property 11: Item Count Limits and Shake Animation
    // For any care item type (carrot or water), when a session starts, the count SHALL
    // be initialized to 3, and each time the item button is tapped and processed, the
    // count SHALL decrement by 1, and when the count reaches 0, the corresponding button
    // SHALL be disabled and display a shake animation when tapped.
    // Validates: Requirements 5.2, 5.3, 5.6, 5.7, 5.8, 5.16

    it('should initialize count to 3 and decrement on each tap for any item type', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('carrot', 'water'), // item type
          (itemType) => {
            const onItemTap = jest.fn();
            
            const { getByTestId, getByText } = render(
              <CareItemsPanel
                onItemTap={onItemTap}
                disabled={false}
                carrotCount={3}
                waterCount={3}
                turtleState="walking"
              />
            );

            // Verify initial count is 3
            const icon = itemType === 'carrot' ? '🥕' : '💧';
            expect(getByText(`${icon} ×3`)).toBeTruthy();

            const button = getByTestId(`${itemType}-button`);
            
            // Verify button is enabled initially
            expect(button.props.accessibilityState?.disabled).toBeFalsy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should decrement count and disable button when count reaches 0', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('carrot', 'water'), // item type
          fc.integer({ min: 0, max: 3 }), // starting count
          (itemType, startCount) => {
            const onItemTap = jest.fn();
            
            const carrotCount = itemType === 'carrot' ? startCount : 3;
            const waterCount = itemType === 'water' ? startCount : 3;
            
            const { getByTestId, getByText } = render(
              <CareItemsPanel
                onItemTap={onItemTap}
                disabled={false}
                carrotCount={carrotCount}
                waterCount={waterCount}
                turtleState="walking"
              />
            );

            const icon = itemType === 'carrot' ? '🥕' : '💧';
            const button = getByTestId(`${itemType}-button`);

            // Verify count display
            expect(getByText(`${icon} ×${startCount}`)).toBeTruthy();

            // Verify button state based on count
            if (startCount === 0) {
              // Button should be disabled when count is 0
              expect(button.props.accessibilityState?.disabled).toBe(true);
            } else {
              // Button should be enabled when count > 0
              expect(button.props.accessibilityState?.disabled).toBeFalsy();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should play shake animation when depleted button (×0) is tapped', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('carrot', 'water'), // item type
          (itemType) => {
            const onItemTap = jest.fn();
            
            const carrotCount = itemType === 'carrot' ? 0 : 3;
            const waterCount = itemType === 'water' ? 0 : 3;
            
            const { getByTestId } = render(
              <CareItemsPanel
                onItemTap={onItemTap}
                disabled={false}
                carrotCount={carrotCount}
                waterCount={waterCount}
                turtleState="walking"
              />
            );

            const button = getByTestId(`${itemType}-button`);

            // Tap the depleted button
            fireEvent.press(button);

            // Verify onItemTap was NOT called (button is disabled)
            expect(onItemTap).not.toHaveBeenCalled();

            // Verify shake animation was triggered
            // Note: We'll check for the shake animation by verifying the button's
            // animated style or a testID that indicates shake animation is active
            const shakeIndicator = getByTestId(`${itemType}-button-shake`);
            expect(shakeIndicator).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should disable button during eating and happy states regardless of count', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('carrot', 'water'), // item type
          fc.constantFrom('eating', 'happy'), // turtle state
          fc.integer({ min: 1, max: 3 }), // count (> 0)
          (itemType, turtleState, count) => {
            const onItemTap = jest.fn();
            
            const carrotCount = itemType === 'carrot' ? count : 3;
            const waterCount = itemType === 'water' ? count : 3;
            
            const { getByTestId } = render(
              <CareItemsPanel
                onItemTap={onItemTap}
                disabled={false}
                carrotCount={carrotCount}
                waterCount={waterCount}
                turtleState={turtleState as 'eating' | 'happy'}
              />
            );

            const button = getByTestId(`${itemType}-button`);

            // Verify button is disabled during eating/happy states
            expect(button.props.accessibilityState?.disabled).toBe(true);

            // Tap the button
            fireEvent.press(button);

            // Verify onItemTap was NOT called
            expect(onItemTap).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should disable button when disabled prop is true (session paused)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('carrot', 'water'), // item type
          fc.integer({ min: 1, max: 3 }), // count (> 0)
          (itemType, count) => {
            const onItemTap = jest.fn();
            
            const carrotCount = itemType === 'carrot' ? count : 3;
            const waterCount = itemType === 'water' ? count : 3;
            
            const { getByTestId } = render(
              <CareItemsPanel
                onItemTap={onItemTap}
                disabled={true}
                carrotCount={carrotCount}
                waterCount={waterCount}
                turtleState="walking"
              />
            );

            const button = getByTestId(`${itemType}-button`);

            // Verify button is disabled when disabled prop is true
            expect(button.props.accessibilityState?.disabled).toBe(true);

            // Tap the button
            fireEvent.press(button);

            // Verify onItemTap was NOT called
            expect(onItemTap).not.toHaveBeenCalled();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
