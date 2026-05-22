import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import App from '../../App';

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['nextTick'] });
  jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('Integration Tests - Timer Flow', () => {
  it('opens with the time input popup and starts a timer session from the home screen', () => {
    const { getByTestId, queryByTestId } = render(<App />);

    expect(getByTestId('time-input-field')).toBeTruthy();

    fireEvent.changeText(getByTestId('time-input-field'), '1');
    fireEvent.press(getByTestId('submit-button'));

    expect(queryByTestId('time-input-field')).toBeNull();
    expect(getByTestId('care-items-panel-container')).toBeTruthy();
    expect(getByTestId('timer-display').props.children).toBe('01:00');
  });

  it('updates the timer and toggles pause-resume controls during an active session', () => {
    const { getByTestId, queryByTestId } = render(<App />);

    fireEvent.changeText(getByTestId('time-input-field'), '1');
    fireEvent.press(getByTestId('submit-button'));

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(getByTestId('timer-display').props.children).toBe('00:50');

    fireEvent.press(getByTestId('pause-button'));
    expect(queryByTestId('resume-button')).toBeTruthy();

    fireEvent.press(getByTestId('resume-button'));
    expect(queryByTestId('pause-button')).toBeTruthy();
  });
});
