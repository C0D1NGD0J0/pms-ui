import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@services$": "<rootDir>/src/services",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@interfaces$": "<rootDir>/src/interfaces",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@tests/(.*)$": "<rootDir>/src/tests/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@configs/(.*)$": "<rootDir>/src/configs/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@validations/(.*)$": "<rootDir>/src/validations/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@store$": "<rootDir>/src/store",
    "^@bootstrap/(.*)$": "<rootDir>/src/bootstrap/$1",
    "^@theme/(.*)$": "<rootDir>/src/theme/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@/(.*)$": "<rootDir>/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
