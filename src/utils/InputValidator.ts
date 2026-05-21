export interface ValidationResult {
  valid: boolean;
  value?: number;
  errorType?: 'empty' | 'non-integer' | 'out-of-range';
}

export function validateTimeInput(input: string): ValidationResult {
  // Check for empty or whitespace-only input
  const trimmedInput = input.trim();
  if (trimmedInput === '') {
    return {
      valid: false,
      errorType: 'empty',
    };
  }

  // Check if input is a valid integer format (positive or negative integers)
  // Pattern: optional minus sign followed by digits only
  const integerPattern = /^-?\d+$/;
  if (!integerPattern.test(trimmedInput)) {
    return {
      valid: false,
      errorType: 'non-integer',
    };
  }

  // Parse the integer value
  const value = parseInt(trimmedInput, 10);

  // Check if value is in valid range [1, 180]
  if (value < 1 || value > 180) {
    return {
      valid: false,
      errorType: 'out-of-range',
    };
  }

  // Valid input
  return {
    valid: true,
    value: value,
  };
}
