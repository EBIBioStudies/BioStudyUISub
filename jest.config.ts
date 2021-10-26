module.exports = {
  preset: 'jest-preset-angular',
  clearMocks: true,
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupJestAfterEnv.ts'],
  coverageThreshold: {
    global: {
      statements: 17.5,
      branches: 15.79,
      functions: 12.5,
      lines: 17.3
    }
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.extensions.ts',
    '!**/*.config.ts',
    '!**/*.module.ts',
    '!**/*.d.ts',
    '!**/*Mocks.ts',
    '!**/polyfills.ts',
    '!**/main.ts',
    '!**/index.ts'
  ],
  coveragePathIgnorePatterns: ['server'],
  moduleNameMapper: {
    'app/(.*)': '<rootDir>/src/app/$1'
  }
};
