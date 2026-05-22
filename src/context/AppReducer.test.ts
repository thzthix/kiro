/**
 * Unit Tests for AppReducer
 * Feature: turtle-study-app
 * 
 * These tests verify specific examples, edge cases, and action handling
 * for the state reducer managing the application state.
 */

import { AppState } from '../types';
import { appReducer, AppAction } from './AppReducer';

describe('AppReducer Unit Tests', () => {
  describe('START_SESSION action', () => {
    it('should initialize session with carrotCount=3 and waterCount=3', () => {
      const initialState: AppState = {
        screen: 'home',
        session: null,
        error: null,
      };

      const action: AppAction = {
        type: 'START_SESSION',
        payload: { duration: 30 }, // 30 minutes
      };

      const newState = appReducer(initialState, action);

      expect(newState.session).not.toBeNull();
      expect(newState.session?.carrotCount).toBe(3);
      expect(newState.session?.waterCount).toBe(3);
      expect(newState.session?.totalDuration).toBe(1800); // 30 * 60
      expect(newState.session?.remainingTime).toBe(1800);
      expect(newState.session?.status).toBe('running');
      expect(newState.session?.turtleState).toBe('walking');
      expect(newState.screen).toBe('session');
    });

    it('should initialize session with null state end times', () => {
      const initialState: AppState = {
        screen: 'home',
        session: null,
        error: null,
      };

      const action: AppAction = {
        type: 'START_SESSION',
        payload: { duration: 10 },
      };

      const newState = appReducer(initialState, action);

      expect(newState.session?.eatingStateEndTime).toBeNull();
      expect(newState.session?.happyStateEndTime).toBeNull();
      expect(newState.session?.previousStateBeforePause).toBeNull();
      expect(newState.session?.remainingEatingDuration).toBeNull();
      expect(newState.session?.remainingHappyDuration).toBeNull();
    });
  });

  describe('PAUSE_SESSION action', () => {
    it('should freeze timer and change turtle to sleeping state', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'running',
          turtleState: 'walking',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'PAUSE_SESSION' };

      const newState = appReducer(initialState, action);

      expect(newState.session?.status).toBe('paused');
      expect(newState.session?.turtleState).toBe('sleeping');
      expect(newState.session?.remainingTime).toBe(900); // frozen
      expect(newState.session?.previousStateBeforePause).toBe('walking');
    });

    it('should preserve remaining eating duration when paused during eating state', () => {
      const now = Date.now();
      const eatingEndTime = now + 500; // 500ms remaining

      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'running',
          turtleState: 'eating',
          eatingStateEndTime: eatingEndTime,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'PAUSE_SESSION', payload: { currentTime: now } };

      const newState = appReducer(initialState, action);

      expect(newState.session?.status).toBe('paused');
      expect(newState.session?.turtleState).toBe('sleeping');
      expect(newState.session?.previousStateBeforePause).toBe('eating');
      expect(newState.session?.remainingEatingDuration).toBeGreaterThanOrEqual(0);
      expect(newState.session?.remainingEatingDuration).toBeLessThanOrEqual(500);
    });

    it('should preserve remaining happy duration when paused during happy state', () => {
      const now = Date.now();
      const happyEndTime = now + 1500; // 1500ms remaining

      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'running',
          turtleState: 'happy',
          eatingStateEndTime: null,
          happyStateEndTime: happyEndTime,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'PAUSE_SESSION', payload: { currentTime: now } };

      const newState = appReducer(initialState, action);

      expect(newState.session?.status).toBe('paused');
      expect(newState.session?.turtleState).toBe('sleeping');
      expect(newState.session?.previousStateBeforePause).toBe('happy');
      expect(newState.session?.remainingHappyDuration).toBeGreaterThanOrEqual(0);
      expect(newState.session?.remainingHappyDuration).toBeLessThanOrEqual(1500);
    });
  });

  describe('RESUME_SESSION action', () => {
    it('should continue from paused state and restore previous turtle state', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'paused',
          turtleState: 'sleeping',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: 'walking',
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'RESUME_SESSION' };

      const newState = appReducer(initialState, action);

      expect(newState.session?.status).toBe('running');
      expect(newState.session?.turtleState).toBe('walking');
      expect(newState.session?.remainingTime).toBe(900);
      expect(newState.session?.previousStateBeforePause).toBeNull();
    });

    it('should restore eating state with remaining duration when resuming from pause', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'paused',
          turtleState: 'sleeping',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: 'eating',
          remainingEatingDuration: 500,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'RESUME_SESSION', payload: { currentTime: Date.now() } };

      const newState = appReducer(initialState, action);

      expect(newState.session?.status).toBe('running');
      expect(newState.session?.turtleState).toBe('eating');
      expect(newState.session?.eatingStateEndTime).not.toBeNull();
      expect(newState.session?.remainingEatingDuration).toBeNull();
    });

    it('should restore happy state with remaining duration when resuming from pause', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'paused',
          turtleState: 'sleeping',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: 'happy',
          remainingEatingDuration: null,
          remainingHappyDuration: 1500,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'RESUME_SESSION', payload: { currentTime: Date.now() } };

      const newState = appReducer(initialState, action);

      expect(newState.session?.status).toBe('running');
      expect(newState.session?.turtleState).toBe('happy');
      expect(newState.session?.happyStateEndTime).not.toBeNull();
      expect(newState.session?.remainingHappyDuration).toBeNull();
    });
  });

  describe('STOP_SESSION action', () => {
    it('should clear session and return to home screen', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'running',
          turtleState: 'walking',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'STOP_SESSION' };

      const newState = appReducer(initialState, action);

      expect(newState.session).toBeNull();
      expect(newState.screen).toBe('home');
    });
  });

  describe('TICK action', () => {
    it('should decrement remaining time by 1 second', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'running',
          turtleState: 'walking',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'TICK' };

      const newState = appReducer(initialState, action);

      expect(newState.session?.remainingTime).toBe(899);
    });

    it('should not decrement below 0', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 0,
          status: 'running',
          turtleState: 'walking',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = { type: 'TICK' };

      const newState = appReducer(initialState, action);

      expect(newState.session?.remainingTime).toBe(0);
    });
  });

  describe('UPDATE_TURTLE_STATE action', () => {
    it('should change turtle state to eating', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'running',
          turtleState: 'walking',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const now = Date.now();
      const action: AppAction = {
        type: 'UPDATE_TURTLE_STATE',
        payload: { turtleState: 'eating', timestamp: now },
      };

      const newState = appReducer(initialState, action);

      expect(newState.session?.turtleState).toBe('eating');
      expect(newState.session?.eatingStateEndTime).toBe(now + 1000); // 1 second duration
    });

    it('should change turtle state to happy', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'running',
          turtleState: 'eating',
          eatingStateEndTime: Date.now() + 1000,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const now = Date.now();
      const action: AppAction = {
        type: 'UPDATE_TURTLE_STATE',
        payload: { turtleState: 'happy', timestamp: now },
      };

      const newState = appReducer(initialState, action);

      expect(newState.session?.turtleState).toBe('happy');
      expect(newState.session?.happyStateEndTime).toBe(now + 3000); // 3 seconds duration
      expect(newState.session?.eatingStateEndTime).toBeNull(); // cleared
    });

    it('should change turtle state to arrived', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 0,
          status: 'running',
          turtleState: 'walking',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 2,
          waterCount: 3,
        },
        error: null,
      };

      const action: AppAction = {
        type: 'UPDATE_TURTLE_STATE',
        payload: { turtleState: 'arrived' },
      };

      const newState = appReducer(initialState, action);

      expect(newState.session?.turtleState).toBe('arrived');
    });
  });

  describe('PROVIDE_ITEM action', () => {
    it('should trigger eating state and decrement carrot count', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
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

      const now = Date.now();
      const action: AppAction = {
        type: 'PROVIDE_ITEM',
        payload: { itemType: 'carrot', timestamp: now },
      };

      const newState = appReducer(initialState, action);

      expect(newState.session?.carrotCount).toBe(2);
      expect(newState.session?.turtleState).toBe('eating');
      expect(newState.session?.eatingStateEndTime).toBe(now + 1000);
    });

    it('should trigger eating state and decrement water count', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
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

      const now = Date.now();
      const action: AppAction = {
        type: 'PROVIDE_ITEM',
        payload: { itemType: 'water', timestamp: now },
      };

      const newState = appReducer(initialState, action);

      expect(newState.session?.waterCount).toBe(2);
      expect(newState.session?.turtleState).toBe('eating');
      expect(newState.session?.eatingStateEndTime).toBe(now + 1000);
    });

    it('should not decrement count below 0', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 900,
          status: 'running',
          turtleState: 'walking',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 0,
          waterCount: 3,
        },
        error: null,
      };

      const now = Date.now();
      const action: AppAction = {
        type: 'PROVIDE_ITEM',
        payload: { itemType: 'carrot', timestamp: now },
      };

      const newState = appReducer(initialState, action);

      expect(newState.session?.carrotCount).toBe(0);
      // Should not trigger eating state if count is 0
      expect(newState.session?.turtleState).toBe('walking');
    });
  });

  describe('COMPLETE_SESSION action', () => {
    it('should mark session as completed and navigate to complete screen', () => {
      const initialState: AppState = {
        screen: 'session',
        session: {
          totalDuration: 1800,
          remainingTime: 0,
          status: 'running',
          turtleState: 'arrived',
          eatingStateEndTime: null,
          happyStateEndTime: null,
          previousStateBeforePause: null,
          remainingEatingDuration: null,
          remainingHappyDuration: null,
          carrotCount: 1,
          waterCount: 2,
        },
        error: null,
      };

      const action: AppAction = { type: 'COMPLETE_SESSION' };

      const newState = appReducer(initialState, action);

      expect(newState.session?.status).toBe('completed');
      expect(newState.screen).toBe('complete');
    });
  });
});
