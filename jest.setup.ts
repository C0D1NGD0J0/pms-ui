import "@testing-library/jest-dom";

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
