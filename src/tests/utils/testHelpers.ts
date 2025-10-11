import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a fresh QueryClient instance for testing
 * Disables retries and caching for predictable tests
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Mock user data factory
 */
export function createMockUser(overrides?: Partial<any>) {
  return {
    uid: "test-user-123",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    role: "admin",
    isActive: true,
    ...overrides,
  };
}

/**
 * Mock client data factory
 */
export function createMockClient(overrides?: Partial<any>) {
  return {
    cuid: "test-client-123",
    companyName: "Test Company",
    isActive: true,
    ...overrides,
  };
}
