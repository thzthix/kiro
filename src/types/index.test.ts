/**
 * Basic test to verify Jest and fast-check setup
 */
import * as fc from 'fast-check';

describe('Project Setup Verification', () => {
  it('should run basic Jest test', () => {
    expect(true).toBe(true);
  });

  it('should run basic property-based test with fast-check', () => {
    fc.assert(
      fc.property(fc.integer(), n => {
        expect(n + 0).toBe(n);
      }),
      { numRuns: 100 }
    );
  });
});
