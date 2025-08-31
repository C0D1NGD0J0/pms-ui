import { useIdleDetector } from "@hooks/useActive";
import { renderHook, act } from "@testing-library/react";

jest.mock("@utils/helpers", () => ({
  throttle: jest.fn((fn) => fn),
}));

describe("useIdleDetector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-01-01"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize as not idle", () => {
    const { result } = renderHook(() => useIdleDetector(1));
    expect(result.current).toBe(false);
  });

  it("should become idle after specified time", () => {
    const { result } = renderHook(() => useIdleDetector(1, 1000));

    act(() => {
      jest.advanceTimersByTime(70000);
    });

    expect(result.current).toBe(true);
  });

  it("should reset idle state on activity", () => {
    const { result } = renderHook(() => useIdleDetector(1, 1000));

    act(() => {
      jest.advanceTimersByTime(70000);
    });
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("mousedown"));
    });

    expect(result.current).toBe(false);
  });

  it("should handle different idle time values", () => {
    const { result } = renderHook(() => useIdleDetector(2, 1000));

    act(() => {
      jest.advanceTimersByTime(70000);
    });
    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(result.current).toBe(true);
  });

  it("should listen to multiple activity events", () => {
    const { result } = renderHook(() => useIdleDetector(1, 1000));

    act(() => {
      jest.advanceTimersByTime(70000);
    });
    expect(result.current).toBe(true);

    const events = ["keydown", "mousemove", "touchstart", "scroll", "focus"];

    events.forEach((eventType) => {
      act(() => {
        jest.advanceTimersByTime(70000);
      });
      expect(result.current).toBe(true);

      act(() => {
        window.dispatchEvent(new Event(eventType));
      });
      expect(result.current).toBe(false);
    });
  });

  it("should clean up event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useIdleDetector(1));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
  });

  it("should clear interval on unmount", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
    const { unmount } = renderHook(() => useIdleDetector(1));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("should use custom check interval", () => {
    const setIntervalSpy = jest.spyOn(global, "setInterval");
    renderHook(() => useIdleDetector(1, 5000));

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it("should convert idle time from minutes to milliseconds correctly", () => {
    const { result } = renderHook(() => useIdleDetector(0.5, 1000));

    act(() => {
      jest.advanceTimersByTime(20000);
    });
    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(15000);
    });
    expect(result.current).toBe(true);
  });

  it("should handle visibility change event", () => {
    const { result } = renderHook(() => useIdleDetector(1, 1000));

    act(() => {
      jest.advanceTimersByTime(70000);
    });
    expect(result.current).toBe(true);

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(result.current).toBe(false);
  });
});
