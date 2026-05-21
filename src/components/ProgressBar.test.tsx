/**
 * Unit Tests for ProgressBar Component (RED Phase)
 * Feature: turtle-study-app
 * 
 * These tests verify the ProgressBar component behavior including:
 * - Horizontal bar rendering with filled/unfilled portions
 * - Mini turtle icon slider positioning based on progress
 * - Progress percentage display (0-100%)
 * - Color scheme (mint for filled, light beige for unfilled)
 * - Rightward movement of turtle icon
 * 
 * All tests should FAIL in RED phase until component is implemented.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from './ProgressBar';

describe('ProgressBar Component - Unit Tests (RED)', () => {
  describe('Component Rendering', () => {
    it('should render progress bar container', () => {
      const { getByTestId } = render(
        <ProgressBar progress={0} />
      );

      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('should render as View component', () => {
      const { getByTestId } = render(
        <ProgressBar progress={0} />
      );

      const progressBar = getByTestId('progress-bar');
      expect(progressBar.type).toBe('View');
    });

    it('should render filled portion', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      expect(filledPortion).toBeTruthy();
    });

    it('should render mini turtle icon slider', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      expect(turtleSlider).toBeTruthy();
    });
  });

  describe('Progress Bar Styling', () => {
    it('should have horizontal bar layout', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const progressBar = getByTestId('progress-bar');
      
      // Check for horizontal layout (flexDirection: row or default)
      expect(progressBar.props.style).toMatchObject(
        expect.objectContaining({
          flexDirection: expect.stringMatching(/row|undefined/),
        })
      );
    });

    it('should have defined height', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const progressBar = getByTestId('progress-bar');
      
      // Check for height
      expect(progressBar.props.style).toMatchObject(
        expect.objectContaining({
          height: expect.any(Number),
        })
      );
    });

    it('should have light beige background for unfilled portion', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const progressBar = getByTestId('progress-bar');
      
      // Check for light beige background
      expect(progressBar.props.style).toMatchObject(
        expect.objectContaining({
          backgroundColor: expect.stringMatching(/beige|#F5F5DC|#F4E8D8|#FFF8DC/i),
        })
      );
    });

    it('should have rounded corners', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const progressBar = getByTestId('progress-bar');
      
      // Check for border radius
      expect(progressBar.props.style).toMatchObject(
        expect.objectContaining({
          borderRadius: expect.any(Number),
        })
      );
    });
  });

  describe('Filled Portion Styling', () => {
    it('should have mint color for filled portion', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      
      // Check for mint color
      expect(filledPortion.props.style).toMatchObject(
        expect.objectContaining({
          backgroundColor: expect.stringMatching(/mint|#98D8C8|#B2E0D8|#A8E6CF/i),
        })
      );
    });

    it('should have rounded corners matching container', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      
      // Check for border radius
      expect(filledPortion.props.style).toMatchObject(
        expect.objectContaining({
          borderRadius: expect.any(Number),
        })
      );
    });
  });

  describe('Progress Percentage - Filled Portion Width', () => {
    it('should show 0% width at 0% progress', () => {
      const { getByTestId } = render(
        <ProgressBar progress={0} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      
      // Check for 0% width
      expect(filledPortion.props.style).toMatchObject(
        expect.objectContaining({
          width: '0%',
        })
      );
    });

    it('should show 25% width at 25% progress', () => {
      const { getByTestId } = render(
        <ProgressBar progress={25} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      
      // Check for 25% width
      expect(filledPortion.props.style).toMatchObject(
        expect.objectContaining({
          width: '25%',
        })
      );
    });

    it('should show 50% width at 50% progress', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      
      // Check for 50% width
      expect(filledPortion.props.style).toMatchObject(
        expect.objectContaining({
          width: '50%',
        })
      );
    });

    it('should show 75% width at 75% progress', () => {
      const { getByTestId } = render(
        <ProgressBar progress={75} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      
      // Check for 75% width
      expect(filledPortion.props.style).toMatchObject(
        expect.objectContaining({
          width: '75%',
        })
      );
    });

    it('should show 100% width at 100% progress', () => {
      const { getByTestId } = render(
        <ProgressBar progress={100} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      
      // Check for 100% width
      expect(filledPortion.props.style).toMatchObject(
        expect.objectContaining({
          width: '100%',
        })
      );
    });

    it('should handle decimal progress values', () => {
      const { getByTestId } = render(
        <ProgressBar progress={33.33} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      
      // Check for 33.33% width
      expect(filledPortion.props.style).toMatchObject(
        expect.objectContaining({
          width: '33.33%',
        })
      );
    });
  });

  describe('Mini Turtle Icon Slider Positioning', () => {
    it('should position turtle at 0% when progress is 0', () => {
      const { getByTestId } = render(
        <ProgressBar progress={0} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check for 0% left position
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: '0%',
        })
      );
    });

    it('should position turtle at 25% when progress is 25', () => {
      const { getByTestId } = render(
        <ProgressBar progress={25} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check for 25% left position
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: '25%',
        })
      );
    });

    it('should position turtle at 50% when progress is 50', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check for 50% left position
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: '50%',
        })
      );
    });

    it('should position turtle at 75% when progress is 75', () => {
      const { getByTestId } = render(
        <ProgressBar progress={75} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check for 75% left position
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: '75%',
        })
      );
    });

    it('should position turtle at 100% when progress is 100', () => {
      const { getByTestId } = render(
        <ProgressBar progress={100} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check for 100% left position
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: '100%',
        })
      );
    });

    it('should position turtle with absolute positioning', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check for absolute positioning
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          position: 'absolute',
        })
      );
    });

    it('should handle decimal progress for turtle positioning', () => {
      const { getByTestId } = render(
        <ProgressBar progress={66.67} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check for 66.67% left position
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          left: '66.67%',
        })
      );
    });
  });

  describe('Turtle Icon Movement', () => {
    it('should move turtle rightward as progress increases', () => {
      const { getByTestId, rerender } = render(
        <ProgressBar progress={10} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      const initialPosition = parseFloat(turtleSlider.props.style.left);

      // Increase progress
      rerender(<ProgressBar progress={90} />);

      const newPosition = parseFloat(getByTestId('progress-bar-turtle-slider').props.style.left);
      
      // New position should be greater (more to the right)
      expect(newPosition).toBeGreaterThan(initialPosition);
    });

    it('should move turtle smoothly through incremental progress changes', () => {
      const { getByTestId, rerender } = render(
        <ProgressBar progress={0} />
      );

      let previousPosition = 0;

      // Simulate incremental progress
      for (let i = 10; i <= 100; i += 10) {
        rerender(<ProgressBar progress={i} />);
        
        const turtleSlider = getByTestId('progress-bar-turtle-slider');
        const currentPosition = parseFloat(turtleSlider.props.style.left);
        
        // Each position should be greater than the previous
        expect(currentPosition).toBeGreaterThanOrEqual(previousPosition);
        previousPosition = currentPosition;
      }
    });
  });

  describe('Props Handling', () => {
    it('should update filled portion when progress prop changes', () => {
      const { getByTestId, rerender } = render(
        <ProgressBar progress={25} />
      );

      let filledPortion = getByTestId('progress-bar-filled');
      expect(filledPortion.props.style.width).toBe('25%');

      // Update progress
      rerender(<ProgressBar progress={75} />);

      filledPortion = getByTestId('progress-bar-filled');
      expect(filledPortion.props.style.width).toBe('75%');
    });

    it('should update turtle position when progress prop changes', () => {
      const { getByTestId, rerender } = render(
        <ProgressBar progress={25} />
      );

      let turtleSlider = getByTestId('progress-bar-turtle-slider');
      expect(turtleSlider.props.style.left).toBe('25%');

      // Update progress
      rerender(<ProgressBar progress={75} />);

      turtleSlider = getByTestId('progress-bar-turtle-slider');
      expect(turtleSlider.props.style.left).toBe('75%');
    });
  });

  describe('Edge Cases', () => {
    it('should clamp progress below 0 to 0%', () => {
      const { getByTestId } = render(
        <ProgressBar progress={-10} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      expect(filledPortion.props.style.width).toBe('0%');
      expect(turtleSlider.props.style.left).toBe('0%');
    });

    it('should clamp progress above 100 to 100%', () => {
      const { getByTestId } = render(
        <ProgressBar progress={150} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      expect(filledPortion.props.style.width).toBe('100%');
      expect(turtleSlider.props.style.left).toBe('100%');
    });

    it('should handle NaN progress gracefully', () => {
      const { getByTestId } = render(
        <ProgressBar progress={NaN} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Should default to 0%
      expect(filledPortion.props.style.width).toBe('0%');
      expect(turtleSlider.props.style.left).toBe('0%');
    });

    it('should handle undefined progress gracefully', () => {
      const { getByTestId } = render(
        <ProgressBar progress={undefined as any} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Should default to 0%
      expect(filledPortion.props.style.width).toBe('0%');
      expect(turtleSlider.props.style.left).toBe('0%');
    });

    it('should handle very small decimal progress values', () => {
      const { getByTestId } = render(
        <ProgressBar progress={0.01} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      expect(filledPortion.props.style.width).toBe('0.01%');
      expect(turtleSlider.props.style.left).toBe('0.01%');
    });

    it('should handle very large decimal progress values', () => {
      const { getByTestId } = render(
        <ProgressBar progress={99.99} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      expect(filledPortion.props.style.width).toBe('99.99%');
      expect(turtleSlider.props.style.left).toBe('99.99%');
    });
  });

  describe('Turtle Icon Styling', () => {
    it('should render turtle icon as Image or emoji', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Should have children (icon/image)
      expect(turtleSlider.props.children).toBeDefined();
    });

    it('should have appropriate size for turtle icon', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const turtleSlider = getByTestId('progress-bar-turtle-slider');
      
      // Check for width and height
      expect(turtleSlider.props.style).toMatchObject(
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.accessible).toBeTruthy();
    });

    it('should have accessibility label with progress information', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.accessibilityLabel).toBeDefined();
      expect(progressBar.props.accessibilityLabel).toContain('50');
    });

    it('should update accessibility label when progress changes', () => {
      const { getByTestId, rerender } = render(
        <ProgressBar progress={25} />
      );

      let progressBar = getByTestId('progress-bar');
      const initialLabel = progressBar.props.accessibilityLabel;

      rerender(<ProgressBar progress={75} />);

      progressBar = getByTestId('progress-bar');
      const newLabel = progressBar.props.accessibilityLabel;

      expect(newLabel).not.toBe(initialLabel);
    });

    it('should have accessibility role', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.accessibilityRole).toBe('progressbar');
    });

    it('should have accessibility value with current progress', () => {
      const { getByTestId } = render(
        <ProgressBar progress={50} />
      );

      const progressBar = getByTestId('progress-bar');
      expect(progressBar.props.accessibilityValue).toMatchObject({
        now: 50,
        min: 0,
        max: 100,
      });
    });
  });

  describe('Performance', () => {
    it('should render efficiently with same props', () => {
      const { getByTestId, rerender } = render(
        <ProgressBar progress={50} />
      );

      const filledPortion = getByTestId('progress-bar-filled');
      const initialWidth = filledPortion.props.style.width;

      // Re-render with same props
      rerender(<ProgressBar progress={50} />);

      const afterRerender = getByTestId('progress-bar-filled').props.style.width;
      expect(afterRerender).toBe(initialWidth);
    });
  });
});
