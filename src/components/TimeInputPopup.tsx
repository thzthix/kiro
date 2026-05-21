/**
 * TimeInputPopup Component (STUB - RED Phase)
 * 
 * This is a minimal stub to allow tests to run and fail.
 * Component will be implemented in GREEN phase.
 */

import React from 'react';

interface TimeInputPopupProps {
  visible: boolean;
  onSubmit: (duration: number) => void;
  onCancel: () => void;
}

const TimeInputPopup: React.FC<TimeInputPopupProps> = ({ visible: _visible, onSubmit: _onSubmit, onCancel: _onCancel }) => {
  // Stub implementation - returns null to make all tests fail
  return null;
};

export default TimeInputPopup;
