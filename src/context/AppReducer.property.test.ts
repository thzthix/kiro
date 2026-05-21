/**
 * Property-Based Tests for AppReducer
 * Feature: turtle-study-app
 * 
 * These tests verify universal properties that should hold across all valid inputs
 * for the state reducer managing the application state.
 */

import fc from 'fast-check';
import { AppState } from '../types';
import { appReducer } from './AppReducer';

describe('AppReducer Property-Based Tests', () => {
  describe('Property 1: Valid Duration Initializes Session', () => {
    // Feature: turtle-study-app, Property 1: Valid Duration Initializes Session
    // For any integer duration between 1 and 180 minutes (inclusive), when a user submits
    // that duration, the system SHALL create a Study_Session with totalDuration equal to
    // the submitted duration in seconds.
    // Validates: Requirements 1.4

    it('should initialize session with totalDuration equal to submitted duration in seconds for any valid duration', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 180 }), // duration in minutes
          (durationMinutes) => {
            const initialState: AppState = {
              screen: 'home',
              session: null,
              error: null,
            };

            const action = {
              type: 'START_SESSION',
              payload: { duration: durationMinutes },
            };

            const newState = appReducer(initialState, action);

            // Verify session was created
            expect(newState.session).not.toBeNull();
            
            // Verify totalDuration equals submitted duration in seconds
            const expectedSeconds = durationMinutes * 60;
            expect(newState.session?.totalDuration).toBe(expectedSeconds);
            
            // Verify remainingTime is initialized to totalDuration
            expect(newState.session?.remainingTime).toBe(expectedSeconds);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: Pause-Resume Position Preservation', () => {
    // Feature: turtle-study-app, Property 7: Pause-Resume Position Preservation
    // For any Study_Session with turtle progress P, pausing the session and then
    // immediately resuming it SHALL result in the turtle progress still being P.
    // Validates: Requirements 3.7, 3.8

    it('should preserve turtle progress when pausing and resuming for any progress value', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }), // progress percentage
          fc.integer({ min: 60, max: 10800 }), // totalDuration in seconds (1 min to 3 hours)
          (progressPercent, totalDuration) => {
            // Calculate remainingTime based on progress
            const elapsedTime = Math.floor((progressPercent / 100) * totalDuration);
            const remainingTime = totalDuration - elapsedTime;

            const initialState: AppState = {
              screen: 'session',
              session: {
                totalDuration,
                remainingTime,
                status: 'running',
                turtleState: 'walking',
                eatingStateEndTime: null,
                happyStateEndTime: null,
                previousStateBeforePause: null,
                remainingEatingDuration: null,
                remainingHappyDuration: null,
                carrotCount: 3,
                waterCount: 3,
              },
              error: null,
            };

            // Pause the session
            const pausedState = appReducer(initialState, { type: 'PAUSE_SESSION' });

            // Resume the session
            const resumedState = appReducer(pausedState, { type: 'RESUME_SESSION' });

            // Verify remainingTime is preserved exactly
            expect(resumedState.session?.remainingTime).toBe(remainingTime);

            // Calculate progress from remainingTime
            const initialProgress = progressPercent;
            const resumedProgress = Math.round(
              ((totalDuration - (resumedState.session?.remainingTime || 0)) / totalDuration) * 100
            );

            // Verify progress is preserved (within rounding tolerance of 2 due to Math.floor/Math.round)
            expect(Math.abs(resumedProgress - initialProgress)).toBeLessThanOrEqual(2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 9: Pause Preserves Turtle State', () => {
    // Feature: turtle-study-app, Property 9: Pause Preserves Turtle State
    // For any turtle state S (walking, eating, or happy), pausing the session SHALL
    // change the turtle to "sleeping" state and store S in previousStateBeforePause
    // for restoration upon resume. IF the turtle is in eating or happy state when
    // paused, the remaining duration of that state SHALL be preserved and resumed
    // when the session resumes.
    // Validates: Requirements 4.8, 4.9

    it('should change turtle to sleeping and preserve previous state for any turtle state', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('walking', 'eating', 'happy'), // turtle states that can be paused
          fc.integer({ min: 60, max: 10800 }), // totalDuration in seconds
          fc.integer({ min: 0, max: 1000 }), // remaining eating duration in ms (0-1000ms)
          fc.integer({ min: 0, max: 3000 }), // remaining happy duration in ms (0-3000ms)
          (turtleState, totalDuration, remainingEating, remainingHappy) => {
            const now = Date.now();
            
            const initialState: AppState = {
              screen: 'session',
              session: {
                totalDuration,
                remainingTime: totalDuration / 2,
                status: 'running',
                turtleState: turtleState as 'walking' | 'eating' | 'happy',
                eatingStateEndTime: turtleState === 'eating' ? now + remainingEating : null,
                happyStateEndTime: turtleState === 'happy' ? now + remainingHappy : null,
                previousStateBeforePause: null,
                remainingEatingDuration: null,
                remainingHappyDuration: null,
                carrotCount: 3,
                waterCount: 3,
              },
              error: null,
            };

            // Pause the session
            const pausedState = appReducer(initialState, { type: 'PAUSE_SESSION' });

            // Verify turtle changed to sleeping
            expect(pausedState.session?.turtleState).toBe('sleeping');

            // Verify previous state was stored
            expect(pausedState.session?.previousStateBeforePause).toBe(turtleState);

            // If eating or happy, verify remaining duration was preserved
            if (turtleState === 'eating') {
              expect(pausedState.session?.remainingEatingDuration).toBeGreaterThanOrEqual(0);
              expect(pausedState.session?.remainingEatingDuration).toBeLessThanOrEqual(remainingEating);
            }
            if (turtleState === 'happy') {
              expect(pausedState.session?.remainingHappyDuration).toBeGreaterThanOrEqual(0);
              expect(pausedState.session?.remainingHappyDuration).toBeLessThanOrEqual(remainingHappy);
            }

            // Resume the session
            const resumedState = appReducer(pausedState, { type: 'RESUME_SESSION' });

            // Verify turtle state was restored
            expect(resumedState.session?.turtleState).toBe(turtleState);

            // Verify previousStateBeforePause was cleared
            expect(resumedState.session?.previousStateBeforePause).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
