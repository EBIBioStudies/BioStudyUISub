module.exports = {
  preset: 'jest-preset-angular',
  clearMocks: true,
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupJestAfterEnv.ts'],
  coverageThreshold: {
    global: {
      statements: 20.6,
      branches: 16.7,
      functions: 14.2,
      lines: 19.8
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
