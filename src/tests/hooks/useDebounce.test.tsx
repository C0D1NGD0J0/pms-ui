import { useDebounce } from "@hooks/useDebounce";
import { renderHook, act } from "@testing-library/react";

describe("useDebounce Hook", () => {
  // Mock timer functions
  jest.useFakeTimers();

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial value", 500));
    expect(result.current).toBe("initial value");
  });

  it("should update value after specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial value", delay: 500 },
      }
    );

    // Initial value check
    expect(result.current).toBe("initial value");

    // Change the value
    rerender({ value: "updated value", delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe("initial value");

    // Fast-forward time by 499ms
    act(() => {
      jest.advanceTimersByTime(499);
    });

    // Value should still not change
    expect(result.current).toBe("initial value");

    // Fast-forward time to 500ms (1ms more)
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Now the value should be updated
    expect(result.current).toBe("updated value");
  });

  it("should reset timer if value changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial value", delay: 500 },
      }
    );

    // Change the value first time
    rerender({ value: "intermediate value", delay: 500 });

    // Fast-forward time by 400ms (less than delay)
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Value should still be initial
    expect(result.current).toBe("initial value");

    // Change the value second time
    rerender({ value: "final value", delay: 500 });

    // Fast-forward time by 400ms (less than delay from second change)
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Value should still not change
    expect(result.current).toBe("initial value");

    // Fast-forward the remaining time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Now the value should be updated to the latest
    expect(result.current).toBe("final value");
  });

  // Cleanup after tests
  afterAll(() => {
    jest.useRealTimers();
  });
});
