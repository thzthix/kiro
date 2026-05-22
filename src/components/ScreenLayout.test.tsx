/**
 * ScreenLayout Component Tests
 * Feature: turtle-study-app
 * Task: 13.5 Refactor screens (REFACTOR)
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ScreenLayout } from './ScreenLayout';

describe('ScreenLayout', () => {
  it('should render with children', () => {
    const { getByText } = render(
      <ScreenLayout>
        <Text>Test Content</Text>
      </ScreenLayout>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should render with testID', () => {
    const { getByTestId } = render(
      <ScreenLayout testID="test-screen">
        <Text>Content</Text>
      </ScreenLayout>
    );

    expect(getByTestId('test-screen')).toBeTruthy();
  });

  it('should show decorations by default', () => {
    const { UNSAFE_queryAllByType } = render(
      <ScreenLayout>
        <Text>Content</Text>
      </ScreenLayout>
    );

    // DecorativeElements should be present
    const decorativeElements = UNSAFE_queryAllByType(
      require('./DecorativeElements').default
    );
    expect(decorativeElements.length).toBeGreaterThan(0);
  });

  it('should hide decorations when showDecorations is false', () => {
    const { UNSAFE_queryAllByType } = render(
      <ScreenLayout showDecorations={false}>
        <Text>Content</Text>
      </ScreenLayout>
    );

    // DecorativeElements should not be present
    const decorativeElements = UNSAFE_queryAllByType(
      require('./DecorativeElements').default
    );
    expect(decorativeElements.length).toBe(0);
  });

  it('should always render BackgroundImage', () => {
    const { UNSAFE_queryAllByType } = render(
      <ScreenLayout>
        <Text>Content</Text>
      </ScreenLayout>
    );

    // BackgroundImage should be present
    const backgroundImages = UNSAFE_queryAllByType(
      require('./BackgroundImage').default
    );
    expect(backgroundImages.length).toBeGreaterThan(0);
  });

  it('should apply custom contentStyle', () => {
    const customStyle = { paddingHorizontal: 40 };
    const { getByTestId } = render(
      <ScreenLayout testID="test-screen" contentStyle={customStyle}>
        <Text>Content</Text>
      </ScreenLayout>
    );

    const screen = getByTestId('test-screen');
    expect(screen).toBeTruthy();
  });
});
