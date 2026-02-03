import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

// MSW setup temporarily disabled due to Jest ESM module resolution issues
// TODO: Re-enable once MSW v2 + Jest configuration is resolved
// See: https://github.com/mswjs/msw/issues/1267

// Suppress console.error in tests to prevent test failures from expected errors
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});
