/**
 * Decorative Elements Configuration
 * Feature: turtle-study-app
 * Task: 12.5 Refactor background components (REFACTOR)
 * 
 * Centralized configuration for decorative elements positioning and styling.
 * Requirements: 6.1, 6.2, 6.4
 */

import { COLORS } from './theme';

export interface DecorativeElementConfig {
  type: 'wooden-sign' | 'plant' | 'stone' | 'bush' | 'tree' | 'flag';
  x: number;
  y: number;
  scale: number;
  color: string;
}

/**
 * Default decorative elements with varied types and positions
 * At least 3 elements as per requirements
 */
export const DECORATIVE_ELEMENTS: DecorativeElementConfig[] = [
  {
    type: 'wooden-sign',
    x: 50,
    y: 100,
    scale: 1.0,
    color: COLORS.beige,
  },
  {
    type: 'plant',
    x: 200,
    y: 150,
    scale: 0.8,
    color: COLORS.mint,
  },
  {
    type: 'stone',
    x: 350,
    y: 200,
    scale: 0.6,
    color: COLORS.oliveGreen,
  },
  {
    type: 'bush',
    x: 100,
    y: 300,
    scale: 1.2,
    color: COLORS.mint,
  },
  {
    type: 'tree',
    x: 300,
    y: 80,
    scale: 1.5,
    color: COLORS.oliveGreen,
  },
];

/**
 * Base size for decorative elements (before scaling)
 */
export const DECORATIVE_ELEMENT_BASE_SIZE = 40;
