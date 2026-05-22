// Custom image mock that preserves the file path for testing
module.exports = new Proxy(
  {},
  {
    get(target, name) {
      if (name === '__esModule') {
        return false;
      }
      // Return the requested property name as the mock value
      // This allows tests to verify which image is being used
      return name;
    },
  }
);
