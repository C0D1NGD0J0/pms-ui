# Testing Documentation

## Overview

This directory contains the testing infrastructure for the PMS UI application. The testing setup uses:

- Jest as the test runner
- React Testing Library for component testing
- MSW (Mock Service Worker) for API mocking
- Custom utilities for wrapping components with providers

## Directory Structure

```
src/tests/
├── mocks/                  # Mock API handlers and server setup
│   ├── handlers.ts         # API endpoint mock handlers
│   └── server.ts           # MSW server configuration
├── utils/                  # Testing utilities
│   └── test-utils.tsx      # Custom render functions with providers
└── examples/               # Example test implementations
    ├── components/         # Component test examples
    ├── hooks/              # Hook test examples
    └── services/           # Service test examples
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Writing Tests

### Component Tests

Components should be tested using the custom render function from `@tests/utils/test-utils` which provides the necessary providers:

```tsx
import { render, screen, fireEvent } from "@tests/utils/test-utils";
import { YourComponent } from "@components/YourComponent";

describe("YourComponent", () => {
  it("renders correctly", () => {
    render(<YourComponent />);
    // assertions...
  });
});
```

### Hook Tests

Hooks should be tested using React Testing Library's `renderHook` function:

```tsx
import { renderHook, act } from "@testing-library/react";
import { useYourHook } from "@hooks/useYourHook";

describe("useYourHook", () => {
  it("returns the expected value", () => {
    const { result } = renderHook(() => useYourHook());
    // assertions...
  });
});
```

### Service Tests

Services that make API calls should be tested using MSW:

```tsx
import { server } from "@tests/mocks/server";
import { HttpResponse, http } from "msw";
import { yourService } from "@services/yourService";

describe("yourService", () => {
  it("handles API call correctly", async () => {
    // Add or override handlers as needed
    server.use(
      http.get("https://api.example.com/endpoint", () => {
        return HttpResponse.json({ data: "mocked data" });
      })
    );
    
    const result = await yourService.fetchData();
    // assertions...
  });
});
```

## Mocking

### API Mocking

API endpoints are mocked using MSW. Add new handlers to `src/tests/mocks/handlers.ts`:

```ts
import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("/api/your-endpoint", () => {
    return HttpResponse.json({ data: "response" });
  }),
];
```

### Testing Error States

To test error handling, you can override existing handlers:

```ts
server.use(
  http.get("/api/endpoint", () => {
    return HttpResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  })
);
```

## Best Practices

1. Test component behavior, not implementation
2. Use screen queries that match how users interact with your app
3. Prefer `getByRole` over other queries when possible
4. Use `data-testid` attributes sparingly, only when no other query works
5. Verify that important UI elements are accessible
6. Test error states and loading states
7. Keep tests focused on a single behavior
8. Use `describe` blocks to group related tests
9. Use `beforeEach` and `afterEach` for setup and cleanup
