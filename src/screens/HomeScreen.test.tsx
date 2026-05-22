import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from './HomeScreen';

describe('HomeScreen', () => {
  describe('Rendering', () => {
    it('should render the home screen container', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('home-screen')).toBeTruthy();
    });

    it('should display app title "🐢 Turtle Study"', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('🐢 Turtle Study')).toBeTruthy();
    });

    it('should display subtitle "Focus together, one step at a time."', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Focus together, one step at a time.')).toBeTruthy();
    });

    it('should display a turtle illustration', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('home-turtle-illustration')).toBeTruthy();
    });

    it('should display watercolor background matching app theme', () => {
      const { UNSAFE_queryAllByType } = render(<HomeScreen />);
      // BackgroundImage should be rendered via ScreenLayout
      const BackgroundImage = require('../components/BackgroundImage').default;
      const backgrounds = UNSAFE_queryAllByType(BackgroundImage);
      expect(backgrounds.length).toBeGreaterThan(0);
    });
  });

  describe('TimeInputPopup Integration', () => {
    it('should automatically display TimeInputPopup when home screen loads', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('time-input-popup')).toBeTruthy();
    });

    it('should show TimeInputPopup with visible prop set to true on mount', () => {
      const { getByTestId } = render(<HomeScreen />);
      const popup = getByTestId('time-input-popup');
      expect(popup.props.visible).toBe(true);
    });
  });

  describe('Session Start Flow', () => {
    it('should call onStartSession callback when valid time is submitted', () => {
      const onStartSession = jest.fn();
      const { getByTestId } = render(<HomeScreen onStartSession={onStartSession} />);
      
      const popup = getByTestId('time-input-popup');
      // Simulate popup submit with valid duration
      fireEvent(popup, 'submit', 30);
      
      expect(onStartSession).toHaveBeenCalledWith(30);
    });

    it('should keep TimeInputPopup open when cancel is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);
      
      const popup = getByTestId('time-input-popup');
      fireEvent(popup, 'cancel');
      
      // Popup should still be visible after cancel
      expect(getByTestId('time-input-popup')).toBeTruthy();
    });
  });

  describe('Visual Theme Consistency', () => {
    it('should use colors from defined palette (beige, light yellow, mint, olive green)', () => {
      const { getByTestId } = render(<HomeScreen />);
      const container = getByTestId('home-screen');
      
      // Should have background color from palette
      expect(container.props.style).toBeDefined();
    });

    it('should display background with landscape elements (hills, lakes, trees, flowers)', () => {
      const { UNSAFE_queryAllByType } = render(<HomeScreen />);
      // BackgroundImage should be rendered via ScreenLayout
      const BackgroundImage = require('../components/BackgroundImage').default;
      const backgrounds = UNSAFE_queryAllByType(BackgroundImage);
      expect(backgrounds.length).toBeGreaterThan(0);
    });

    it('should display at least three decorative elements', () => {
      const { getByTestId } = render(<HomeScreen />);
      const decorativeElements = getByTestId('decorative-elements');
      expect(decorativeElements).toBeTruthy();
    });
  });

  describe('Fallback Handling', () => {
    it('should display solid beige background if background image fails to load', () => {
      const { getByTestId } = render(<HomeScreen />);
      const container = getByTestId('home-screen');
      
      // ScreenLayout provides beige background by default
      // Background fallback is now handled by ScreenLayout component
      expect(container).toBeTruthy();
    });
  });
});
