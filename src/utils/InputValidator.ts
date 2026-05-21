export interface ValidationResult {
  valid: boolean;
  value?: number;
  errorType?: 'empty' | 'non-integer' | 'out-of-range';
}

export function validateTimeInput(input: string): ValidationResult {
  // Implementation will be added in Task 2.2 (GREEN phase)
  throw new Error('Not implemented yet');
}
