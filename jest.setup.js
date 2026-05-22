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
      flatten: jest.fn((styles) => {
        if (Array.isArray(styles)) {
          return Object.assign({}, ...styles.filter(Boolean));
        }
        return styles;
      }),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
    },
    View: jest.fn((props) => {
      const React = require('react');
      const { children, ...restProps } = props || {};
      return React.createElement('View', restProps, children);
    }),
    Text: 'Text',
    Image: 'Image',
    ImageBackground: 'ImageBackground',
    TouchableOpacity: 'TouchableOpacity',
    Pressable: 'Pressable',
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
      parallel: jest.fn((animations) => ({
        start: jest.fn(),
      })),
      View: jest.fn((props) => {
        const React = require('react');
        const { children, ...restProps } = props || {};
        return React.createElement('Animated.View', restProps, children);
      }),
      Text: 'Animated.Text',
    },
  };
});

// Global test timeout
jest.setTimeout(10000);
