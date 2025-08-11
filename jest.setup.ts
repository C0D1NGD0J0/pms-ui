import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

import { server } from "./src/tests/mocks/server";

// Set up MSW server
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
