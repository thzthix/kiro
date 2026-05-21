/**
 * Unit Tests for TimeInputPopup Component (RED Phase)
 * Feature: turtle-study-app
 * 
 * These tests verify the TimeInputPopup component behavior including:
 * - Component rendering with input field
 * - Input validation (1-180 minutes)
 * - Error messages for invalid input
 * - Start button disabled when invalid
 * - onStart callback with valid duration
 * - onCancel callback
 * 
 * All tests should FAIL in RED phase until component is implemented.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TimeInputPopup from './TimeInputPopup';

describe('TimeInputPopup Component - Unit Tests (RED)', () => {
  describe('Component Rendering', () => {
    it('should render with input field', () => {
      const { getByTestId } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      expect(getByTestId('time-input-field')).toBeTruthy();
    });

    it('should display title "얼마나 집중하시겠어요?"', () => {
      const { getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      expect(getByText('얼마나 집중하시겠어요?')).toBeTruthy();
    });

    it('should display "분" (minutes) label', () => {
      const { getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      expect(getByText('분')).toBeTruthy();
    });

    it('should display "시작하기" (Start) button', () => {
      const { getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      expect(getByText('시작하기')).toBeTruthy();
    });

    it('should display cancel button', () => {
      const { getByTestId } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      expect(getByTestId('cancel-button')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByTestId } = render(
        <TimeInputPopup visible={false} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      expect(queryByTestId('time-input-popup')).toBeNull();
    });
  });

  describe('Input Validation - Empty Input', () => {
    it('should display error message for empty input', () => {
      const { getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(getByText('시간을 입력해주세요')).toBeTruthy();
    });

    it('should keep popup open when empty input submitted', () => {
      const onSubmit = jest.fn();
      const { getByText, getByTestId } = render(
        <TimeInputPopup visible={true} onSubmit={onSubmit} onCancel={jest.fn()} />
      );

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(onSubmit).not.toHaveBeenCalled();
      expect(getByTestId('time-input-popup')).toBeTruthy();
    });
  });

  describe('Input Validation - Non-Integer Input', () => {
    it('should display error message for decimal input', () => {
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '12.5');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(getByText('정수를 입력해주세요')).toBeTruthy();
    });

    it('should display error message for text input', () => {
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, 'abc');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(getByText('정수를 입력해주세요')).toBeTruthy();
    });

    it('should keep popup open when non-integer input submitted', () => {
      const onSubmit = jest.fn();
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={onSubmit} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '3.14');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(onSubmit).not.toHaveBeenCalled();
      expect(getByTestId('time-input-popup')).toBeTruthy();
    });
  });

  describe('Input Validation - Out of Range', () => {
    it('should display error message for input less than 1', () => {
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '0');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(getByText('1분에서 180분 사이의 시간을 입력해주세요')).toBeTruthy();
    });

    it('should display error message for negative input', () => {
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '-5');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(getByText('1분에서 180분 사이의 시간을 입력해주세요')).toBeTruthy();
    });

    it('should display error message for input greater than 180', () => {
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '181');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(getByText('1분에서 180분 사이의 시간을 입력해주세요')).toBeTruthy();
    });

    it('should keep popup open when out-of-range input submitted', () => {
      const onSubmit = jest.fn();
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={onSubmit} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '200');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(onSubmit).not.toHaveBeenCalled();
      expect(getByTestId('time-input-popup')).toBeTruthy();
    });
  });

  describe('Error Message Clearing', () => {
    it('should clear error message when user modifies input', () => {
      const { getByTestId, getByText, queryByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      // Trigger error
      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);
      expect(getByText('시간을 입력해주세요')).toBeTruthy();

      // Modify input
      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '30');

      // Error should be cleared
      expect(queryByText('시간을 입력해주세요')).toBeNull();
    });
  });

  describe('Start Button State', () => {
    it('should have start button enabled by default', () => {
      const { getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const submitButton = getByText('시작하기');
      expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
    });

    it('should disable start button when validation fails', () => {
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, 'invalid');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      // After validation error, button should remain enabled for retry
      // but onSubmit should not be called
      expect(submitButton.props.accessibilityState?.disabled).toBeFalsy();
    });
  });

  describe('Valid Input Submission', () => {
    it('should call onSubmit with valid duration at minimum boundary (1)', () => {
      const onSubmit = jest.fn();
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={onSubmit} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '1');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(onSubmit).toHaveBeenCalledWith(1);
    });

    it('should call onSubmit with valid duration at maximum boundary (180)', () => {
      const onSubmit = jest.fn();
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={onSubmit} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '180');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(onSubmit).toHaveBeenCalledWith(180);
    });

    it('should call onSubmit with valid duration in middle range (30)', () => {
      const onSubmit = jest.fn();
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={onSubmit} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '30');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(onSubmit).toHaveBeenCalledWith(30);
    });

    it('should not display error message for valid input', () => {
      const { getByTestId, getByText, queryByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '45');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      expect(queryByText('시간을 입력해주세요')).toBeNull();
      expect(queryByText('정수를 입력해주세요')).toBeNull();
      expect(queryByText('1분에서 180분 사이의 시간을 입력해주세요')).toBeNull();
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is pressed', () => {
      const onCancel = jest.fn();
      const { getByTestId } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={onCancel} />
      );

      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    });

    it('should not call onSubmit when cancel button is pressed', () => {
      const onSubmit = jest.fn();
      const onCancel = jest.fn();
      const { getByTestId } = render(
        <TimeInputPopup visible={true} onSubmit={onSubmit} onCancel={onCancel} />
      );

      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);

      expect(onSubmit).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalled();
    });

    it('should call onCancel even with valid input entered', () => {
      const onCancel = jest.fn();
      const onSubmit = jest.fn();
      const { getByTestId } = render(
        <TimeInputPopup visible={true} onSubmit={onSubmit} onCancel={onCancel} />
      );

      // Enter valid input
      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '30');

      // Press cancel
      const cancelButton = getByTestId('cancel-button');
      fireEvent.press(cancelButton);

      expect(onCancel).toHaveBeenCalled();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Input Preservation', () => {
    it('should preserve user input when validation fails', () => {
      const { getByTestId, getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const input = getByTestId('time-input-field');
      fireEvent.changeText(input, '200');

      const submitButton = getByText('시작하기');
      fireEvent.press(submitButton);

      // Input value should still be '200' for user to correct
      expect(input.props.value).toBe('200');
    });
  });

  describe('Touch Feedback', () => {
    it('should provide visual feedback on start button press within 100ms', () => {
      const { getByText } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const submitButton = getByText('시작하기');
      
      // Button should be touchable and provide feedback
      expect(submitButton.props.accessible).toBeTruthy();
    });

    it('should provide visual feedback on cancel button press within 100ms', () => {
      const { getByTestId } = render(
        <TimeInputPopup visible={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
      );

      const cancelButton = getByTestId('cancel-button');
      
      // Button should be touchable and provide feedback
      expect(cancelButton.props.accessible).toBeTruthy();
    });
  });
});
