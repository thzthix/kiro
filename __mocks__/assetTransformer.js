// Custom asset transformer that returns the file path for testing
const path = require('path');

module.exports = {
  process(src, filename) {
    // Return the filename as the module export
    // This allows tests to verify which asset is being used
    return {
      code: `module.exports = ${JSON.stringify(filename)};`,
    };
  },
};
