import { renderHook, act } from "@testing-library/react";
import { useEvent, usePublish } from "@hooks/event/useEvent";
import { EventTypes, events } from "@services/events";

// Mock event system
jest.mock("@services/events", () => {
  const handlers = new Map<string, Set<Function>>();

  return {
    EventTypes: {
      LOGIN_SUCCESS: "LOGIN_SUCCESS",
      GET_CURRENT_USER: "GET_CURRENT_USER",
      TEST_EVENT: "TEST_EVENT",
    },
    events: {
      subscribeComponent: jest.fn((component, event, handler) => {
        if (!handlers.has(event)) {
          handlers.set(event, new Set());
        }
        handlers.get(event)!.add(handler);

        return () => {
          handlers.get(event)?.delete(handler);
        };
      }),
      publish: jest.fn((event, data) => {
        handlers.get(event)?.forEach((handler) => handler(data));
      }),
      subscribe: jest.fn(),
      getSubscriberCount: jest.fn((event) => {
        return handlers.get(event)?.size || 0;
      }),
    },
  };
});

describe("useEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should subscribe to an event", () => {
    const handler = jest.fn();

    renderHook(() => useEvent(EventTypes.LOGIN_SUCCESS as any, handler));

    expect(events.subscribeComponent).toHaveBeenCalled();
  });

  it("should call handler when event is published", () => {
    const handler = jest.fn();
    const testData = { userId: "123" };

    renderHook(() => useEvent(EventTypes.TEST_EVENT as any, handler));

    // Publish event
    act(() => {
      events.publish(EventTypes.TEST_EVENT as any, testData);
    });

    expect(handler).toHaveBeenCalledWith(testData);
  });

  it("should unsubscribe on unmount", () => {
    const handler = jest.fn();

    const { unmount } = renderHook(() =>
      useEvent(EventTypes.TEST_EVENT as any, handler)
    );

    unmount();

    // Publish event after unmount
    act(() => {
      events.publish(EventTypes.TEST_EVENT as any, { data: "test" });
    });

    // Handler should not be called
    expect(handler).not.toHaveBeenCalled();
  });

  it("should update handler reference", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const { rerender } = renderHook(
      ({ handler }) => useEvent(EventTypes.TEST_EVENT as any, handler),
      { initialProps: { handler: handler1 } }
    );

    // Publish with first handler
    act(() => {
      events.publish(EventTypes.TEST_EVENT as any, "data1");
    });

    expect(handler1).toHaveBeenCalledWith("data1");

    // Update handler
    rerender({ handler: handler2 });

    // Publish with second handler
    act(() => {
      events.publish(EventTypes.TEST_EVENT as any, "data2");
    });

    expect(handler2).toHaveBeenCalledWith("data2");
  });
});

describe("usePublish", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a publish function", () => {
    const { result } = renderHook(() => usePublish());

    expect(typeof result.current).toBe("function");
  });

  it("should publish events", () => {
    const { result } = renderHook(() => usePublish());
    const testData = { message: "test" };

    act(() => {
      result.current(EventTypes.TEST_EVENT as any, testData);
    });

    expect(events.publish).toHaveBeenCalledWith(EventTypes.TEST_EVENT, testData);
  });

  it("should maintain stable function reference", () => {
    const { result, rerender } = renderHook(() => usePublish());

    const publishFn1 = result.current;
    rerender();
    const publishFn2 = result.current;

    expect(publishFn1).toBe(publishFn2);
  });
});
