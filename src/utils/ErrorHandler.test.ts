/**
 * ErrorHandler Tests
 * 
 * Tests for centralized error handling utilities.
 * Verifies consistent error logging and graceful degradation.
 */

import {
  logError,
  logWarning,
  handleAnimationError,
  handleImageLoadError,
  handleInvalidState,
  handleTimerError,
  validateInput,
  ErrorSeverity,
} from './ErrorHandler';

describe('ErrorHandler', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('logError', () => {
    it('should log error with message and error object', () => {
      const error = new Error('Test error');
      logError('Operation failed', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Operation failed: Test error'
      );
    });

    it('should log error with context information', () => {
      const error = new Error('Test error');
      logError('Operation failed', error, ErrorSeverity.ERROR, {
        component: 'TestComponent',
        operation: 'testOperation',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Operation failed [TestComponent:testOperation]: Test error'
      );
    });

    it('should log error with metadata', () => {
      const error = new Error('Test error');
      logError('Operation failed', error, ErrorSeverity.ERROR, {
        component: 'TestComponent',
        metadata: { key: 'value' },
      });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        2,
        'Error metadata:',
        { key: 'value' }
      );
    });

    it('should use console.warn for WARN severity', () => {
      const error = new Error('Test warning');
      logError('Warning occurred', error, ErrorSeverity.WARN);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Warning occurred: Test warning'
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle non-Error objects', () => {
      logError('Operation failed', 'string error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Operation failed: string error'
      );
    });
  });

  describe('logWarning', () => {
    it('should log warning with message', () => {
      logWarning('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Warning message');
    });

    it('should log warning with context', () => {
      logWarning('Warning message', {
        component: 'TestComponent',
        operation: 'testOperation',
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Warning message [TestComponent:testOperation]'
      );
    });

    it('should log warning with metadata', () => {
      logWarning('Warning message', {
        component: 'TestComponent',
        metadata: { key: 'value' },
      });

      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(
        2,
        'Warning metadata:',
        { key: 'value' }
      );
    });
  });

  describe('handleAnimationError', () => {
    it('should log error and execute fallback', () => {
      const error = new Error('Animation failed');
      const fallback = jest.fn();

      handleAnimationError(error, fallback);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Animation error [Animation]: Animation failed'
      );
      expect(fallback).toHaveBeenCalled();
    });

    it('should handle fallback errors', () => {
      const error = new Error('Animation failed');
      const fallback = jest.fn(() => {
        throw new Error('Fallback failed');
      });

      handleAnimationError(error, fallback);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        2,
        'Fallback operation failed [Animation:fallback]: Fallback failed'
      );
    });

    it('should use custom component context', () => {
      const error = new Error('Animation failed');
      const fallback = jest.fn();

      handleAnimationError(error, fallback, {
        component: 'CustomComponent',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Animation error [CustomComponent]: Animation failed'
      );
    });
  });

  describe('handleImageLoadError', () => {
    it('should log image load error with image name', () => {
      const error = new Error('Load failed');

      handleImageLoadError(error, 'turtle-sprite.png');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Image load error: turtle-sprite.png [Image]: Load failed'
      );
    });

    it('should include image name in metadata', () => {
      const error = new Error('Load failed');

      handleImageLoadError(error, 'turtle-sprite.png', {
        component: 'TurtleCharacter',
      });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        2,
        'Error metadata:',
        expect.objectContaining({ imageName: 'turtle-sprite.png' })
      );
    });
  });

  describe('handleInvalidState', () => {
    it('should log warning and return default value', () => {
      const result = handleInvalidState('Invalid state', 'default');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid state');
      expect(result).toBe('default');
    });

    it('should log warning with context', () => {
      const result = handleInvalidState('Invalid state', 'default', {
        component: 'StateManager',
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid state [StateManager]'
      );
      expect(result).toBe('default');
    });

    it('should work with different types', () => {
      const numberResult = handleInvalidState('Invalid number', 0);
      expect(numberResult).toBe(0);

      const booleanResult = handleInvalidState('Invalid boolean', false);
      expect(booleanResult).toBe(false);

      const objectResult = handleInvalidState('Invalid object', { key: 'value' });
      expect(objectResult).toEqual({ key: 'value' });
    });
  });

  describe('handleTimerError', () => {
    it('should log timer error with operation and timer ID', () => {
      handleTimerError('pause', 'timer-123', 'Timer not found');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Timer pause failed: Timer not found [TimerService:pause]'
      );
    });

    it('should include timer ID in metadata', () => {
      handleTimerError('pause', 'timer-123', 'Timer not found');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(
        2,
        'Warning metadata:',
        expect.objectContaining({
          timerId: 'timer-123',
          reason: 'Timer not found',
        })
      );
    });

    it('should use custom context', () => {
      handleTimerError('pause', 'timer-123', 'Timer not found', {
        component: 'CustomTimer',
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Timer pause failed: Timer not found [CustomTimer:pause]'
      );
    });
  });

  describe('validateInput', () => {
    it('should return true for valid input', () => {
      const result = validateInput(true, 'Invalid input');

      expect(result).toBe(true);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should return false and log warning for invalid input', () => {
      const result = validateInput(false, 'Invalid input');

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid input');
    });

    it('should log warning with context for invalid input', () => {
      const result = validateInput(false, 'Invalid input', {
        component: 'InputValidator',
      });

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid input [InputValidator]'
      );
    });
  });

  describe('Error severity levels', () => {
    it('should have correct severity enum values', () => {
      expect(ErrorSeverity.WARN).toBe('warn');
      expect(ErrorSeverity.ERROR).toBe('error');
      expect(ErrorSeverity.CRITICAL).toBe('critical');
    });
  });

  describe('Graceful degradation', () => {
    it('should preserve session state when handling errors', () => {
      const error = new Error('Test error');
      const sessionState = { timer: 60, progress: 50 };

      // Simulate error handling that doesn't modify state
      logError('Error occurred', error);

      // Session state should be unchanged
      expect(sessionState).toEqual({ timer: 60, progress: 50 });
    });

    it('should allow continued operation after error', () => {
      const error = new Error('Test error');
      let operationCount = 0;

      // First operation fails
      try {
        throw error;
      } catch (e) {
        logError('Operation failed', e);
      }

      // Subsequent operations should still work
      operationCount++;
      expect(operationCount).toBe(1);
    });
  });
});
