/**
 * useButtonDebounce Hook
 * Feature: turtle-study-app
 * Task: 13.5 Refactor screens (REFACTOR)
 * 
 * Provides debounced button press handling to prevent rapid repeated taps.
 * Uses timestamp-based approach for simple, reliable debouncing.
 * 
 * @param cooldownMs - Cooldown duration in milliseconds (default: 500ms)
 * @returns handlePress function that debounces callbacks
 */

import { useRef, useCallback } from 'react';

interface UseButtonDebounceReturn {
  handlePress: <T = void>(
    key: string,
    callback?: (payload?: T) => void,
    payload?: T
  ) => void;
}

export const useButtonDebounce = (
  cooldownMs: number = 500
): UseButtonDebounceReturn => {
  const lastPressTime = useRef<{ [key: string]: number }>({});

  const handlePress = useCallback(
    <T = void>(
      key: string,
      callback?: (payload?: T) => void,
      payload?: T
    ) => {
      const now = Date.now();
      const lastPress = lastPressTime.current[key] || 0;

      // Ignore if within cooldown period
      if (now - lastPress < cooldownMs) {
        return;
      }

      lastPressTime.current[key] = now;
      callback?.(payload);
    },
    [cooldownMs]
  );

  return { handlePress };
};
