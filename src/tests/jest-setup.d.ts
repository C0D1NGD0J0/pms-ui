// Type definitions for Jest global variables
import "@testing-library/jest-dom";

declare global {
  // Extend expect matchers
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
    }
  }
}

export {};
