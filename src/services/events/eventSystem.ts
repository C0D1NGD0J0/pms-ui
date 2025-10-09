export enum EventTypes {
  LOGOUT = "LOGOUT",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  ACCOUNT_SWITCHED = "ACCOUNT_SWITCHED",
  GET_CURRENT_USER = "GET_CURRENT_USER",
  CURRENT_USER_UPDATED = "CURRENT_USER_UPDATED",
  TOKEN_REFRESHED = "TOKEN_REFRESHED",
  AUTH_FAILURE = "AUTH_FAILURE",
  LOGOUT_INITIATED = "LOGOUT_INITIATED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  TEST_EVENT = "TEST_EVENT",
}

export type EventSystemHandler<T = any> = (data: T) => void;
export type Unsubscribe = () => void;

class EventSystem {
  private handlers: Map<string, Set<EventSystemHandler>> = new Map();
  private componentSubscriptions: WeakMap<object, Set<Unsubscribe>> =
    new WeakMap();

  subscribe<T>(event: EventTypes, handler: EventSystemHandler<T>): Unsubscribe {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    this.handlers.get(event)!.add(handler);
    return () => {
      const handlersForEvent = this.handlers.get(event);
      if (handlersForEvent) {
        handlersForEvent.delete(handler);
        //clean up empty handler sets to prevent memory leaks
        if (handlersForEvent.size === 0) {
          this.handlers.delete(event);
        }
      }
    };
  }

  /**
   * Subscribe to an event and track it with a component reference
   * This enables automatic cleanup when the component unmounts
   */
  subscribeComponent<T>(
    component: object,
    event: EventTypes,
    handler: EventSystemHandler<T>
  ): Unsubscribe {
    const unsubscribe = this.subscribe(event, handler);
    // track this subscription with the component
    if (!this.componentSubscriptions.has(component)) {
      this.componentSubscriptions.set(component, new Set());
    }

    this.componentSubscriptions.get(component)!.add(unsubscribe);

    return () => {
      unsubscribe();
      this.componentSubscriptions.get(component)?.delete(unsubscribe);

      // clean up empty component subscriptions
      const componentSubs = this.componentSubscriptions.get(component);
      if (componentSubs && componentSubs.size === 0) {
        this.componentSubscriptions.delete(component);
      }
    };
  }

  /**
   * Unsubscribe all event handlers for a component
   * @param component The component reference
   */
  unsubscribeComponent(component: object): void {
    const subscriptions = this.componentSubscriptions.get(component);
    if (subscriptions) {
      subscriptions.forEach((unsub) => unsub());
      this.componentSubscriptions.delete(component);
    }
  }

  publish<T>(event: EventTypes, data: T): void {
    const handlersForEvent = this.handlers.get(event);
    if (!handlersForEvent) return;

    handlersForEvent.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        console.error(`Error in event handler for ${event}:`, err);
      }
    });
  }

  /**
   * Get the number of subscribers for an event (useful for debugging)
   */
  getSubscriberCount(event: EventTypes): number {
    return this.handlers.get(event)?.size || 0;
  }

  /**
   * Clear all event handlers (use with caution)
   */
  clearAllHandlers(): void {
    this.handlers.clear();
    // don't clear componentSubscriptions as they rely on WeakMap garbage collection which is automatic
  }
}

export const events = new EventSystem();
