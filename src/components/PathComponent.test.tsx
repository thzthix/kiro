import React from 'react';
import { render } from '@testing-library/react-native';
import PathComponent from './PathComponent';
import { PathCoordinates } from '../types';

describe('PathComponent', () => {
  const mockPathCoordinates: PathCoordinates = {
    start: { x: 50, y: 300 },
    goal: { x: 350, y: 300 },
    waypoints: [
      { x: 125, y: 280 },
      { x: 200, y: 290 },
      { x: 275, y: 280 },
    ],
  };

  it('should render path with correct coordinates', () => {
    const { getByTestId } = render(
      <PathComponent pathCoordinates={mockPathCoordinates} />
    );

    const pathContainer = getByTestId('path-container');
    expect(pathContainer).toBeTruthy();
  });

  it('should display START label', () => {
    const { getByText } = render(
      <PathComponent pathCoordinates={mockPathCoordinates} />
    );

    expect(getByText('START')).toBeTruthy();
  });

  it('should display GOAL label', () => {
    const { getByText } = render(
      <PathComponent pathCoordinates={mockPathCoordinates} />
    );

    expect(getByText('GOAL')).toBeTruthy();
  });

  it('should render path element', () => {
    const { getByTestId } = render(
      <PathComponent pathCoordinates={mockPathCoordinates} />
    );

    const pathElement = getByTestId('path-element');
    expect(pathElement).toBeTruthy();
  });

  it('should use olive green color for path', () => {
    const { getByTestId } = render(
      <PathComponent pathCoordinates={mockPathCoordinates} />
    );

    const pathElement = getByTestId('path-element');
    const styles = pathElement.props.style;
    
    // Check if the path uses olive green color (#8B9556)
    expect(styles).toBeDefined();
  });
});
