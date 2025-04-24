import { useCallback, useEffect, useRef } from "react";
import { EventSystemHandler, EventTypes, events } from "@services/events";

/**
 *  hook for subscribing to a single event
 */
export function useEvent<T>(
  event: EventTypes,
  eventHandler: EventSystemHandler<T>
) {
  const handlerRef = useRef(eventHandler);

  // update handler reference on each change
  useEffect(() => {
    handlerRef.current = eventHandler;
  }, [eventHandler]);

  const componentRef = useRef({});

  useEffect(() => {
    const callback = (data: T) => handlerRef.current(data);

    const unsubscribe = events.subscribeComponent(
      componentRef.current,
      event,
      callback
    );

    if (typeof unsubscribe !== "function") {
      console.warn(
        `useEvent: unsubscribe not a function for this event "${event}"`
      );
      return () => {};
    }

    return unsubscribe;
  }, [event]);
}

/**
 * Hook for publishing application events
 */
export function usePublish() {
  return useCallback((event: EventTypes, data: any) => {
    events.publish(event, data);
  }, []);
}

/**
 * Hook for accessing the full event system API
 */
export function useEventSystem() {
  const publish = usePublish();

  return {
    publish,
    subscribe: events.subscribe.bind(events),
    getSubscriberCount: events.getSubscriberCount.bind(events),
  };
}
