import { useCallback, useEffect, useState, useRef } from "react";
import { throttle } from "@utils/helpers";

const useIdleTimer = (idleTime: number, checkInterval: number = 10000) => {
  const idleTimeInMilliseconds = idleTime * 60000;
  const [isIdle, setIdle] = useState(false);
  const lastActivityTimeRef = useRef(Date.now());

  const checkInactivity = useCallback(() => {
    if (Date.now() - lastActivityTimeRef.current > idleTimeInMilliseconds) {
      if (!isIdle) {
        setIdle(true);
      }
    } else {
      setIdle(false);
    }
  }, [idleTimeInMilliseconds, isIdle]);

  const updateLastActivityTime = useCallback(() => {
    lastActivityTimeRef.current = Date.now();
    if (isIdle) setIdle(false);
  }, [isIdle]);

  const getRemainingTime = () => {
    const timeElapsed = Date.now() - lastActivityTimeRef.current;
    return Math.max(idleTimeInMilliseconds - timeElapsed, 0);
  };

  useEffect(() => {
    const intervalId = setInterval(checkInactivity, checkInterval);
    const events: string[] = [
      "keypress",
      "touchmove",
      "mousemove",
      "click",
      "scroll",
    ];

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

export default useIdleTimer;
