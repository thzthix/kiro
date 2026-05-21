import * as fc from 'fast-check';
import { validateTimeInput } from './InputValidator';

describe('InputValidator - Property-Based Tests', () => {
  describe('Property 2: Non-Integer Input Rejected', () => {
    it('should reject non-integer string inputs', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string().filter((s) => !/^\d+$/.test(s) && s !== ''),
            fc.double().map((n) => n.toString()),
            fc.constantFrom('12.5', '3.14', 'abc', '12a', 'a12', '1 2')
          ),
          (input) => {
            const result = validateTimeInput(input);
            expect(result.valid).toBe(false);
            expect(result.errorType).toBe('non-integer');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3: Out-of-Range Integer Rejected', () => {
    it('should reject integers less than 1', () => {
      fc.assert(
        fc.property(fc.integer({ max: 0 }), (num) => {
          const result = validateTimeInput(num.toString());
          expect(result.valid).toBe(false);
          expect(result.errorType).toBe('out-of-range');
        }),
        { numRuns: 100 }
      );
    });

    it('should reject integers greater than 180', () => {
      fc.assert(
        fc.property(fc.integer({ min: 181 }), (num) => {
          const result = validateTimeInput(num.toString());
          expect(result.valid).toBe(false);
          expect(result.errorType).toBe('out-of-range');
        }),
        { numRuns: 100 }
      );
    });

    it('should accept integers in valid range [1, 180]', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 180 }), (num) => {
          const result = validateTimeInput(num.toString());
          expect(result.valid).toBe(true);
          expect(result.value).toBe(num);
          expect(result.errorType).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Empty Input Rejection', () => {
    it('should reject empty string input', () => {
      const result = validateTimeInput('');
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe('empty');
    });

    it('should reject whitespace-only input', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 10 }).map(arr => arr.join('')),
          (input) => {
            const result = validateTimeInput(input);
            expect(result.valid).toBe(false);
            expect(result.errorType).toBe('empty');
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
