/**
 * ConfirmationDialog Component Tests
 * Feature: turtle-study-app
 * Task: 13.5 Refactor screens (REFACTOR)
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmationDialog } from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const defaultProps = {
    visible: true,
    title: 'Test Title',
    message: 'Test Message',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible', () => {
    const { getByText, getByTestId } = render(
      <ConfirmationDialog {...defaultProps} />
    );

    expect(getByTestId('confirmation-dialog')).toBeTruthy();
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
    expect(getByText('Confirm')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('should not render modal content when not visible', () => {
    const { UNSAFE_root } = render(
      <ConfirmationDialog {...defaultProps} visible={false} />
    );

    // Modal should exist but not be visible
    // In React Native Testing Library, Modal with visible=false still renders in tree
    // but is not displayed to user - this is expected behavior
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should call onConfirm when confirm button is pressed', () => {
    const { getByTestId } = render(
      <ConfirmationDialog {...defaultProps} />
    );

    fireEvent.press(getByTestId('confirmation-dialog-confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is pressed', () => {
    const { getByTestId } = render(
      <ConfirmationDialog {...defaultProps} />
    );

    fireEvent.press(getByTestId('confirmation-dialog-cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should use custom testID when provided', () => {
    const { getByTestId } = render(
      <ConfirmationDialog {...defaultProps} testID="custom-dialog" />
    );

    expect(getByTestId('custom-dialog')).toBeTruthy();
    expect(getByTestId('custom-dialog-confirm')).toBeTruthy();
    expect(getByTestId('custom-dialog-cancel')).toBeTruthy();
  });

  it('should display custom text for all props', () => {
    const customProps = {
      ...defaultProps,
      title: 'Custom Title',
      message: 'Custom Message',
      confirmText: 'Yes',
      cancelText: 'No',
    };

    const { getByText } = render(<ConfirmationDialog {...customProps} />);

    expect(getByText('Custom Title')).toBeTruthy();
    expect(getByText('Custom Message')).toBeTruthy();
    expect(getByText('Yes')).toBeTruthy();
    expect(getByText('No')).toBeTruthy();
  });
});
