import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SessionControls from './SessionControls';

describe('SessionControls', () => {
  const defaultProps = {
    status: 'running' as const,
    onPause: jest.fn(),
    onResume: jest.fn(),
    onStop: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pause and stop controls while running', () => {
    const { getByTestId, queryByTestId } = render(
      <SessionControls {...defaultProps} status="running" />
    );

    expect(getByTestId('session-controls-container')).toBeTruthy();
    expect(getByTestId('pause-button')).toBeTruthy();
    expect(getByTestId('stop-button')).toBeTruthy();
    expect(queryByTestId('resume-button')).toBeNull();
  });

  it('renders resume and stop controls while paused', () => {
    const { getByTestId, queryByTestId } = render(
      <SessionControls {...defaultProps} status="paused" />
    );

    expect(getByTestId('resume-button')).toBeTruthy();
    expect(getByTestId('stop-button')).toBeTruthy();
    expect(queryByTestId('pause-button')).toBeNull();
  });

  it('calls the action handlers for pause and resume', () => {
    const onPause = jest.fn();
    const onResume = jest.fn();

    const running = render(
      <SessionControls
        {...defaultProps}
        status="running"
        onPause={onPause}
        onResume={onResume}
      />
    );

    fireEvent.press(running.getByTestId('pause-button'));
    expect(onPause).toHaveBeenCalledTimes(1);

    running.unmount();

    const paused = render(
      <SessionControls
        {...defaultProps}
        status="paused"
        onPause={onPause}
        onResume={onResume}
      />
    );

    fireEvent.press(paused.getByTestId('resume-button'));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('confirms stop before calling onStop', () => {
    const onStop = jest.fn();
    const { getByTestId } = render(
      <SessionControls {...defaultProps} onStop={onStop} />
    );

    fireEvent.press(getByTestId('stop-button'));
    expect(getByTestId('stop-confirmation-dialog')).toBeTruthy();
    expect(onStop).not.toHaveBeenCalled();

    fireEvent.press(getByTestId('stop-confirm-button'));
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
