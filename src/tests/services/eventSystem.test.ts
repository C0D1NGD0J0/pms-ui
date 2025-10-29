import { events, EventTypes, EventSystemHandler } from "@services/events/eventSystem";

describe("EventSystem", () => {
  beforeEach(() => {
    // Clear all handlers before each test to ensure clean state
    events.clearAllHandlers();
  });

  describe("subscribe", () => {
    it("should subscribe to an event", () => {
      const handler = jest.fn();
      const unsubscribe = events.subscribe(EventTypes.LOGIN_SUCCESS, handler);

      expect(typeof unsubscribe).toBe("function");
      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(1);
    });

    it("should allow multiple subscribers to same event", () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const handler3 = jest.fn();

      events.subscribe(EventTypes.LOGOUT, handler1);
      events.subscribe(EventTypes.LOGOUT, handler2);
      events.subscribe(EventTypes.LOGOUT, handler3);

      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(3);
    });

    it("should handle subscriptions to different events", () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      events.subscribe(EventTypes.LOGIN_SUCCESS, handler1);
      events.subscribe(EventTypes.LOGOUT, handler2);

      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(1);
      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(1);
    });

    it("should return unsubscribe function that removes handler", () => {
      const handler = jest.fn();
      const unsubscribe = events.subscribe(EventTypes.SESSION_EXPIRED, handler);

      expect(events.getSubscriberCount(EventTypes.SESSION_EXPIRED)).toBe(1);

      unsubscribe();

      expect(events.getSubscriberCount(EventTypes.SESSION_EXPIRED)).toBe(0);
    });

    it("should clean up empty handler sets after unsubscribe", () => {
      const handler = jest.fn();
      const unsubscribe = events.subscribe(EventTypes.AUTH_FAILURE, handler);

      events.publish(EventTypes.AUTH_FAILURE, { message: "Test" });
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();

      events.publish(EventTypes.AUTH_FAILURE, { message: "Test2" });
      expect(handler).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it("should handle unsubscribe being called multiple times", () => {
      const handler = jest.fn();
      const unsubscribe = events.subscribe(EventTypes.LOGOUT, handler);

      unsubscribe();
      unsubscribe(); // Should not throw error

      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(0);
    });

    it("should only add same handler reference once (Set behavior)", () => {
      const handler = jest.fn();

      events.subscribe(EventTypes.TOKEN_REFRESHED, handler);
      events.subscribe(EventTypes.TOKEN_REFRESHED, handler);

      // Set only stores unique references, so count should be 1
      expect(events.getSubscriberCount(EventTypes.TOKEN_REFRESHED)).toBe(1);

      events.publish(EventTypes.TOKEN_REFRESHED, {});

      // Handler should be called once (Set prevents duplicates)
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe("publish", () => {
    it("should call subscribed handler when event is published", () => {
      const handler = jest.fn();
      events.subscribe(EventTypes.LOGIN_SUCCESS, handler);

      events.publish(EventTypes.LOGIN_SUCCESS, { userId: "123" });

      expect(handler).toHaveBeenCalledWith({ userId: "123" });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should call all subscribed handlers", () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const handler3 = jest.fn();

      events.subscribe(EventTypes.ACCOUNT_SWITCHED, handler1);
      events.subscribe(EventTypes.ACCOUNT_SWITCHED, handler2);
      events.subscribe(EventTypes.ACCOUNT_SWITCHED, handler3);

      events.publish(EventTypes.ACCOUNT_SWITCHED, { accountId: "new-account" });

      expect(handler1).toHaveBeenCalledWith({ accountId: "new-account" });
      expect(handler2).toHaveBeenCalledWith({ accountId: "new-account" });
      expect(handler3).toHaveBeenCalledWith({ accountId: "new-account" });
    });

    it("should not call handlers for different events", () => {
      const loginHandler = jest.fn();
      const logoutHandler = jest.fn();

      events.subscribe(EventTypes.LOGIN_SUCCESS, loginHandler);
      events.subscribe(EventTypes.LOGOUT, logoutHandler);

      events.publish(EventTypes.LOGIN_SUCCESS, {});

      expect(loginHandler).toHaveBeenCalledTimes(1);
      expect(logoutHandler).not.toHaveBeenCalled();
    });

    it("should handle publishing event with no subscribers", () => {
      expect(() => {
        events.publish(EventTypes.RATE_LIMIT_EXCEEDED, { retryAfter: 60 });
      }).not.toThrow();
    });

    it("should pass data correctly to handlers", () => {
      const handler = jest.fn();
      events.subscribe(EventTypes.CURRENT_USER_UPDATED, handler);

      const userData = {
        uid: "user-123",
        email: "user@example.com",
        role: "admin",
      };

      events.publish(EventTypes.CURRENT_USER_UPDATED, userData);

      expect(handler).toHaveBeenCalledWith(userData);
    });

    it("should catch and log handler errors without breaking other handlers", () => {
      const errorHandler = jest.fn(() => {
        throw new Error("Handler error");
      });
      const successHandler = jest.fn();

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      events.subscribe(EventTypes.TEST_EVENT, errorHandler);
      events.subscribe(EventTypes.TEST_EVENT, successHandler);

      events.publish(EventTypes.TEST_EVENT, {});

      expect(errorHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error in event handler"),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should handle null/undefined data", () => {
      const handler = jest.fn();
      events.subscribe(EventTypes.LOGOUT_INITIATED, handler);

      events.publish(EventTypes.LOGOUT_INITIATED, null);
      expect(handler).toHaveBeenCalledWith(null);

      events.publish(EventTypes.LOGOUT_INITIATED, undefined);
      expect(handler).toHaveBeenCalledWith(undefined);
    });
  });

  describe("subscribeComponent", () => {
    it("should subscribe with component reference", () => {
      const component = {};
      const handler = jest.fn();

      const unsubscribe = events.subscribeComponent(
        component,
        EventTypes.LOGIN_SUCCESS,
        handler
      );

      expect(typeof unsubscribe).toBe("function");
      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(1);
    });

    it("should track multiple subscriptions for same component", () => {
      const component = {};
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      events.subscribeComponent(component, EventTypes.LOGIN_SUCCESS, handler1);
      events.subscribeComponent(component, EventTypes.LOGOUT, handler2);

      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(1);
      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(1);
    });

    it("should allow unsubscribe through returned function", () => {
      const component = {};
      const handler = jest.fn();

      const unsubscribe = events.subscribeComponent(
        component,
        EventTypes.SESSION_EXPIRED,
        handler
      );

      expect(events.getSubscriberCount(EventTypes.SESSION_EXPIRED)).toBe(1);

      unsubscribe();

      expect(events.getSubscriberCount(EventTypes.SESSION_EXPIRED)).toBe(0);
    });

    it("should receive published events", () => {
      const component = {};
      const handler = jest.fn();

      events.subscribeComponent(component, EventTypes.TOKEN_REFRESHED, handler);

      events.publish(EventTypes.TOKEN_REFRESHED, { token: "new-token" });

      expect(handler).toHaveBeenCalledWith({ token: "new-token" });
    });
  });

  describe("unsubscribeComponent", () => {
    it("should unsubscribe all handlers for a component", () => {
      const component = {};
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      events.subscribeComponent(component, EventTypes.LOGIN_SUCCESS, handler1);
      events.subscribeComponent(component, EventTypes.LOGOUT, handler2);

      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(1);
      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(1);

      events.unsubscribeComponent(component);

      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(0);
      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(0);
    });

    it("should not affect other components subscriptions", () => {
      const component1 = {};
      const component2 = {};
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      events.subscribeComponent(component1, EventTypes.LOGIN_SUCCESS, handler1);
      events.subscribeComponent(component2, EventTypes.LOGIN_SUCCESS, handler2);

      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(2);

      events.unsubscribeComponent(component1);

      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(1);

      events.publish(EventTypes.LOGIN_SUCCESS, {});
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it("should handle unsubscribing component with no subscriptions", () => {
      const component = {};

      expect(() => {
        events.unsubscribeComponent(component);
      }).not.toThrow();
    });

    it("should handle unsubscribing same component multiple times", () => {
      const component = {};
      const handler = jest.fn();

      events.subscribeComponent(component, EventTypes.LOGOUT, handler);
      events.unsubscribeComponent(component);
      events.unsubscribeComponent(component);

      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(0);
    });
  });

  describe("getSubscriberCount", () => {
    it("should return 0 for event with no subscribers", () => {
      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(0);
    });

    it("should return correct count for subscribed events", () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      events.subscribe(EventTypes.ACCOUNT_SWITCHED, handler1);
      events.subscribe(EventTypes.ACCOUNT_SWITCHED, handler2);

      expect(events.getSubscriberCount(EventTypes.ACCOUNT_SWITCHED)).toBe(2);
    });

    it("should update count after unsubscribe", () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      const unsub1 = events.subscribe(EventTypes.GET_CURRENT_USER, handler1);
      events.subscribe(EventTypes.GET_CURRENT_USER, handler2);

      expect(events.getSubscriberCount(EventTypes.GET_CURRENT_USER)).toBe(2);

      unsub1();

      expect(events.getSubscriberCount(EventTypes.GET_CURRENT_USER)).toBe(1);
    });
  });

  describe("clearAllHandlers", () => {
    it("should remove all event handlers", () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      events.subscribe(EventTypes.LOGIN_SUCCESS, handler1);
      events.subscribe(EventTypes.LOGOUT, handler2);

      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(1);
      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(1);

      events.clearAllHandlers();

      expect(events.getSubscriberCount(EventTypes.LOGIN_SUCCESS)).toBe(0);
      expect(events.getSubscriberCount(EventTypes.LOGOUT)).toBe(0);
    });

    it("should allow new subscriptions after clearing", () => {
      const handler = jest.fn();

      events.subscribe(EventTypes.SESSION_EXPIRED, handler);
      events.clearAllHandlers();

      const newHandler = jest.fn();
      events.subscribe(EventTypes.SESSION_EXPIRED, newHandler);

      expect(events.getSubscriberCount(EventTypes.SESSION_EXPIRED)).toBe(1);

      events.publish(EventTypes.SESSION_EXPIRED, {});

      expect(handler).not.toHaveBeenCalled();
      expect(newHandler).toHaveBeenCalled();
    });
  });

  describe("Memory management", () => {
    it("should not hold references to unsubscribed handlers", () => {
      const handler = jest.fn();
      const unsubscribe = events.subscribe(EventTypes.TEST_EVENT, handler);

      unsubscribe();

      events.publish(EventTypes.TEST_EVENT, {});

      expect(handler).not.toHaveBeenCalled();
      expect(events.getSubscriberCount(EventTypes.TEST_EVENT)).toBe(0);
    });

    it("should clean up component subscriptions properly", () => {
      const component = {};
      const handler = jest.fn();

      events.subscribeComponent(component, EventTypes.LOGIN_SUCCESS, handler);
      events.unsubscribeComponent(component);

      events.publish(EventTypes.LOGIN_SUCCESS, {});

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complex subscription and publish flow", () => {
      const loginHandler = jest.fn();
      const userUpdateHandler = jest.fn();
      const logoutHandler = jest.fn();

      events.subscribe(EventTypes.LOGIN_SUCCESS, loginHandler);
      events.subscribe(EventTypes.CURRENT_USER_UPDATED, userUpdateHandler);
      events.subscribe(EventTypes.LOGOUT, logoutHandler);

      events.publish(EventTypes.LOGIN_SUCCESS, { userId: "123" });
      events.publish(EventTypes.CURRENT_USER_UPDATED, { name: "John" });

      expect(loginHandler).toHaveBeenCalledTimes(1);
      expect(userUpdateHandler).toHaveBeenCalledTimes(1);
      expect(logoutHandler).not.toHaveBeenCalled();

      events.publish(EventTypes.LOGOUT, {});

      expect(logoutHandler).toHaveBeenCalledTimes(1);
    });

    it("should handle component lifecycle simulation", () => {
      // Component mount
      const component = {};
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      events.subscribeComponent(component, EventTypes.LOGIN_SUCCESS, handler1);
      events.subscribeComponent(component, EventTypes.CURRENT_USER_UPDATED, handler2);

      // Component receives events
      events.publish(EventTypes.LOGIN_SUCCESS, {});
      events.publish(EventTypes.CURRENT_USER_UPDATED, {});

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      // Component unmount
      events.unsubscribeComponent(component);

      // Component should not receive events after unmount
      events.publish(EventTypes.LOGIN_SUCCESS, {});
      events.publish(EventTypes.CURRENT_USER_UPDATED, {});

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it("should handle authentication flow events", () => {
      const handlers = {
        login: jest.fn(),
        sessionExpired: jest.fn(),
        logout: jest.fn(),
        authFailure: jest.fn(),
      };

      events.subscribe(EventTypes.LOGIN_SUCCESS, handlers.login);
      events.subscribe(EventTypes.SESSION_EXPIRED, handlers.sessionExpired);
      events.subscribe(EventTypes.LOGOUT, handlers.logout);
      events.subscribe(EventTypes.AUTH_FAILURE, handlers.authFailure);

      // Login flow
      events.publish(EventTypes.LOGIN_SUCCESS, { userId: "123" });
      expect(handlers.login).toHaveBeenCalled();

      // Session expired
      events.publish(EventTypes.SESSION_EXPIRED, { reason: "timeout" });
      expect(handlers.sessionExpired).toHaveBeenCalled();

      // Auth failure
      events.publish(EventTypes.AUTH_FAILURE, { error: "Invalid credentials" });
      expect(handlers.authFailure).toHaveBeenCalled();

      // Logout
      events.publish(EventTypes.LOGOUT, {});
      expect(handlers.logout).toHaveBeenCalled();
    });
  });

  describe("EventTypes enum", () => {
    it("should have all required event types", () => {
      expect(EventTypes.LOGOUT).toBeDefined();
      expect(EventTypes.LOGIN_SUCCESS).toBeDefined();
      expect(EventTypes.SESSION_EXPIRED).toBeDefined();
      expect(EventTypes.ACCOUNT_SWITCHED).toBeDefined();
      expect(EventTypes.GET_CURRENT_USER).toBeDefined();
      expect(EventTypes.CURRENT_USER_UPDATED).toBeDefined();
      expect(EventTypes.TOKEN_REFRESHED).toBeDefined();
      expect(EventTypes.AUTH_FAILURE).toBeDefined();
      expect(EventTypes.LOGOUT_INITIATED).toBeDefined();
      expect(EventTypes.RATE_LIMIT_EXCEEDED).toBeDefined();
      expect(EventTypes.TEST_EVENT).toBeDefined();
    });
  });
});
