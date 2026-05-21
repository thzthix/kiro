/**
 * TimeInputPopup Component (REFACTOR Phase)
 * 
 * A modal popup that collects study duration from the user with validation.
 * Validates input (integer, 1-180 minutes range, non-empty).
 * Shows error messages for invalid input.
 * Provides submit and cancel actions.
 */

import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { validateTimeInput, ValidationErrorType } from '../utils/InputValidator';

/**
 * Props for the TimeInputPopup component
 */
interface TimeInputPopupProps {
  /** Controls the visibility of the popup */
  visible: boolean;
  /** Callback invoked when user submits a valid duration */
  onSubmit: (duration: number) => void;
  /** Callback invoked when user cancels the input */
  onCancel: () => void;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Error messages displayed for different validation failures
 */
const ERROR_MESSAGES: Record<ValidationErrorType, string> = {
  empty: '시간을 입력해주세요',
  'non-integer': '정수를 입력해주세요',
  'out-of-range': '1분에서 180분 사이의 시간을 입력해주세요',
};

/**
 * UI text constants
 */
const UI_TEXT = {
  TITLE: '얼마나 집중하시겠어요?',
  UNIT_LABEL: '분',
  SUBMIT_BUTTON: '시작하기',
  CANCEL_BUTTON: '취소',
  INPUT_PLACEHOLDER: '시간 입력',
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets the appropriate error message for a validation error type
 * @param errorType - The type of validation error
 * @returns The localized error message
 */
const getErrorMessage = (errorType: ValidationErrorType): string => {
  return ERROR_MESSAGES[errorType];
};

/**
 * Resets the input state to initial values
 * @param setInputValue - State setter for input value
 * @param setErrorMessage - State setter for error message
 */
const resetInputState = (
  setInputValue: (value: string) => void,
  setErrorMessage: (message: string | null) => void
): void => {
  setInputValue('');
  setErrorMessage(null);
};

// ============================================================================
// Component
// ============================================================================

/**
 * TimeInputPopup component for collecting study duration from user
 * 
 * Features:
 * - Input validation (1-180 minutes, integer only)
 * - Error message display
 * - Auto-clear error on input change
 * - Submit and cancel actions
 * 
 * @param props - Component props
 * @returns The rendered popup component or null if not visible
 */
const TimeInputPopup: React.FC<TimeInputPopupProps> = ({ visible, onSubmit, onCancel }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handles input text changes and clears any existing error message
   * @param text - The new input text
   */
  const handleInputChange = (text: string): void => {
    setInputValue(text);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  /**
   * Validates input and submits if valid, otherwise displays error message
   */
  const handleSubmit = (): void => {
    const validationResult = validateTimeInput(inputValue);

    if (!validationResult.valid) {
      setErrorMessage(getErrorMessage(validationResult.errorType!));
      return;
    }

    onSubmit(validationResult.value!);
  };

  /**
   * Resets input state and invokes the cancel callback
   */
  const handleCancel = (): void => {
    resetInputState(setInputValue, setErrorMessage);
    onCancel();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      testID="time-input-popup"
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>{UI_TEXT.TITLE}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              testID="time-input-field"
              style={styles.input}
              value={inputValue}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              placeholder={UI_TEXT.INPUT_PLACEHOLDER}
              accessible={true}
            />
            <Text style={styles.unitLabel}>{UI_TEXT.UNIT_LABEL}</Text>
          </View>

          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              testID="cancel-button"
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              accessible={true}
            >
              <Text style={styles.cancelButtonText}>{UI_TEXT.CANCEL_BUTTON}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              accessible={true}
              accessibilityState={{ disabled: false }}
            >
              <Text style={styles.submitButtonText} accessible={true}>{UI_TEXT.SUBMIT_BUTTON}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================================
// Style Constants
// ============================================================================

/**
 * Color palette used in the component
 */
const COLORS = {
  BEIGE: '#F5F1E8',
  OLIVE_GREEN: '#4A5D3F',
  WHITE: '#FFFFFF',
  BORDER: '#D4C5B0',
  TEXT_DARK: '#333333',
  ERROR: '#D32F2F',
  CANCEL_BG: '#E8E8E8',
  CANCEL_TEXT: '#666666',
  MINT: '#9BC4BC',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  SHADOW: '#000',
} as const;

/**
 * Spacing and sizing constants
 */
const DIMENSIONS = {
  BORDER_RADIUS: 20,
  BORDER_RADIUS_SMALL: 12,
  PADDING: 24,
  PADDING_HORIZONTAL: 16,
  PADDING_VERTICAL: 12,
  MAX_WIDTH: 400,
  MIN_TOUCH_TARGET: 44,
  BUTTON_GAP: 12,
} as const;

/**
 * Typography constants
 */
const TYPOGRAPHY = {
  TITLE_SIZE: 20,
  INPUT_SIZE: 18,
  UNIT_SIZE: 18,
  ERROR_SIZE: 14,
  BUTTON_SIZE: 16,
} as const;

// ============================================================================
// Styles
// ============================================================================

/**
 * Component styles
 */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: COLORS.BEIGE,
    borderRadius: DIMENSIONS.BORDER_RADIUS,
    padding: DIMENSIONS.PADDING,
    width: '80%',
    maxWidth: DIMENSIONS.MAX_WIDTH,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: TYPOGRAPHY.TITLE_SIZE,
    fontWeight: '600',
    color: COLORS.OLIVE_GREEN,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: DIMENSIONS.BORDER_RADIUS_SMALL,
    paddingHorizontal: DIMENSIONS.PADDING_HORIZONTAL,
    paddingVertical: DIMENSIONS.PADDING_VERTICAL,
    fontSize: TYPOGRAPHY.INPUT_SIZE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    color: COLORS.TEXT_DARK,
  },
  unitLabel: {
    fontSize: TYPOGRAPHY.UNIT_SIZE,
    color: COLORS.OLIVE_GREEN,
    marginLeft: 8,
    fontWeight: '500',
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: TYPOGRAPHY.ERROR_SIZE,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: DIMENSIONS.BUTTON_GAP,
  },
  button: {
    flex: 1,
    paddingVertical: DIMENSIONS.PADDING_VERTICAL,
    borderRadius: DIMENSIONS.BORDER_RADIUS_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: DIMENSIONS.MIN_TOUCH_TARGET,
  },
  cancelButton: {
    backgroundColor: COLORS.CANCEL_BG,
  },
  cancelButtonText: {
    color: COLORS.CANCEL_TEXT,
    fontSize: TYPOGRAPHY.BUTTON_SIZE,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.MINT,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.BUTTON_SIZE,
    fontWeight: '600',
  },
});

export default TimeInputPopup;
