/*eslint-disable */

const jest = require('kcd-scripts/config').jest;

module.exports = Object.assign(jest, {
  testMatch: undefined,
  collectCoverageFrom: ['src/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  testRegex: '/__tests__/.*\\.(ts|tsx|js)$',
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
});

/*eslint-enable */
