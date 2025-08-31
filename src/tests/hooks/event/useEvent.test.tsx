import { events } from "@services/events";
import { renderHook, act } from "@testing-library/react";
import { useEventSystem, usePublish, useEvent } from "@hooks/event/useEvent";

jest.mock("@services/events", () => ({
  events: {
    subscribeComponent: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
    getSubscriberCount: jest.fn(),
  },
}));

const mockEvents = events as jest.Mocked<typeof events>;

describe("useEvent", () => {
  const mockUnsubscribe = jest.fn();
  const mockHandler = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockEvents.subscribeComponent.mockReturnValue(mockUnsubscribe);
  });

  it("should subscribe to event on mount", () => {
    renderHook(() => useEvent("LOGIN_SUCCESS", mockHandler));
    
    expect(mockEvents.subscribeComponent).toHaveBeenCalledWith(
      expect.any(Object),
      "LOGIN_SUCCESS",
      expect.any(Function)
    );
  });

  it("should unsubscribe on unmount", () => {
    const { unmount } = renderHook(() => useEvent("LOGIN_SUCCESS", mockHandler));
    
    unmount();
    
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("should update handler reference when handler changes", () => {
    const firstHandler = jest.fn();
    const secondHandler = jest.fn();
    
    const { rerender } = renderHook(
      ({ handler }) => useEvent("LOGIN_SUCCESS", handler),
      { initialProps: { handler: firstHandler } }
    );
    
    const callback = mockEvents.subscribeComponent.mock.calls[0][2];
    act(() => {
      callback("test-data");
    });
    
    expect(firstHandler).toHaveBeenCalledWith("test-data");
    
    rerender({ handler: secondHandler });
    
    act(() => {
      callback("test-data-2");
    });
    
    expect(secondHandler).toHaveBeenCalledWith("test-data-2");
    expect(firstHandler).not.toHaveBeenCalledWith("test-data-2");
  });

  it("should handle subscription failure gracefully", () => {
    mockEvents.subscribeComponent.mockReturnValue(null as any);
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    
    renderHook(() => useEvent("LOGIN_SUCCESS", mockHandler));
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'useEvent: unsubscribe not a function for this event "LOGIN_SUCCESS"'
    );
    
    consoleSpy.mockRestore();
  });

  it("should resubscribe when event type changes", () => {
    const { rerender } = renderHook(
      ({ event }) => useEvent(event, mockHandler),
      { initialProps: { event: "LOGIN_SUCCESS" as const } }
    );
    
    expect(mockEvents.subscribeComponent).toHaveBeenCalledTimes(1);
    
    rerender({ event: "LOGOUT" as const });
    
    expect(mockEvents.subscribeComponent).toHaveBeenCalledTimes(2);
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1); // Previous subscription cleaned up
  });

  it("should maintain component reference across re-renders", () => {
    const { rerender } = renderHook(() => useEvent("LOGIN_SUCCESS", mockHandler));
    
    const firstComponentRef = mockEvents.subscribeComponent.mock.calls[0][0];
    
    rerender();
    
    const secondComponentRef = mockEvents.subscribeComponent.mock.calls[1][0];
    
    expect(firstComponentRef).toBe(secondComponentRef);
  });
});

describe("usePublish", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return publish function", () => {
    const { result } = renderHook(() => usePublish());
    
    expect(typeof result.current).toBe("function");
  });

  it("should publish events with correct parameters", () => {
    const { result } = renderHook(() => usePublish());
    
    act(() => {
      result.current("LOGIN_SUCCESS", { userId: "123" });
    });
    
    expect(mockEvents.publish).toHaveBeenCalledWith("LOGIN_SUCCESS", { userId: "123" });
  });

  it("should maintain stable function reference", () => {
    const { result, rerender } = renderHook(() => usePublish());
    
    const firstPublish = result.current;
    rerender();
    const secondPublish = result.current;
    
    expect(firstPublish).toBe(secondPublish);
  });

  it("should handle multiple publish calls", () => {
    const { result } = renderHook(() => usePublish());
    
    act(() => {
      result.current("LOGIN_SUCCESS", { userId: "123" });
      result.current("LOGOUT", null);
      result.current("USER_UPDATED", { name: "John" });
    });
    
    expect(mockEvents.publish).toHaveBeenCalledTimes(3);
    expect(mockEvents.publish).toHaveBeenNthCalledWith(1, "LOGIN_SUCCESS", { userId: "123" });
    expect(mockEvents.publish).toHaveBeenNthCalledWith(2, "LOGOUT", null);
    expect(mockEvents.publish).toHaveBeenNthCalledWith(3, "USER_UPDATED", { name: "John" });
  });
});

describe("useEventSystem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEvents.subscribe.mockReturnValue(jest.fn());
    mockEvents.getSubscriberCount.mockReturnValue(5);
  });

  it("should return event system API", () => {
    const { result } = renderHook(() => useEventSystem());
    
    expect(result.current).toHaveProperty("publish");
    expect(result.current).toHaveProperty("subscribe");
    expect(result.current).toHaveProperty("getSubscriberCount");
  });

  it("should provide working publish function", () => {
    const { result } = renderHook(() => useEventSystem());
    
    act(() => {
      result.current.publish("LOGIN_SUCCESS", { userId: "123" });
    });
    
    expect(mockEvents.publish).toHaveBeenCalledWith("LOGIN_SUCCESS", { userId: "123" });
  });

  it("should provide bound subscribe function", () => {
    const { result } = renderHook(() => useEventSystem());
    const mockHandler = jest.fn();
    
    result.current.subscribe("LOGIN_SUCCESS", mockHandler);
    
    expect(mockEvents.subscribe).toHaveBeenCalledWith("LOGIN_SUCCESS", mockHandler);
  });

  it("should provide bound getSubscriberCount function", () => {
    const { result } = renderHook(() => useEventSystem());
    
    const count = result.current.getSubscriberCount("LOGIN_SUCCESS");
    
    expect(mockEvents.getSubscriberCount).toHaveBeenCalledWith("LOGIN_SUCCESS");
    expect(count).toBe(5);
  });

  it("should maintain stable API references", () => {
    const { result, rerender } = renderHook(() => useEventSystem());
    
    const firstAPI = {
      publish: result.current.publish,
      subscribe: result.current.subscribe,
      getSubscriberCount: result.current.getSubscriberCount,
    };
    
    rerender();
    
    const secondAPI = {
      publish: result.current.publish,
      subscribe: result.current.subscribe,
      getSubscriberCount: result.current.getSubscriberCount,
    };
    
    expect(firstAPI.publish).toBe(secondAPI.publish);
    expect(firstAPI.subscribe).toBe(secondAPI.subscribe);
    expect(firstAPI.getSubscriberCount).toBe(secondAPI.getSubscriberCount);
  });
});