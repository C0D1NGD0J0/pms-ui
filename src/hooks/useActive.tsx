import { throttle } from "@utils/helpers";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";

export const useIdleDetector = (
  idleTime: number, // Time in minutes to determine inactivity
  checkInterval: number = 10000 // Interval to check for inactivity
) => {
  const idleTimeInMilliseconds = useMemo(
    () => idleTime * 60 * 1000,
    [idleTime]
  );
  const [isIdle, setIdle] = useState(false);
  const lastActivityTimeRef = useRef(Date.now()); // Ref to store the last activity time

  // Function to check inactivity
  const checkInactivity = useCallback(() => {
    // check to see if the current time - last activity time is greater than idleTime
    if (Date.now() - lastActivityTimeRef.current > idleTimeInMilliseconds) {
      if (!isIdle) {
        setIdle(true); // Set user as idle
      }
    } else {
      setIdle(false); // Reset idle state
    }
  }, [idleTimeInMilliseconds, isIdle]);

  // function to update the last activity time
  const updateLastActivityTime = useCallback(() => {
    lastActivityTimeRef.current = Date.now(); // Update last activity time
    if (isIdle) setIdle(false); // Reset idle state if user was idle
  }, [isIdle]);

  // effect to set up and clean event listeners and interval
  useEffect(() => {
    const intervalId = setInterval(checkInactivity, checkInterval);
    const events = [
      "keydown",
      "mousedown",
      "mousemove",
      "touchstart",
      "touchmove",
      "scroll",
      "focus",
      "visibilitychange",
    ] as const;
    const throttledUpdateLastActivityTime = throttle(
      updateLastActivityTime,
      2000
    );
    events.forEach((event) =>
      window.addEventListener(event, throttledUpdateLastActivityTime)
    );

    return () => {
      clearInterval(intervalId);
      events.forEach((event) =>
        window.removeEventListener(event, throttledUpdateLastActivityTime)
      );
    };
  }, [checkInactivity, updateLastActivityTime, checkInterval]);

  return isIdle;
};
