/**
 * useButtonDebounce Hook Tests
 * Feature: turtle-study-app
 * Task: 13.5 Refactor screens (REFACTOR)
 * 
 * Tests for the useButtonDebounce hook that prevents rapid repeated button taps.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useButtonDebounce } from './useButtonDebounce';

describe('useButtonDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call callback on first press', () => {
    const { result } = renderHook(() => useButtonDebounce(500));
    const callback = jest.fn();

    act(() => {
      result.current.handlePress('test', callback);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should ignore rapid presses within cooldown period', () => {
    const { result } = renderHook(() => useButtonDebounce(500));
    const callback = jest.fn();

    act(() => {
      result.current.handlePress('test', callback);
      jest.advanceTimersByTime(100);
      result.current.handlePress('test', callback);
      jest.advanceTimersByTime(100);
      result.current.handlePress('test', callback);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should allow press after cooldown period', () => {
    const { result } = renderHook(() => useButtonDebounce(500));
    const callback = jest.fn();

    act(() => {
      result.current.handlePress('test', callback);
      jest.advanceTimersByTime(500);
      result.current.handlePress('test', callback);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should track different keys independently', () => {
    const { result } = renderHook(() => useButtonDebounce(500));
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    act(() => {
      result.current.handlePress('button1', callback1);
      result.current.handlePress('button2', callback2);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should pass payload to callback', () => {
    const { result } = renderHook(() => useButtonDebounce(500));
    const callback = jest.fn();
    const payload = { action: 'test' };

    act(() => {
      result.current.handlePress('test', callback, payload);
    });

    expect(callback).toHaveBeenCalledWith(payload);
  });

  it('should handle undefined callback gracefully', () => {
    const { result } = renderHook(() => useButtonDebounce(500));

    expect(() => {
      act(() => {
        result.current.handlePress('test', undefined);
      });
    }).not.toThrow();
  });

  it('should use custom cooldown duration', () => {
    const { result } = renderHook(() => useButtonDebounce(1000));
    const callback = jest.fn();

    act(() => {
      result.current.handlePress('test', callback);
      jest.advanceTimersByTime(500);
      result.current.handlePress('test', callback);
    });

    // Should still be blocked at 500ms with 1000ms cooldown
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
      result.current.handlePress('test', callback);
    });

    // Should work after 1000ms total
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
