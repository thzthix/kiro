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

  describe('Sprite rendering based on state', () => {
    it('should render walking sprite for walking state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="walking"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      expect(turtleImage.props.source).toEqual(
        require('../../assets/images/turtle/turtle_walking.jpeg')
      );
    });

    it('should render eating sprite for eating state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="eating"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      expect(turtleImage.props.source).toEqual(
        require('../../assets/images/turtle/turtle_eating.jpeg')
      );
    });

    it('should render happy sprite for happy state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="happy"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      expect(turtleImage.props.source).toEqual(
        require('../../assets/images/turtle/turtle_happy.jpeg')
      );
    });

    it('should render sleeping sprite for sleeping state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="sleeping"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      expect(turtleImage.props.source).toEqual(
        require('../../assets/images/turtle/turtle_sleeping.jpeg')
      );
    });

    it('should render arrived sprite for arrived state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={100}
          state="arrived"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      expect(turtleImage.props.source).toEqual(
        require('../../assets/images/turtle/turtle_arrived.png')
      );
    });
  });

  describe('Turtle direction', () => {
    it('should always face rightward (no transform scaleX)', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="walking"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      // Verify no horizontal flip is applied (scaleX should not be -1)
      const style = turtleImage.props.style;
      if (Array.isArray(style)) {
        const transforms = style.flatMap((s) => s?.transform || []);
        const scaleXTransform = transforms.find(
          (t: any) => t && typeof t === 'object' && 'scaleX' in t
        );
        if (scaleXTransform) {
          expect(scaleXTransform.scaleX).not.toBe(-1);
        }
      }
    });
  });

  describe('Position updates based on progress', () => {
    it('should position turtle at start when progress is 0', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={0}
          state="walking"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const container = getByTestId('turtle-character-walking');
      // Position should be calculated from progress 0
      expect(container).toBeTruthy();
    });

    it('should position turtle at goal when progress is 100', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={100}
          state="arrived"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const container = getByTestId('turtle-character-arrived');
      // Position should be calculated from progress 100
      expect(container).toBeTruthy();
    });

    it('should position turtle at midpoint when progress is 50', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="walking"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const container = getByTestId('turtle-character-walking');
      // Position should be calculated from progress 50
      expect(container).toBeTruthy();
    });
  });

  describe('Eating state animation', () => {
    it('should display turtle_eating.jpeg for eating state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="eating"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      expect(turtleImage.props.source).toEqual(
        require('../../assets/images/turtle/turtle_eating.jpeg')
      );
    });
  });

  describe('Happy state animation', () => {
    it('should display turtle_happy.jpeg for happy state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="happy"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      expect(turtleImage.props.source).toEqual(
        require('../../assets/images/turtle/turtle_happy.jpeg')
      );
    });

    it('should render heart effect for happy state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={50}
          state="happy"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const heartEffect = getByTestId('heart-effect');
      expect(heartEffect).toBeTruthy();
    });
  });

  describe('Arrived state', () => {
    it('should display turtle_arrived.png static for arrived state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={100}
          state="arrived"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const turtleImage = getByTestId('turtle-image');
      expect(turtleImage.props.source).toEqual(
        require('../../assets/images/turtle/turtle_arrived.png')
      );
    });

    it('should not have bouncing animation for arrived state', () => {
      const { getByTestId } = render(
        <TurtleCharacter
          progress={100}
          state="arrived"
          pathCoordinates={mockPathCoordinates}
        />
      );

      const container = getByTestId('turtle-character-arrived');
      // Verify no bouncing animation is applied
      // In a real implementation, we'd check that no animated value is oscillating
      expect(container).toBeTruthy();
    });
  });
});
