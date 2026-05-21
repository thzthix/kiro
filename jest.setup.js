// Jest setup file for React Native testing

// Mock React Native core
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
  Animated: {
    Value: jest.fn(),
    timing: jest.fn(),
    spring: jest.fn(),
    View: 'Animated.View',
    Text: 'Animated.Text',
  },
}));

// Global test timeout
jest.setTimeout(10000);
