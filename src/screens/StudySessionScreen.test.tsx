import React, { useEffect } from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { StudySessionScreen } from './StudySessionScreen';
import { AppProvider, useAppContext } from '../context/AppContext';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    dispatch({
      type: 'START_SESSION',
      payload: { duration: 1 },
    });
  }, [dispatch]);

  return <>{children}</>;
};

const renderWithProvider = () =>
  render(
    <AppProvider>
      <TestWrapper>
        <StudySessionScreen />
      </TestWrapper>
    </AppProvider>
  );

beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['nextTick'] });
  jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('StudySessionScreen', () => {
  it('renders the current session layout with timer header, canvas, care panel, and controls', () => {
    const { getByTestId, queryByTestId } = renderWithProvider();

    expect(getByTestId('study-session-screen')).toBeTruthy();
    expect(getByTestId('session-header')).toBeTruthy();
    expect(getByTestId('timer-display')).toBeTruthy();
    expect(queryByTestId('progress-bar')).toBeNull();
    expect(getByTestId('study-canvas')).toBeTruthy();
    expect(getByTestId('care-items-panel-container')).toBeTruthy();
    expect(getByTestId('session-controls-container')).toBeTruthy();
  });

  it('updates the accessibility timer as the session advances', () => {
    const { getByTestId } = renderWithProvider();

    expect(getByTestId('timer-display').props.children).toBe('01:00');

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(getByTestId('timer-display').props.children).toBe('00:50');
  });

  it('switches turtle state when pausing and resuming the session', () => {
    const { getByTestId, queryByTestId } = renderWithProvider();

    fireEvent.press(getByTestId('pause-button'));
    expect(queryByTestId('turtle-character-sleeping')).toBeTruthy();

    fireEvent.press(getByTestId('resume-button'));
    expect(queryByTestId('turtle-character-sleeping')).toBeNull();
    expect(queryByTestId('turtle-character-walking')).toBeTruthy();
  });

  it('shows and dismisses the stop confirmation dialog from the screen', () => {
    const { getByTestId, queryAllByText } = renderWithProvider();

    fireEvent.press(getByTestId('stop-button'));
    expect(queryAllByText('세션을 종료하시겠습니까?').length).toBeGreaterThan(0);

    fireEvent.press(getByTestId('stop-cancel-button'));
    expect(getByTestId('study-session-screen')).toBeTruthy();
  });
});
