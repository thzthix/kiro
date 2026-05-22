import fc from 'fast-check';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CareItemsPanel } from './CareItemsPanel';

describe('CareItemsPanel Property Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('debounces rapid taps for either care item', () => {
    fc.assert(
      fc.property(fc.constantFrom('carrot', 'water'), fc.integer({ min: 2, max: 10 }), (itemType, numTaps) => {
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

        for (let i = 0; i < numTaps; i += 1) {
          fireEvent.press(button);
        }

        jest.advanceTimersByTime(1000);

        expect(onItemTap).toHaveBeenCalledTimes(1);
        expect(onItemTap).toHaveBeenCalledWith(itemType);
      }),
      { numRuns: 50 }
    );
  });

  it('reflects disabled state when the relevant count is zero', () => {
    fc.assert(
      fc.property(fc.constantFrom('carrot', 'water'), (itemType) => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={itemType === 'carrot' ? 0 : 3}
            waterCount={itemType === 'water' ? 0 : 3}
            turtleState="walking"
          />
        );

        expect(getByTestId(`${itemType}-button`).props.accessibilityState.disabled).toBe(true);
      }),
      { numRuns: 20 }
    );
  });

  it('keeps buttons disabled during eating and happy states regardless of count', () => {
    fc.assert(
      fc.property(fc.constantFrom('eating', 'happy'), (turtleState) => {
        const { getByTestId } = render(
          <CareItemsPanel
            onItemTap={jest.fn()}
            disabled={false}
            carrotCount={3}
            waterCount={3}
            turtleState={turtleState}
          />
        );

        expect(getByTestId('carrot-button').props.accessibilityState.disabled).toBe(true);
        expect(getByTestId('water-button').props.accessibilityState.disabled).toBe(true);
      }),
      { numRuns: 20 }
    );
  });
});
