import React from 'react';
import { render } from '@testing-library/react-native';
import SessionHeader from './SessionHeader';

describe('SessionHeader', () => {
  it('renders a code-based timer panel and hides the old progress UI', () => {
    const { getByTestId, queryByTestId } = render(
      <SessionHeader remainingSeconds={1500} progress={0} />
    );

    expect(getByTestId('session-header')).toBeTruthy();
    expect(getByTestId('session-header-container')).toBeTruthy();
    expect(getByTestId('timer-panel-base')).toBeTruthy();
    expect(queryByTestId('progress-bar')).toBeNull();
    expect(queryByTestId('progress-bar-turtle-slider')).toBeNull();
  });

  it('formats remaining seconds as MM:SS for accessibility text', () => {
    const { getByTestId, rerender } = render(
      <SessionHeader remainingSeconds={1800} progress={0} />
    );

    expect(getByTestId('timer-display').props.children).toBe('30:00');

    rerender(<SessionHeader remainingSeconds={65} progress={0} />);
    expect(getByTestId('timer-display').props.children).toBe('01:05');

    rerender(<SessionHeader remainingSeconds={0} progress={0} />);
    expect(getByTestId('timer-display').props.children).toBe('00:00');
  });

  it('renders a full MM:SS timer string with rounded typography', () => {
    const { getByTestId, getByText } = render(
      <SessionHeader remainingSeconds={2399} progress={0} />
    );

    const visibleTimer = getByTestId('timer-display-visible');

    expect(getByText('남은 시간')).toBeTruthy();
    expect(visibleTimer.props.children).toBe('39:59');
    expect(visibleTimer.props.style).toMatchObject({
      fontSize: 84,
      fontWeight: '700',
      color: '#7B6344',
      textAlign: 'center',
      letterSpacing: -0.3,
      fontFamily: 'Nanum Gothic, Arial, sans-serif',
    });
  });

  it('uses a centered timer-panel layout sized like the reference asset', () => {
    const { getByTestId } = render(
      <SessionHeader remainingSeconds={1500} progress={0} />
    );

    expect(getByTestId('session-header').props.style).toMatchObject({
      width: '100%',
      alignItems: 'center',
    });

    expect(getByTestId('session-header-container').props.style).toMatchObject({
      width: '100%',
      aspectRatio: 1756 / 895,
      justifyContent: 'center',
      alignItems: 'center',
    });

    expect(getByTestId('timer-panel-base').props.style).toMatchObject({
      backgroundColor: '#FFF7E2',
    });
  });
});
