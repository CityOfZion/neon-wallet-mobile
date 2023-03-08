module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/e2e/init.ts'],
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    globals: {
      'ts-jest': {
        tsConfig: 'tsconfig.json'
      }
    },
    testRegex: '/e2e/.*\\.(test|spec)\\.(ts|tsx|js)$'
  };
  