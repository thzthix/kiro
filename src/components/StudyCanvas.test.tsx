import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StudyCanvas from './StudyCanvas';

describe('StudyCanvas', () => {
  const defaultProps = {
    progress: 50,
    turtleState: 'walking' as const,
    carrotCount: 3,
    waterCount: 3,
  };

  it('renders the current canvas composition with background and turtle', () => {
    const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

    expect(getByTestId('study-canvas')).toBeTruthy();
    expect(getByTestId('background-image')).toBeTruthy();
    expect(getByTestId('turtle-character-walking')).toBeTruthy();
  });

  it('updates the turtle variant when turtleState changes', () => {
    const { getByTestId, rerender } = render(
      <StudyCanvas {...defaultProps} turtleState="walking" />
    );

    expect(getByTestId('turtle-character-walking')).toBeTruthy();

    rerender(<StudyCanvas {...defaultProps} turtleState="happy" />);
    expect(getByTestId('turtle-character-happy')).toBeTruthy();
  });

  it('ignores non-interactive canvas presses', () => {
    const { getByTestId, queryByText } = render(<StudyCanvas {...defaultProps} />);

    const canvas = getByTestId('study-canvas');
    fireEvent.press(canvas);

    expect(canvas.props.onPress).toBeUndefined();
    expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
  });
});
