import { DependencyList, useEffect, useMemo, useRef } from "react";
import {
  EventSystemHandler,
  Unsubscribe,
  EventTypes,
  events,
} from "@services/events";

interface EventSubscription {
  event: EventTypes;
  handler: EventSystemHandler;
}

/**
 * Hook for subscribing to multiple events
 */
export function useEvents(subscriptions: EventSubscription[]) {
  const componentRef = useRef({});

  const handlerRefs = useMemo(() => {
    return subscriptions.map((sub) => ({
      event: sub.event,
      ref: { current: sub.handler },
    }));
  }, [subscriptions]);

  useEffect(() => {
    subscriptions.forEach((sub, i) => {
      handlerRefs[i].ref.current = sub.handler;
    });

    const unsubscribes: Unsubscribe[] = handlerRefs.map(({ event, ref }) => {
      const callback = (data: any) => ref.current(data);
      return events.subscribeComponent(componentRef.current, event, callback);
    });

    return () => {
      unsubscribes.forEach((unsub) => {
        if (typeof unsub === "function") {
          unsub();
        }
      });
    };
  }, [subscriptions, handlerRefs]);
}
