/**
 * TimeInputPopup Component
 * Feature: turtle-study-app
 * 
 * Modal popup for time input with validation (1-180 minutes).
 * Displays error messages for invalid input and calls onSubmit with valid duration.
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { validateTimeInput } from '../utils/InputValidator';

interface TimeInputPopupProps {
  visible: boolean;
  onSubmit: (duration: number) => void;
  onCancel: () => void;
}

const TimeInputPopup: React.FC<TimeInputPopupProps> = ({
  visible,
  onSubmit,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleInputChange = (text: string): void => {
    setInputValue(text);
    // Clear error when user modifies input
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (): void => {
    const validation = validateTimeInput(inputValue);

    if (!validation.valid) {
      // Display error message based on error type
      switch (validation.errorType) {
        case 'empty':
          setErrorMessage('시간을 입력해주세요');
          break;
        case 'non-integer':
          setErrorMessage('정수를 입력해주세요');
          break;
        case 'out-of-range':
          setErrorMessage('1분에서 180분 사이의 시간을 입력해주세요');
          break;
        default:
          setErrorMessage('올바른 시간을 입력해주세요');
      }
      return;
    }

    // Valid input - call onSubmit with duration
    onSubmit(validation.value!);
    
    // Reset state
    setInputValue('');
    setErrorMessage('');
  };

  const handleCancel = (): void => {
    // Reset state
    setInputValue('');
    setErrorMessage('');
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
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay} testID="time-input-popup" {...{ visible }}>
        <View style={styles.popup}>
          <Text style={styles.title}>얼마나 집중하시겠어요?</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              testID="time-input-field"
              value={inputValue}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor="#999"
              maxLength={3}
              accessible={true}
              accessibilityLabel="시간 입력"
            />
            <Text style={styles.unit}>분</Text>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              testID="cancel-button"
              accessible={true}
              accessibilityLabel="취소"
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              testID="submit-button"
              accessible={true}
              accessibilityLabel="시작하기"
              accessibilityRole="button"
              accessibilityState={{ disabled: false }}
            >
              <Text style={styles.submitButtonText}>시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#8FBC8F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
    textAlign: 'center',
  },
  unit: {
    fontSize: 24,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#E74C3C',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#8FBC8F',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default TimeInputPopup;
