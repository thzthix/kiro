// Validation constants
const MIN_DURATION_MINUTES = 1;
const MAX_DURATION_MINUTES = 180;
const INTEGER_PATTERN = /^-?\d+$/;

export interface ValidationResult {
  valid: boolean;
  value?: number;
  errorType?: 'empty' | 'non-integer' | 'out-of-range';
}

/**
 * Validates time input for study session duration.
 * 
 * @param input - User input string to validate
 * @returns ValidationResult with valid flag, parsed value (if valid), and error type (if invalid)
 * 
 * Validation rules:
 * - Must not be empty or whitespace-only
 * - Must be a valid integer (no decimals, letters, or special characters)
 * - Must be in range [1, 180] minutes inclusive
 */
export function validateTimeInput(input: string): ValidationResult {
  const trimmedInput = input.trim();

  if (isEmpty(trimmedInput)) {
    return createErrorResult('empty');
  }

  if (!isInteger(trimmedInput)) {
    return createErrorResult('non-integer');
  }

  const value = parseInt(trimmedInput, 10);

  if (!isInValidRange(value)) {
    return createErrorResult('out-of-range');
  }

  return createSuccessResult(value);
}

/**
 * Checks if input is empty or whitespace-only.
 */
function isEmpty(input: string): boolean {
  return input === '';
}

/**
 * Checks if input matches integer format (optional minus sign followed by digits).
 */
function isInteger(input: string): boolean {
  return INTEGER_PATTERN.test(input);
}

/**
 * Checks if value is within valid duration range [1, 180] minutes.
 */
function isInValidRange(value: number): boolean {
  return value >= MIN_DURATION_MINUTES && value <= MAX_DURATION_MINUTES;
}

/**
 * Creates a validation error result.
 */
function createErrorResult(
  errorType: 'empty' | 'non-integer' | 'out-of-range'
): ValidationResult {
  return {
    valid: false,
    errorType,
  };
}

/**
 * Creates a validation success result.
 */
function createSuccessResult(value: number): ValidationResult {
  return {
    valid: true,
    value,
  };
}
