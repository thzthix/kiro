// Jest setup file for React Native testing

// Mock React Native core
jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((styles) => styles),
    },
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    TouchableOpacity: 'TouchableOpacity',
    TextInput: 'TextInput',
    Modal: 'Modal',
    Animated: {
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(),
      })),
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
      spring: jest.fn(() => ({
        start: jest.fn(),
      })),
      View: 'Animated.View',
      Text: 'Animated.Text',
    },
  };
});

// Global test timeout
jest.setTimeout(10000);
