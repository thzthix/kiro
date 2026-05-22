import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CareItemsPanel from './CareItemsPanel';

describe('CareItemsPanel', () => {
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

  it('renders the current care panel structure and exposes counts on the container', () => {
    const { getByTestId } = render(<CareItemsPanel {...defaultProps} />);

    const container = getByTestId('care-items-panel-container');
    expect(container).toBeTruthy();
    expect(getByTestId('care-items-title')).toBeTruthy();
    expect(getByTestId('care-items-buttons-container')).toBeTruthy();
    expect(container.props.carrotCount).toBe(3);
    expect(container.props.waterCount).toBe(3);
  });

  it('triggers onItemTap for enabled carrot and water buttons', () => {
    const onItemTap = jest.fn();
    const { getByTestId } = render(
      <CareItemsPanel {...defaultProps} onItemTap={onItemTap} />
    );

    fireEvent.press(getByTestId('carrot-button'));
    expect(onItemTap).toHaveBeenCalledWith('carrot');

    jest.advanceTimersByTime(1000);

    fireEvent.press(getByTestId('water-button'));
    expect(onItemTap).toHaveBeenCalledWith('water');
  });

  it('disables care buttons during eating and happy states', () => {
    const eating = render(
      <CareItemsPanel {...defaultProps} turtleState="eating" />
    );

    expect(eating.getByTestId('carrot-button').props.accessibilityState.disabled).toBe(true);
    expect(eating.getByTestId('water-button').props.accessibilityState.disabled).toBe(true);
    eating.unmount();

    const happy = render(
      <CareItemsPanel {...defaultProps} turtleState="happy" />
    );

    expect(happy.getByTestId('carrot-button').props.accessibilityState.disabled).toBe(true);
    expect(happy.getByTestId('water-button').props.accessibilityState.disabled).toBe(true);
  });

  it('disables depleted buttons and shows the shake indicator on tap', () => {
    const onItemTap = jest.fn();
    const { getByTestId } = render(
      <CareItemsPanel
        {...defaultProps}
        onItemTap={onItemTap}
        carrotCount={0}
      />
    );

    const carrotButton = getByTestId('carrot-button');
    expect(carrotButton.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(carrotButton);
    expect(onItemTap).not.toHaveBeenCalled();
    expect(getByTestId('carrot-button-shake')).toBeTruthy();
  });
});
