import * as fc from 'fast-check';
import {
  calculateProgress,
  formatTime,
  calculatePosition,
} from './ProgressCalculator';
import { PathCoordinates, Point } from '../types';

describe('ProgressCalculator - Property-Based Tests', () => {
  describe('Property 4: Time Formatting Correctness', () => {
    it('should format any non-negative seconds to MM:SS with zero-padding', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 10800 }), (seconds) => {
          const result = formatTime(seconds);

          // Check format: MM:SS
          expect(result).toMatch(/^\d{2}:\d{2}$/);

          // Extract minutes and seconds
          const [mins, secs] = result.split(':').map(Number);

          // Verify correctness
          const expectedMins = Math.floor(seconds / 60);
          const expectedSecs = seconds % 60;

          expect(mins).toBe(expectedMins);
          expect(secs).toBe(expectedSecs);
        }),
        { numRuns: 100 }
      );
    });

    it('should always use zero-padding for single-digit values', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 9 }),
          fc.integer({ min: 0, max: 9 }),
          (mins, secs) => {
            const totalSeconds = mins * 60 + secs;
            const result = formatTime(totalSeconds);

            // Both parts should be 2 digits
            const parts = result.split(':');
            expect(parts[0]).toHaveLength(2);
            expect(parts[1]).toHaveLength(2);
            expect(parts[0]).toBe(mins.toString().padStart(2, '0'));
            expect(parts[1]).toBe(secs.toString().padStart(2, '0'));
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 6: Progress Calculation Formula', () => {
    it('should calculate progress as (elapsed / total) × 100, clamped to [0, 100]', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10800 }), // total duration
          fc.integer({ min: 0, max: 10800 }), // elapsed time
          (totalDuration, elapsed) => {
            const result = calculateProgress(elapsed, totalDuration);

            // Progress should be in [0, 100]
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(100);

            // Verify formula
            const expected = Math.min(
              100,
              Math.max(0, (elapsed / totalDuration) * 100)
            );
            expect(result).toBeCloseTo(expected, 5);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return 0 when elapsed is 0', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 10800 }), (totalDuration) => {
          const result = calculateProgress(0, totalDuration);
          expect(result).toBe(0);
        }),
        { numRuns: 50 }
      );
    });

    it('should return 100 when elapsed >= total', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10800 }),
          fc.integer({ min: 0, max: 1000 }),
          (totalDuration, extra) => {
            const elapsed = totalDuration + extra;
            const result = calculateProgress(elapsed, totalDuration);
            expect(result).toBe(100);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Position Calculation', () => {
    const mockPath: PathCoordinates = {
      start: { x: 0, y: 100 },
      end: { x: 300, y: 100 },
      controlPoints: [
        { x: 100, y: 80 },
        { x: 200, y: 120 },
      ],
    };

    it('should map progress percentage to path coordinates', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), (progress) => {
          const result = calculatePosition(progress, mockPath);

          // Result should be a valid Point
          expect(result).toHaveProperty('x');
          expect(result).toHaveProperty('y');
          expect(typeof result.x).toBe('number');
          expect(typeof result.y).toBe('number');

          // Position should be within reasonable bounds
          expect(result.x).toBeGreaterThanOrEqual(-50);
          expect(result.x).toBeLessThanOrEqual(350);
          expect(result.y).toBeGreaterThanOrEqual(30);
          expect(result.y).toBeLessThanOrEqual(170);
        }),
        { numRuns: 100 }
      );
    });

    it('should return start position when progress is 0', () => {
      const result = calculatePosition(0, mockPath);
      expect(result.x).toBeCloseTo(mockPath.start.x, 1);
      expect(result.y).toBeCloseTo(mockPath.start.y, 1);
    });

    it('should return end position when progress is 100', () => {
      const result = calculatePosition(100, mockPath);
      expect(result.x).toBeCloseTo(mockPath.end.x, 1);
      expect(result.y).toBeCloseTo(mockPath.end.y, 1);
    });
  });
});
