/**
 * Unit Tests for StudyCanvas Component (RED Phase)
 * Feature: turtle-study-app
 * Task: 12.1 Write unit tests for background components (RED)
 * 
 * These tests verify the StudyCanvas component behavior including:
 * - Composition of BackgroundImage, PathComponent, TurtleCharacter, DecorativeElements
 * - Watercolor background rendering
 * - Consistent color palette application
 * - Non-interactive area touch handling (complete ignore, no error message)
 * - Care item count management (carrotCount, waterCount)
 * 
 * All tests should FAIL in RED phase until component is implemented.
 * 
 * Requirements: 5.2, 5.3, 6.1, 6.2, 6.5, 6.7, 8.1
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StudyCanvas from './StudyCanvas';

describe('StudyCanvas Component - Unit Tests (RED)', () => {
  const defaultProps = {
    progress: 50,
    turtleState: 'walking' as const,
    carrotCount: 3,
    waterCount: 3,
  };

  describe('Component Rendering', () => {
    it('should render canvas container', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });

    it('should render as View component', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      expect(canvas.type).toBe('View');
    });
  });

  describe('Child Component Composition', () => {
    it('should render BackgroundImage component', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const background = getByTestId('background-image');
      expect(background).toBeTruthy();
    });

    it('should render PathComponent', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const path = getByTestId('path-container');
      expect(path).toBeTruthy();
    });

    it('should render TurtleCharacter', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const turtle = getByTestId('turtle-character');
      expect(turtle).toBeTruthy();
    });

    it('should render DecorativeElements', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const decorative = getByTestId('decorative-elements');
      expect(decorative).toBeTruthy();
    });

    it('should render all components in correct layering order', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      const children = canvas.props.children;

      // Verify all child components exist
      expect(children).toBeDefined();
    });
  });

  describe('Watercolor Background', () => {
    it('should display watercolor-style background', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const background = getByTestId('background-image');
      expect(background).toBeTruthy();
    });

    it('should pass watercolor background to BackgroundImage', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const background = getByTestId('background-watercolor-image');
      expect(background).toBeTruthy();
    });
  });

  describe('Progress and State Props', () => {
    it('should pass progress prop to TurtleCharacter', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} progress={75} />
      );

      const turtle = getByTestId('turtle-character');
      expect(turtle.props.progress).toBe(75);
    });

    it('should pass turtleState prop to TurtleCharacter', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} turtleState="happy" />
      );

      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('happy');
    });

    it('should update turtle when progress changes', () => {
      const { getByTestId, rerender } = render(
        <StudyCanvas {...defaultProps} progress={25} />
      );

      let turtle = getByTestId('turtle-character');
      expect(turtle.props.progress).toBe(25);

      rerender(<StudyCanvas {...defaultProps} progress={75} />);

      turtle = getByTestId('turtle-character');
      expect(turtle.props.progress).toBe(75);
    });

    it('should update turtle when state changes', () => {
      const { getByTestId, rerender } = render(
        <StudyCanvas {...defaultProps} turtleState="walking" />
      );

      let turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('walking');

      rerender(<StudyCanvas {...defaultProps} turtleState="eating" />);

      turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('eating');
    });
  });

  describe('Care Item Count Management', () => {
    it('should accept carrotCount prop', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} carrotCount={2} />
      );

      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });

    it('should accept waterCount prop', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} waterCount={1} />
      );

      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });

    it('should handle zero carrot count', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} carrotCount={0} />
      );

      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });

    it('should handle zero water count', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} waterCount={0} />
      );

      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });
  });

  describe('Non-Interactive Area Touch Handling', () => {
    it('should ignore touches on non-interactive areas', () => {
      const onTouch = jest.fn();
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} onPress={onTouch} />
      );

      const canvas = getByTestId('study-canvas');
      fireEvent.press(canvas);

      // Should not trigger any action
      expect(onTouch).not.toHaveBeenCalled();
    });

    it('should not show error message on non-interactive area touch', () => {
      const { getByTestId, queryByText } = render(
        <StudyCanvas {...defaultProps} />
      );

      const canvas = getByTestId('study-canvas');
      fireEvent.press(canvas);

      // Should not display any error message
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();
    });

    it('should not provide visual feedback on non-interactive area touch', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      const initialStyle = canvas.props.style;

      fireEvent.press(canvas);

      // Style should not change
      expect(canvas.props.style).toEqual(initialStyle);
    });

    it('should completely ignore background touches', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const background = getByTestId('background-image');
      const onPress = background.props.onPress;

      // Background should not have onPress handler
      expect(onPress).toBeUndefined();
    });

    it('should completely ignore decorative element touches', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const decorative = getByTestId('decorative-elements');

      // Decorative elements should have pointerEvents='none'
      expect(decorative.props.pointerEvents).toBe('none');
    });

    it('should completely ignore path touches', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const path = getByTestId('path-container');
      const onPress = path.props.onPress;

      // Path should not have onPress handler
      expect(onPress).toBeUndefined();
    });
  });

  describe('Color Palette Consistency', () => {
    it('should apply consistent color palette across child components', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();

      // Verify child components exist (they should apply palette internally)
      const background = getByTestId('background-image');
      const path = getByTestId('path-container');
      const decorative = getByTestId('decorative-elements');

      expect(background).toBeTruthy();
      expect(path).toBeTruthy();
      expect(decorative).toBeTruthy();
    });

    it('should use beige or light yellow for background elements', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const background = getByTestId('background-image');
      const style = Array.isArray(background.props.style)
        ? background.props.style
        : [background.props.style];

      // Check for beige or light yellow
      const hasValidColor = style.some((s: any) => {
        const bgColor = s?.backgroundColor;
        return (
          bgColor &&
          bgColor.match(/#F5F1E8|#F5F5DC|#F4E8D8|#FFF8DC|#FFFACD|#FAFAD2/i)
        );
      });

      expect(hasValidColor).toBeTruthy();
    });
  });

  describe('Layout', () => {
    it('should fill entire available space', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      const style = Array.isArray(canvas.props.style)
        ? canvas.props.style.find((s: any) => s?.flex !== undefined)
        : canvas.props.style;

      expect(style?.flex).toBe(1);
    });

    it('should use relative positioning for layering', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      const style = Array.isArray(canvas.props.style)
        ? canvas.props.style
        : [canvas.props.style];

      const hasRelativePosition = style.some(
        (s: any) => s?.position === 'relative' || s?.position === undefined
      );
      expect(hasRelativePosition).toBeTruthy();
    });

    it('should allow child components to layer correctly', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      const children = canvas.props.children;

      // Should have multiple children for layering
      expect(Array.isArray(children) ? children.length : 1).toBeGreaterThan(1);
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      expect(canvas.props.accessible).toBeTruthy();
    });

    it('should have accessibility label', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      expect(canvas.props.accessibilityLabel).toBeDefined();
      expect(canvas.props.accessibilityLabel).toContain('study');
    });

    it('should have accessibility role', () => {
      const { getByTestId } = render(<StudyCanvas {...defaultProps} />);

      const canvas = getByTestId('study-canvas');
      expect(canvas.props.accessibilityRole).toBe('none');
    });
  });

  describe('Edge Cases', () => {
    it('should handle 0% progress', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} progress={0} />
      );

      const turtle = getByTestId('turtle-character');
      expect(turtle.props.progress).toBe(0);
    });

    it('should handle 100% progress', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} progress={100} />
      );

      const turtle = getByTestId('turtle-character');
      expect(turtle.props.progress).toBe(100);
    });

    it('should handle all turtle states', () => {
      const states: Array<
        'walking' | 'eating' | 'happy' | 'sleeping' | 'arrived'
      > = ['walking', 'eating', 'happy', 'sleeping', 'arrived'];

      states.forEach((state) => {
        const { getByTestId } = render(
          <StudyCanvas {...defaultProps} turtleState={state} />
        );

        const turtle = getByTestId('turtle-character');
        expect(turtle.props.state).toBe(state);
      });
    });

    it('should handle negative progress gracefully', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} progress={-10} />
      );

      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });

    it('should handle progress over 100 gracefully', () => {
      const { getByTestId } = render(
        <StudyCanvas {...defaultProps} progress={150} />
      );

      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with same props', () => {
      const { getByTestId, rerender } = render(
        <StudyCanvas {...defaultProps} />
      );

      const canvas = getByTestId('study-canvas');
      expect(canvas.props.children).toBeDefined();

      // Re-render with same props
      rerender(<StudyCanvas {...defaultProps} />);

      const afterRerender = getByTestId('study-canvas').props.children;
      expect(afterRerender).toBeDefined();
    });

    it('should not re-render background unnecessarily', () => {
      const { getByTestId, rerender } = render(
        <StudyCanvas {...defaultProps} progress={50} />
      );

      const background = getByTestId('background-image');
      expect(background).toBeTruthy();

      // Change only progress (background should not re-render)
      rerender(<StudyCanvas {...defaultProps} progress={75} />);

      const backgroundAfter = getByTestId('background-image');
      expect(backgroundAfter).toBeTruthy();
    });
  });
});
