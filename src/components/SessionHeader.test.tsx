import React from 'react';
import { Image } from 'react-native';
import { render } from '@testing-library/react-native';
import SessionHeader from './SessionHeader';

describe('SessionHeader', () => {
  it('renders the timer panel base image and hides the old progress UI', () => {
    const { getByTestId, queryByTestId, UNSAFE_getAllByType } = render(
      <SessionHeader remainingSeconds={1500} progress={0} />
    );

    expect(getByTestId('session-header')).toBeTruthy();
    expect(getByTestId('session-header-container')).toBeTruthy();
    expect(queryByTestId('progress-bar')).toBeNull();
    expect(queryByTestId('progress-bar-turtle-slider')).toBeNull();
    expect(UNSAFE_getAllByType(Image)).toHaveLength(1);
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

  it('renders separated minute and second text so the base image colon stays visible', () => {
    const { getByTestId } = render(
      <SessionHeader remainingSeconds={2399} progress={0} />
    );

    const minuteText = getByTestId('timer-minutes');
    const secondText = getByTestId('timer-seconds');

    expect(minuteText.props.children).toBe('39');
    expect(secondText.props.children).toBe('59');
    expect(minuteText.props.style[0]).toMatchObject({
      fontSize: 82,
      fontWeight: '600',
      color: '#7B6344',
      textAlign: 'center',
      letterSpacing: 0.2,
      fontFamily:
        'Avenir Next Rounded, Avenir Next, Nunito, Arial Rounded MT Bold, Trebuchet MS, sans-serif',
    });
    expect(secondText.props.style[0]).toMatchObject(minuteText.props.style[0]);
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
  });
});
