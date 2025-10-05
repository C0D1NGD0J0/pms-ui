import { useDebounce } from "@hooks/useDebounce";
import { renderHook, act } from "@testing-library/react";

describe("useDebounce Hook", () => {
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

    expect(result.current).toBe("initial value");

    rerender({ value: "updated value", delay: 500 });
    expect(result.current).toBe("initial value");

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe("initial value");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated value");
  });

  it("should reset timer if value changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial value", delay: 500 },
      }
    );

    rerender({ value: "intermediate value", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe("initial value");

    rerender({ value: "final value", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe("initial value");

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("final value");
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
