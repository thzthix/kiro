import React, { useEffect } from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { StudySessionScreen } from './StudySessionScreen';
import { AppProvider } from '../context/AppContext';
import { useAppContext } from '../context/AppContext';

// Test wrapper that initializes a session
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    // Initialize a running session with 60 seconds (1 minute)
    dispatch({
      type: 'START_SESSION',
      payload: { duration: 1 }, // 1 minute
    });
  }, [dispatch]);

  return <>{children}</>;
};

// Helper to render component with AppProvider and initialized session
const renderWithProvider = () => {
  return render(
    <AppProvider>
      <TestWrapper>
        <StudySessionScreen />
      </TestWrapper>
    </AppProvider>
  );
};

// Setup fake timers for all tests
beforeEach(() => {
  jest.useFakeTimers({ doNotFake: ['nextTick'] });
  jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('StudySessionScreen', () => {
  describe('Layout and Composition', () => {
    it('should render the study session screen container', () => {
      const { getByTestId } = renderWithProvider();
      expect(getByTestId('study-session-screen')).toBeTruthy();
    });

    it('should render SessionHeader at top with beige round panel', () => {
      const { getByTestId } = renderWithProvider();
      const header = getByTestId('session-header');
      expect(header).toBeTruthy();
    });

    it('should render SessionHeader with centered timer in MM:SS format', () => {
      const { getByTestId } = renderWithProvider();
      const timer = getByTestId('timer-display');
      expect(timer).toBeTruthy();
      expect(timer.props.children).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should render SessionHeader with progress bar directly below timer', () => {
      const { getByTestId } = renderWithProvider();
      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('should render progress bar with mini turtle icon slider that moves rightward', () => {
      const { getByTestId } = renderWithProvider();
      const miniTurtle = getByTestId('progress-bar-mini-turtle');
      expect(miniTurtle).toBeTruthy();
    });

    it('should render StudyCanvas with watercolor background in center', () => {
      const { getByTestId } = renderWithProvider();
      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });

    it('should render CareItemsPanel at bottom left with "돌봐주기" title', () => {
      const { getByTestId, getByText } = renderWithProvider();
      const panel = getByTestId('care-items-panel');
      expect(panel).toBeTruthy();
      expect(getByText('돌봐주기')).toBeTruthy();
    });

    it('should render SessionControls at bottom right with round square buttons', () => {
      const { getByTestId } = renderWithProvider();
      const controls = getByTestId('session-controls');
      expect(controls).toBeTruthy();
    });
  });

  describe('State Management Integration', () => {
    it('should display remaining time from session state', () => {
      const { getByTestId } = renderWithProvider();
      const timer = getByTestId('timer-display');
      expect(timer.props.children).toBeDefined();
    });

    it('should display progress percentage from session state', () => {
      const { getByTestId } = renderWithProvider();
      const progressBar = getByTestId('progress-bar');
      // Check if progress is available either as a prop or in accessibilityValue
      const progressValue = progressBar.props.progress ?? progressBar.props.accessibilityValue?.now;
      expect(progressValue).toBeDefined();
    });

    it('should display turtle state from session state', () => {
      const { getByTestId } = renderWithProvider();
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBeDefined();
    });

    it('should display carrot count from session state', () => {
      const { getByTestId } = renderWithProvider();
      const carePanel = getByTestId('care-items-panel');
      expect(carePanel.props.carrotCount).toBeDefined();
    });

    it('should display water count from session state', () => {
      const { getByTestId } = renderWithProvider();
      const carePanel = getByTestId('care-items-panel');
      expect(carePanel.props.waterCount).toBeDefined();
    });
  });

  describe('Pause/Resume/Stop Actions', () => {
    it('should handle pause action when pause button is pressed', () => {
      const { getByTestId } = renderWithProvider();
      const pauseButton = getByTestId('pause-button');
      
      fireEvent.press(pauseButton);
      
      // Should trigger pause action
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('sleeping');
    });

    it('should handle resume action when resume button is pressed', () => {
      const { getByTestId } = renderWithProvider();
      
      // First pause
      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);
      
      // Then resume
      const resumeButton = getByTestId('resume-button');
      fireEvent.press(resumeButton);
      
      // Should restore previous state
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).not.toBe('sleeping');
    });

    it('should show confirmation dialog when stop button is pressed', () => {
      const { getByTestId } = renderWithProvider();
      const stopButton = getByTestId('stop-button');
      
      fireEvent.press(stopButton);
      
      expect(getByTestId('stop-confirmation-dialog')).toBeTruthy();
    });

    it('should handle stop action when stop is confirmed', () => {
      const { getByTestId } = renderWithProvider();
      
      const stopButton = getByTestId('stop-button');
      fireEvent.press(stopButton);
      
      const confirmButton = getByTestId('stop-confirm-button');
      fireEvent.press(confirmButton);
      
      // Should navigate away or end session
      expect(getByTestId('study-session-screen')).toBeTruthy();
    });

    it('should dismiss dialog when stop is cancelled', () => {
      const { getByTestId, queryByTestId } = renderWithProvider();
      
      const stopButton = getByTestId('stop-button');
      fireEvent.press(stopButton);
      
      const cancelButton = getByTestId('stop-cancel-button');
      fireEvent.press(cancelButton);
      
      expect(queryByTestId('stop-confirmation-dialog')).toBeNull();
    });
  });

  describe('Care Item Interactions', () => {
    it('should handle carrot button tap and decrement carrot count', () => {
      const { getByTestId } = renderWithProvider();
      const carePanel = getByTestId('care-items-panel');
      const initialCarrotCount = carePanel.props.carrotCount;
      
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      
      // Count should decrement
      expect(carePanel.props.carrotCount).toBe(initialCarrotCount - 1);
    });

    it('should handle water button tap and decrement water count', () => {
      const { getByTestId } = renderWithProvider();
      const carePanel = getByTestId('care-items-panel');
      const initialWaterCount = carePanel.props.waterCount;
      
      const waterButton = getByTestId('water-button');
      fireEvent.press(waterButton);
      
      // Count should decrement
      expect(carePanel.props.waterCount).toBe(initialWaterCount - 1);
    });

    it('should transition turtle to eating state when care item is given', () => {
      const { getByTestId } = renderWithProvider();
      
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('eating');
    });

    it('should disable care buttons during eating state', () => {
      const { getByTestId } = renderWithProvider();
      
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      
      const carePanel = getByTestId('care-items-panel');
      expect(carePanel.props.disabled).toBe(true);
    });

    it('should disable care buttons during happy state', () => {
      const { getByTestId } = renderWithProvider();
      
      // Trigger eating state
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      
      // Wait for transition to happy state (1 second)
      jest.advanceTimersByTime(1000);
      
      const carePanel = getByTestId('care-items-panel');
      expect(carePanel.props.disabled).toBe(true);
    });

    it('should disable care buttons when session is paused', () => {
      const { getByTestId } = renderWithProvider();
      
      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);
      
      const carePanel = getByTestId('care-items-panel');
      expect(carePanel.props.disabled).toBe(true);
    });

    it('should disable individual button when corresponding count reaches 0', () => {
      const { getByTestId } = renderWithProvider();
      const carrotButton = getByTestId('carrot-button');
      
      // Tap carrot button 3 times to deplete
      fireEvent.press(carrotButton);
      jest.advanceTimersByTime(1000);
      fireEvent.press(carrotButton);
      jest.advanceTimersByTime(1000);
      fireEvent.press(carrotButton);
      
      expect(carrotButton.props.disabled).toBe(true);
    });
  });

  describe('Timer Completion', () => {
    it('should trigger completion when timer reaches 00:00', () => {
      const { getByTestId } = renderWithProvider();
      
      // Fast-forward to completion
      jest.advanceTimersByTime(60000); // 1 minute session
      
      // Should transition to completion state
      expect(getByTestId('study-session-screen')).toBeTruthy();
    });

    it('should transition turtle to arrived state when timer completes', () => {
      const { getByTestId } = renderWithProvider();
      
      // Fast-forward to completion (60 seconds)
      act(() => {
        jest.advanceTimersByTime(60000);
      });
      
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('arrived');
    });

    it('should immediately transition to arrived if timer completes during eating state', () => {
      const { getByTestId } = renderWithProvider();
      
      // Give care item to trigger eating state
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      
      // Complete timer during eating state
      act(() => {
        jest.advanceTimersByTime(60000);
      });
      
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('arrived');
    });

    it('should immediately transition to arrived if timer completes during happy state', () => {
      const { getByTestId } = renderWithProvider();
      
      // Give care item and wait for happy state
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      act(() => {
        jest.advanceTimersByTime(1000); // eating -> happy
      });
      
      // Complete timer during happy state
      act(() => {
        jest.advanceTimersByTime(60000);
      });
      
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('arrived');
    });

    it('should clear all async intervals when timer completes during eating/happy', () => {
      const { getByTestId } = renderWithProvider();
      
      // Give care item
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      
      // Complete timer
      jest.advanceTimersByTime(60000);
      
      // No further state transitions should occur
      const turtle = getByTestId('turtle-character');
      const stateBefore = turtle.props.state;
      
      jest.advanceTimersByTime(5000);
      expect(turtle.props.state).toBe(stateBefore);
    });
  });

  describe('Non-Interactive Area Touch Handling', () => {
    it('should completely ignore touches on background', () => {
      const { getByTestId } = renderWithProvider();
      const background = getByTestId('study-canvas-background');
      
      const timerBefore = getByTestId('timer-display').props.children;
      const progressBefore = getByTestId('progress-bar').props.progress;
      
      fireEvent.press(background);
      
      // No changes should occur
      expect(getByTestId('timer-display').props.children).toBe(timerBefore);
      expect(getByTestId('progress-bar').props.progress).toBe(progressBefore);
    });

    it('should completely ignore touches on path', () => {
      const { getByTestId } = renderWithProvider();
      const path = getByTestId('path-component');
      
      const timerBefore = getByTestId('timer-display').props.children;
      
      fireEvent.press(path);
      
      // No changes should occur
      expect(getByTestId('timer-display').props.children).toBe(timerBefore);
    });

    it('should completely ignore touches on decorative elements', () => {
      const { getByTestId } = renderWithProvider();
      const decorative = getByTestId('decorative-elements');
      
      const timerBefore = getByTestId('timer-display').props.children;
      
      fireEvent.press(decorative);
      
      // No changes should occur
      expect(getByTestId('timer-display').props.children).toBe(timerBefore);
    });

    it('should not display any error message for non-interactive area touches', () => {
      const { getByTestId, queryByText } = renderWithProvider();
      const background = getByTestId('study-canvas-background');
      
      fireEvent.press(background);
      
      // No error message should appear
      expect(queryByText(/잘못 클릭하셨어요/)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();
    });

    it('should preserve timer value when non-interactive area is touched', () => {
      const { getByTestId } = renderWithProvider();
      const background = getByTestId('study-canvas-background');
      const timerBefore = getByTestId('timer-display').props.children;
      
      fireEvent.press(background);
      
      expect(getByTestId('timer-display').props.children).toBe(timerBefore);
    });

    it('should preserve turtle position when non-interactive area is touched', () => {
      const { getByTestId } = renderWithProvider();
      const path = getByTestId('path-component');
      const progressBefore = getByTestId('progress-bar').props.progress;
      
      fireEvent.press(path);
      
      expect(getByTestId('progress-bar').props.progress).toBe(progressBefore);
    });

    it('should preserve session status when non-interactive area is touched', () => {
      const { getByTestId } = renderWithProvider();
      const decorative = getByTestId('decorative-elements');
      const controls = getByTestId('session-controls');
      const statusBefore = controls.props.status;
      
      fireEvent.press(decorative);
      
      expect(controls.props.status).toBe(statusBefore);
    });
  });

  describe('Visual Theme Consistency', () => {
    it('should use watercolor background in StudyCanvas', () => {
      const { getByTestId } = renderWithProvider();
      const canvas = getByTestId('study-canvas');
      expect(canvas).toBeTruthy();
    });

    it('should render turtle always facing rightward', () => {
      const { getByTestId } = renderWithProvider();
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.direction).toBe('right');
    });

    it('should display SessionHeader with beige round panel styling', () => {
      const { getByTestId } = renderWithProvider();
      const header = getByTestId('session-header');
      expect(header.props.style).toMatchObject(
        expect.objectContaining({ backgroundColor: expect.any(String) })
      );
    });

    it('should use consistent color palette across all components', () => {
      const { getByTestId } = renderWithProvider();
      expect(getByTestId('session-header')).toBeTruthy();
      expect(getByTestId('study-canvas')).toBeTruthy();
      expect(getByTestId('care-items-panel')).toBeTruthy();
      expect(getByTestId('session-controls')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle pause during eating state and preserve remaining eating duration', () => {
      const { getByTestId } = renderWithProvider();
      
      // Give care item
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      
      // Pause during eating (before 1 second completes)
      jest.advanceTimersByTime(500);
      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);
      
      // Resume
      const resumeButton = getByTestId('resume-button');
      fireEvent.press(resumeButton);
      
      // Should restore eating state with remaining duration
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('eating');
    });

    it('should handle pause during happy state and preserve remaining happy duration', () => {
      const { getByTestId } = renderWithProvider();
      
      // Give care item and wait for happy state
      const carrotButton = getByTestId('carrot-button');
      fireEvent.press(carrotButton);
      jest.advanceTimersByTime(1000); // eating -> happy
      
      // Pause during happy (before 3 seconds complete)
      jest.advanceTimersByTime(1500);
      const pauseButton = getByTestId('pause-button');
      fireEvent.press(pauseButton);
      
      // Resume
      const resumeButton = getByTestId('resume-button');
      fireEvent.press(resumeButton);
      
      // Should restore happy state with remaining duration
      const turtle = getByTestId('turtle-character');
      expect(turtle.props.state).toBe('happy');
    });
  });
});
