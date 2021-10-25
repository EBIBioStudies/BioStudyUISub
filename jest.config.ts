module.exports = {
  preset: 'jest-preset-angular',
  clearMocks: true,
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupJestAfterEnv.ts'],
  coverageThreshold: {
    global: {
      statements: 17.7,
      branches: 16.17,
      functions: 12.8,
      lines: 17.39
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
