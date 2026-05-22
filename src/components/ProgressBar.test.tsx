import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from './ProgressBar';

const getStyleProp = (styleOrArray: any, propName: string): any => {
  const styles = Array.isArray(styleOrArray) ? styleOrArray : [styleOrArray];
  for (const style of styles) {
    if (style && style[propName] !== undefined) {
      return style[propName];
    }
  }
  return undefined;
};

describe('ProgressBar', () => {
  it('renders the current simplified progress bar structure', () => {
    const { getByTestId, queryByTestId } = render(<ProgressBar progress={50} />);

    expect(getByTestId('progress-bar')).toBeTruthy();
    expect(getByTestId('progress-bar-filled')).toBeTruthy();
    expect(queryByTestId('progress-bar-turtle-slider')).toBeNull();
  });

  it('updates the filled width from the provided progress value', () => {
    const { getByTestId, rerender } = render(<ProgressBar progress={25} />);

    expect(getStyleProp(getByTestId('progress-bar-filled').props.style, 'width')).toBe('25%');

    rerender(<ProgressBar progress={75} />);
    expect(getStyleProp(getByTestId('progress-bar-filled').props.style, 'width')).toBe('75%');
  });

  it('clamps out-of-range progress values safely', () => {
    const negative = render(<ProgressBar progress={-10} />);
    expect(getStyleProp(negative.getByTestId('progress-bar-filled').props.style, 'width')).toBe('0%');
    negative.unmount();

    const overflow = render(<ProgressBar progress={150} />);
    expect(getStyleProp(overflow.getByTestId('progress-bar-filled').props.style, 'width')).toBe('100%');
  });

  it('exposes progress information through accessibility props', () => {
    const { getByTestId } = render(<ProgressBar progress={33.33} />);

    const progressBar = getByTestId('progress-bar');
    expect(progressBar.props.accessibilityRole).toBe('progressbar');
    expect(progressBar.props.accessibilityValue).toMatchObject({
      now: 33.33,
      min: 0,
      max: 100,
    });
  });
});
