import { events } from "@services/events";
import { useEvents } from "@hooks/event/useEvents";
import { renderHook } from "@testing-library/react";

// Mock the events service
jest.mock("@services/events", () => ({
  events: {
    subscribeComponent: jest.fn(),
  },
}));

const mockEvents = events as jest.Mocked<typeof events>;

describe("useEvents", () => {
  const mockUnsubscribe1 = jest.fn();
  const mockUnsubscribe2 = jest.fn();
  const mockHandler1 = jest.fn();
  const mockHandler2 = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockEvents.subscribeComponent
      .mockReturnValueOnce(mockUnsubscribe1)
      .mockReturnValueOnce(mockUnsubscribe2);
  });

  it("should subscribe to multiple events", () => {
    const subscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
      { event: "LOGOUT" as const, handler: mockHandler2 },
    ];

    renderHook(() => useEvents(subscriptions));

    expect(mockEvents.subscribeComponent).toHaveBeenCalledTimes(2);
    expect(mockEvents.subscribeComponent).toHaveBeenNthCalledWith(
      1,
      expect.any(Object),
      "LOGIN_SUCCESS",
      expect.any(Function)
    );
    expect(mockEvents.subscribeComponent).toHaveBeenNthCalledWith(
      2,
      expect.any(Object),
      "LOGOUT",
      expect.any(Function)
    );
  });

  it("should unsubscribe from all events on unmount", () => {
    const subscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
      { event: "LOGOUT" as const, handler: mockHandler2 },
    ];

    const { unmount } = renderHook(() => useEvents(subscriptions));

    unmount();

    expect(mockUnsubscribe1).toHaveBeenCalled();
    expect(mockUnsubscribe2).toHaveBeenCalled();
  });

  it("should handle empty subscriptions array", () => {
    renderHook(() => useEvents([]));

    expect(mockEvents.subscribeComponent).not.toHaveBeenCalled();
  });

  it("should update handlers when subscriptions change", () => {
    const initialSubscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
    ];

    const { rerender } = renderHook(
      ({ subs }) => useEvents(subs),
      { initialProps: { subs: initialSubscriptions } }
    );

    // Get the callback from first subscription
    const firstCallback = mockEvents.subscribeComponent.mock.calls[0][2];

    // Update with new handler
    const newHandler = jest.fn();
    const updatedSubscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: newHandler },
    ];

    rerender({ subs: updatedSubscriptions });

    // Test that the new handler is used
    firstCallback("test-data");
    expect(newHandler).toHaveBeenCalledWith("test-data");
    expect(mockHandler1).not.toHaveBeenCalled();
  });

  it("should resubscribe when subscription events change", () => {
    const initialSubscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
    ];

    const { rerender } = renderHook(
      ({ subs }) => useEvents(subs),
      { initialProps: { subs: initialSubscriptions } }
    );

    expect(mockEvents.subscribeComponent).toHaveBeenCalledTimes(1);

    // Change to different event
    const newSubscriptions = [
      { event: "LOGOUT" as const, handler: mockHandler1 },
    ];

    rerender({ subs: newSubscriptions });

    expect(mockEvents.subscribeComponent).toHaveBeenCalledTimes(3); // Initial + cleanup + new
    expect(mockUnsubscribe1).toHaveBeenCalled(); // Previous subscription cleaned up
  });

  it("should handle adding new subscriptions", () => {
    const initialSubscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
    ];

    const { rerender } = renderHook(
      ({ subs }) => useEvents(subs),
      { initialProps: { subs: initialSubscriptions } }
    );

    expect(mockEvents.subscribeComponent).toHaveBeenCalledTimes(1);

    // Add another subscription
    const expandedSubscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
      { event: "LOGOUT" as const, handler: mockHandler2 },
    ];

    rerender({ subs: expandedSubscriptions });

    expect(mockEvents.subscribeComponent).toHaveBeenCalledTimes(3); // 1 + 2 more
  });

  it("should handle removing subscriptions", () => {
    const initialSubscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
      { event: "LOGOUT" as const, handler: mockHandler2 },
    ];

    const { rerender } = renderHook(
      ({ subs }) => useEvents(subs),
      { initialProps: { subs: initialSubscriptions } }
    );

    expect(mockEvents.subscribeComponent).toHaveBeenCalledTimes(2);

    // Remove one subscription
    const reducedSubscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
    ];

    rerender({ subs: reducedSubscriptions });

    expect(mockUnsubscribe1).toHaveBeenCalled();
    expect(mockUnsubscribe2).toHaveBeenCalled();
  });

  it("should handle null/undefined unsubscribe functions gracefully", () => {
    mockEvents.subscribeComponent.mockReturnValue(null as any);

    const subscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
    ];

    const { unmount } = renderHook(() => useEvents(subscriptions));

    // Should not throw error on unmount
    expect(() => unmount()).not.toThrow();
  });

  it("should use same component reference for all subscriptions", () => {
    const subscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
      { event: "LOGOUT" as const, handler: mockHandler2 },
    ];

    renderHook(() => useEvents(subscriptions));

    const componentRef1 = mockEvents.subscribeComponent.mock.calls[0][0];
    const componentRef2 = mockEvents.subscribeComponent.mock.calls[1][0];

    expect(componentRef1).toBe(componentRef2);
  });

  it("should call correct handlers for their respective events", () => {
    const subscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
      { event: "LOGOUT" as const, handler: mockHandler2 },
    ];

    renderHook(() => useEvents(subscriptions));

    // Get callbacks for both subscriptions
    const callback1 = mockEvents.subscribeComponent.mock.calls[0][2];
    const callback2 = mockEvents.subscribeComponent.mock.calls[1][2];

    // Trigger first event
    callback1("login-data");
    expect(mockHandler1).toHaveBeenCalledWith("login-data");
    expect(mockHandler2).not.toHaveBeenCalled();

    jest.clearAllMocks();

    // Trigger second event
    callback2("logout-data");
    expect(mockHandler2).toHaveBeenCalledWith("logout-data");
    expect(mockHandler1).not.toHaveBeenCalled();
  });

  it("should maintain handler references across re-renders with same subscriptions", () => {
    const subscriptions = [
      { event: "LOGIN_SUCCESS" as const, handler: mockHandler1 },
    ];

    const { rerender } = renderHook(
      ({ subs }) => useEvents(subs),
      { initialProps: { subs: subscriptions } }
    );

    const firstCallback = mockEvents.subscribeComponent.mock.calls[0][2];

    // Re-render with same subscriptions
    rerender({ subs: subscriptions });

    // Handler should still work with original callback
    firstCallback("test-data");
    expect(mockHandler1).toHaveBeenCalledWith("test-data");
  });
});