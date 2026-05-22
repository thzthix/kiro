import React from 'react';
import { render } from '@testing-library/react-native';
import TurtleCharacter from './TurtleCharacter';
import { PathCoordinates } from '../types';

describe('TurtleCharacter', () => {
  const mockPathCoordinates: PathCoordinates = {
    start: { x: 50, y: 300 },
    goal: { x: 350, y: 300 },
    waypoints: [
      { x: 150, y: 250 },
      { x: 250, y: 250 },
    ],
  };

  it('renders the display walking sprite sheet when the turtle is walking', () => {
    const { getByTestId } = render(
      <TurtleCharacter
        progress={50}
        state="walking"
        pathCoordinates={mockPathCoordinates}
      />
    );

    const turtleImage = getByTestId('turtle-image');
    expect(getByTestId('turtle-character-walking')).toBeTruthy();
    expect(turtleImage.props.source).toEqual(
      require('../../assets/images/turtle_walking_sheet_display.png')
    );
  });

  it('renders state-specific turtle images for non-walking states', () => {
    const happy = render(
      <TurtleCharacter
        progress={50}
        state="happy"
        pathCoordinates={mockPathCoordinates}
      />
    );

    expect(happy.getByTestId('turtle-character-happy')).toBeTruthy();
    expect(happy.getByTestId('heart-effect')).toBeTruthy();
    happy.unmount();

    const sleeping = render(
      <TurtleCharacter
        progress={50}
        state="sleeping"
        pathCoordinates={mockPathCoordinates}
      />
    );

    expect(sleeping.getByTestId('turtle-character-sleeping')).toBeTruthy();
  });

  it('renders the arrived state at 100 percent progress', () => {
    const { getByTestId } = render(
      <TurtleCharacter
        progress={100}
        state="arrived"
        pathCoordinates={mockPathCoordinates}
      />
    );

    expect(getByTestId('turtle-character-arrived')).toBeTruthy();
  });
});
